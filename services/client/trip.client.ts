import { api } from "@/utils/api";
import { TripInput } from "@/validators/trip.schema";

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
};

interface tripResponse {
  message: string;
  trip: tripSelect;
}

interface tripsResponse {
  message: string;
  trips: tripSelect[];
}

export async function generateTrip(data: TripInput) {
  return api<tripResponse>("/api/trips", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchTrips() {
  return api<tripsResponse>("/api/trips", {
    method: "GET",
  });
}
export async function fetchTripById(id:string) {
  return api<tripResponse>(`/api/trips/${id}`, {
    method: "GET",
  });
}
