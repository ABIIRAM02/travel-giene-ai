import { fetchGeoapifyCandidates } from "./geoapify";
import { LivePlace, PlaceCandidate, SourceResult } from "@/utils/types";

const DEFAULT_RADIUS_KM = 30;

const CACHE_GRID_DEG = 0.1;

const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const PARTIAL_CACHE_TTL_MS = 60 * 60 * 1000;

const NEARBY_DUPLICATE_DISTANCE_KM = 1;

const GENERIC_SUFFIXES = [
  "peak",
  "mountain",
  "hill",
  "viewpoint",
  "view point",
  "lookout",
];

const NOISE_NAMES = new Set([
  "parking",
  "car parking",
  "parking area",
  "parking lot",
  "park area",
  "tea",
  "tourist spot",
  "tourist spot forest",
  "tourist place",
  "unnamed",
  "unknown",
]);

async function fetchCandidates(
  lat: number,
  lon: number,
  radiusKm: number,
): Promise<SourceResult> {
  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!apiKey) {
    throw new Error("GEOAPIFY_API_KEY is not configured");
  }

  return fetchGeoapifyCandidates(lat, lon, radiusKm, apiKey);
}

function normalizeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isNoise(place: PlaceCandidate): boolean {
  const name = place.tags.name?.trim();

  if (!name) return true;

  const normalizedName = normalizeName(name);

  if (NOISE_NAMES.has(normalizedName)) return true;

  if (/^point\s*#?\s*\d+$/i.test(name)) return true;

  if (/^viewpoint\s*#?\s*\d+$/i.test(name)) return true;

  if (/\bparking\b/i.test(name)) return true;

  if (/\bstay place\b/i.test(name)) return true;

  if (
    place.tags.amenity === "parking" ||
    place.tags.amenity === "fuel" ||
    place.tags.highway === "parking_aisle"
  ) {
    return true;
  }

  return false;
}

function getDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const earthRadiusKm = 6371;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function isNearbyNameDuplicate(first: LivePlace, second: LivePlace): boolean {
  const firstName = normalizeName(first.name);
  const secondName = normalizeName(second.name);

  if (firstName === secondName) return true;

  const distance = getDistanceKm(
    first.latitude,
    first.longitude,
    second.latitude,
    second.longitude,
  );

  if (distance > NEARBY_DUPLICATE_DISTANCE_KM) return false;

  return GENERIC_SUFFIXES.some((suffix) => {
    const firstBase = firstName.replace(
      new RegExp(`\\s+${suffix.replace(/\s+/g, "\\s+")}$`),
      "",
    );

    const secondBase = secondName.replace(
      new RegExp(`\\s+${suffix.replace(/\s+/g, "\\s+")}$`),
      "",
    );

    return firstBase === secondName || secondBase === firstName;
  });
}

function normalizePlaces(candidates: PlaceCandidate[]): LivePlace[] {
  const places: LivePlace[] = [];

  const wikidataIds = new Set<string>();

  for (const { id, latitude, longitude, tags } of candidates) {
    const name = tags.name?.trim();

    if (!name) continue;

    const candidate: PlaceCandidate = {
      id,
      latitude,
      longitude,
      tags,
    };

    if (isNoise(candidate)) continue;

    const wikidata = tags.wikidata;

    if (wikidata && wikidataIds.has(wikidata)) {
      continue;
    }

    const website = tags.website ?? tags["contact:website"];

    const place: LivePlace = {
      id,
      name,
      category:
        tags.tourism ??
        tags.historic ??
        tags.natural ??
        tags.leisure ??
        tags.amenity ??
        "attraction",
      latitude,
      longitude,
      ...(tags.description ? { description: tags.description } : {}),
      ...(website ? { website } : {}),
      ...(wikidata ? { wikidata } : {}),
      ...(tags.wikipedia ? { wikipedia: tags.wikipedia } : {}),
      ...(tags.opening_hours ? { openingHours: tags.opening_hours } : {}),
    };

    const duplicate = places.some((existing) =>
      isNearbyNameDuplicate(existing, place),
    );

    if (duplicate) continue;

    places.push(place);

    if (wikidata) {
      wikidataIds.add(wikidata);
    }
  }

  return places;
}

type CacheEntry = {
  places: LivePlace[];
  fetchedAt: number;
  ttlMs: number;
};

const cache = new Map<string, CacheEntry>();

const inflight = new Map<string, Promise<LivePlace[]>>();

function snapToGrid(value: number): number {
  return Number(
    (Math.round(value / CACHE_GRID_DEG) * CACHE_GRID_DEG).toFixed(1),
  );
}

export async function getLivePlaces(
  latitude: number,
  longitude: number,
  radiusKm = DEFAULT_RADIUS_KM,
): Promise<LivePlace[]> {
  const lat = snapToGrid(latitude);
  const lon = snapToGrid(longitude);

  const key = `${lat}:${lon}:${radiusKm}`;

  const cached = cache.get(key);

  if (cached && Date.now() - cached.fetchedAt < cached.ttlMs) {
    return cached.places;
  }

  const pending = inflight.get(key);

  if (pending) return pending;

  const request = (async () => {
    try {
      const { candidates, complete } = await fetchCandidates(
        lat,
        lon,
        radiusKm,
      );

      const places = normalizePlaces(candidates);

      cache.set(key, {
        places,
        fetchedAt: Date.now(),
        ttlMs: complete ? CACHE_TTL_MS : PARTIAL_CACHE_TTL_MS,
      });

      return places;
    } catch (error) {
      if (cached) return cached.places;

      throw error;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, request);

  return request;
}
