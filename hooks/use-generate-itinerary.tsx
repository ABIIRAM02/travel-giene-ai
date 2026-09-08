"use client";

import { generateItineraryById } from "@/services/client/itinerary.client";
import { useMutation } from "@tanstack/react-query";

export function useGenerateItinerary() {
  return useMutation({
    mutationFn: (tripId: string) => generateItineraryById(tripId),
  });
}