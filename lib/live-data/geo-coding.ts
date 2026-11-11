export type Coordinates = {
  latitude: number;
  longitude: number;
};

type NominatimResult = {
  lat: string;
  lon: string;
  display_name: string;
};

export async function getDestinationCoordinates(
  destination: string,
): Promise<Coordinates> {
  const url = new URL("https://nominatim.openstreetmap.org/search");

  url.searchParams.set("q", destination);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", "in");

  const response = await fetch(url, {
    headers: {
      "User-Agent": "TripGenie/1.0",
    },
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Geocoding failed with status ${response.status}`);
  }

  const results: NominatimResult[] = await response.json();

  if (results.length === 0) {
    throw new Error(`Destination not found: ${destination}`);
  }

  const result = results[0];

  return {
    latitude: Number(result.lat),
    longitude: Number(result.lon),
  };
}
