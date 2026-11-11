export type RouteStop = {
  name: string;
  latitude: number;
  longitude: number;
};

export type RouteLeg = {
  from: string;
  to: string;
  distanceKm: number;
  durationMinutes: number;
};

type OsrmMultiRouteResponse = {
  code: string;
  routes: {
    legs: {
      distance: number;
      duration: number;
    }[];
  }[];
};

export async function getRouteEstimates(
  stops: RouteStop[],
): Promise<RouteLeg[]> {
  if (stops.length < 2) {
    return [];
  }

  const coordinates = stops
    .map(({ latitude, longitude }) => `${longitude},${latitude}`)
    .join(";");

  const url = new URL(
    `https://router.project-osrm.org/route/v1/driving/${coordinates}`,
  );

  url.searchParams.set("overview", "false");
  url.searchParams.set("steps", "false");

  const response = await fetch(url, {
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`OSRM request failed with status ${response.status}`);
  }

  const data: OsrmMultiRouteResponse = await response.json();

  if (data.code !== "Ok" || !data.routes.length) {
    throw new Error(`OSRM could not find a route: ${data.code}`);
  }

  console.log(
    "Route estimates:",
    data.routes[0].legs.map((leg, index) => ({
      from: stops[index].name,
      to: stops[index + 1].name,
      distanceKm: Math.round((leg.distance / 1000) * 10) / 10,
      durationMinutes: Math.round(leg.duration / 60),
    })),
  );

  return data.routes[0].legs.map((leg, index) => ({
    from: stops[index].name,
    to: stops[index + 1].name,
    distanceKm: Math.round((leg.distance / 1000) * 10) / 10,
    durationMinutes: Math.round(leg.duration / 60),
  }));
}
