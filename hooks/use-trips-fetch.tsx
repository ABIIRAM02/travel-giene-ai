import { fetchTrips } from "@/services/client/trip.client";
import { tripsResponse } from "@/utils/types";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useTripFetch = (): UseQueryResult<tripsResponse, Error> => {
  return useQuery({
    queryKey: ["trips"],
    queryFn: fetchTrips,
    refetchOnWindowFocus: false, // disable auto-refetch on focus
    refetchOnReconnect: false, // disable auto-refetch on reconnect
    refetchInterval: false, // no polling
  });
};
