import { Itinerary } from "@/validators/itinerary.schema";


export type tripSelect = {
  id: string;
  destination: string;
  days: number;
  budget: number;
  travelStyle: string[];
  travelGroup: string;
  interests: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
  itineraryStatus: string
  itinerary: Itinerary
};

export interface tripResponse {
  message: string;
  trip?: tripSelect;
}

export interface tripsResponse {
  message: string;
  trips: tripSelect[];
}