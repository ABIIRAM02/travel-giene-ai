
"use client";

import { useAppSelector } from "@/redux/hooks";
import { fetchTripById } from "@/services/client/trip.client";
import { useQuery } from "@tanstack/react-query";

export function useTripPoll() {

  const itineraryId = useAppSelector(
    (state) => state.itinerary.generateItineraryForId,
  );

  return useQuery({
    queryKey: ["trip", itineraryId],

    queryFn: () => fetchTripById(itineraryId!),

    enabled: !!itineraryId,

    refetchInterval: (query) => {
      const status = query.state.data?.trip?.itineraryStatus;

      if (status === "COMPLETED" || status === "FAILED") {
        return false;
      }

      return 3000;
    },
  });
}