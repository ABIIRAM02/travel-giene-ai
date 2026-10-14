"use client";

import { generateItineraryById } from "@/services/client/itinerary.client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useGenerateItinerary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tripId: string) => generateItineraryById(tripId),
    
    onMutate: async (tripId) => {
      const queryKey = ["trip", tripId];
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData(queryKey, {
        trip: { itineraryStatus: "GENERATING" } 
      });
    },
    onError: (err, tripId) => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
    }
  });

}
