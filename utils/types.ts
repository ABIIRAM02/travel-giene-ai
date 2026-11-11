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
  itineraryStatus: string;
  itinerary: Itinerary;
  thumbnailUrl: string;
  coverUrl: string;
  imageUrl: string;
  imagePhotographer: string;
  imagePhotographerUrl: string;
  travelers: number;
  startDate: string;
  arrivalTime: string;
  departureTime: string;
};

export interface tripResponse {
  message: string;
  trip?: tripSelect;
}

export interface tripsResponse {
  message: string;
  trips: tripSelect[];
}

export type PlaceCandidate = {
  id: string;
  latitude: number;
  longitude: number;
  tags: Record<string, string>;
};

export type SourceResult = {
  candidates: PlaceCandidate[];
  complete: boolean;
};

export type LivePlace = {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  description?: string;
  website?: string;
  wikidata?: string;
  wikipedia?: string;
  openingHours?: string;
};

