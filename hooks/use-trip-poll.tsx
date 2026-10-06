
"use client";

import { fetchTripById } from "@/services/client/trip.client";
import { useQuery } from "@tanstack/react-query";

export function useTripPoll(tripId: string | null) {
  return useQuery({
    queryKey: ["trip", tripId],

    queryFn: () => fetchTripById(tripId!),

    enabled: !!tripId,

    refetchInterval: (query) => {
      const status = query.state.data?.trip?.itineraryStatus;

      if (status === "COMPLETED" || status === "FAILED") {
        return false;
      }

      return 3000;
    },
  });
}