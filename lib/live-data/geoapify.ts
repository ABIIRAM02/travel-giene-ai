import { PlaceCandidate, SourceResult } from "@/utils/types";

const GEOAPIFY_PLACES_URL = "https://api.geoapify.com/v2/places";

const REQUEST_TIMEOUT_MS = 10_000;

const SIGHTS_LIMIT = 60;
const PARKS_LIMIT = 20;

const SIGHT_CATEGORIES = [
  "tourism.sights",
  "tourism.attraction",
  "heritage",
  "entertainment.museum",
  "entertainment.zoo",
  "entertainment.theme_park",
  "entertainment.aquarium",
  "natural.mountain.peak",
  "natural.protected_area",
];

const PARK_CATEGORIES = ["leisure.park"];

type GeoapifyFeature = {
  properties?: {
    place_id?: string;
    name?: string;
    lat?: number;
    lon?: number;
    categories?: string[];
    website?: string;
    opening_hours?: string;
    contact?: { website?: string };
    wiki_and_media?: {
      wikidata?: string;
      wikipedia?: string;
      image?: string;
    };
    datasource?: {
      raw?: Record<string, unknown>;
    };
  };
  geometry?: {
    type?: string;
    coordinates?: unknown;
  };
};

async function search(
  apiKey: string,
  categories: string[],
  lat: number,
  lon: number,
  radiusKm: number,
  limit: number,
): Promise<GeoapifyFeature[]> {
  const url = new URL(GEOAPIFY_PLACES_URL);

  url.search = new URLSearchParams({
    categories: categories.join(","),
    conditions: "named",
    filter: `circle:${lon},${lat},${Math.round(radiusKm * 1000)}`,
    bias: `proximity:${lon},${lat}`,
    limit: String(limit),
    lang: "en",
    apiKey,
  }).toString();

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    const body = (await response.text()).slice(0, 200);
    throw new Error(`Geoapify HTTP ${response.status}: ${body}`);
  }

  const data = (await response.json()) as {
    features?: GeoapifyFeature[];
  };

  return data.features ?? [];
}

function toCandidate(feature: GeoapifyFeature): PlaceCandidate[] {
  const props = feature.properties;
  const name = props?.name;

  if (!props || !name) return [];

  let latitude = props.lat;
  let longitude = props.lon;

  const coords = feature.geometry?.coordinates;

  if (
    (latitude === undefined || longitude === undefined) &&
    Array.isArray(coords) &&
    typeof coords[0] === "number" &&
    typeof coords[1] === "number"
  ) {
    longitude = coords[0];
    latitude = coords[1];
  }

  if (latitude === undefined || longitude === undefined) return [];

  const raw = props.datasource?.raw ?? {};
  const tags: Record<string, string> = {};

  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") {
      tags[key] = value;
    }
  }

  tags.name = name;

  const wikidata = props.wiki_and_media?.wikidata ?? tags.wikidata;
  const wikipedia = props.wiki_and_media?.wikipedia ?? tags.wikipedia;
  const website =
    props.website ?? props.contact?.website ?? tags.website;
  const openingHours = props.opening_hours ?? tags.opening_hours;
  const image = props.wiki_and_media?.image ?? tags.image;

  if (wikidata) tags.wikidata = wikidata;
  if (wikipedia) tags.wikipedia = wikipedia;
  if (website) tags.website = website;
  if (openingHours) tags.opening_hours = openingHours;
  if (image) tags.image = image;

  const id = `geoapify-${props.place_id ?? `${latitude},${longitude}`}`;

  return [
    {
      id,
      latitude,
      longitude,
      tags,
    },
  ];
}

export async function fetchGeoapifyCandidates(
  lat: number,
  lon: number,
  radiusKm: number,
  apiKey: string,
): Promise<SourceResult> {
  const [sights, parks] = await Promise.allSettled([
    search(apiKey, SIGHT_CATEGORIES, lat, lon, radiusKm, SIGHTS_LIMIT),
    search(apiKey, PARK_CATEGORIES, lat, lon, radiusKm, PARKS_LIMIT),
  ]);

  if (sights.status === "rejected") {
    throw sights.reason;
  }

  const features = [...sights.value];
  let complete = true;

  if (parks.status === "fulfilled") {
    features.push(...parks.value);
  } else {
    complete = false;

    console.warn(
      `[geoapify] parks request failed, continuing without parks: ${
        parks.reason instanceof Error
          ? parks.reason.message
          : String(parks.reason)
      }`,
    );
  }

  const candidates = features.flatMap(toCandidate);

  return { candidates, complete };
}