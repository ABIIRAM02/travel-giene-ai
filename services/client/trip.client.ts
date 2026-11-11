import { api } from "@/utils/api";
import { tripResponse, tripsResponse } from "@/utils/types";
import { TripInput } from "@/validators/trip.schema";


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

export async function deleteTripById(id:string) {
  return api<tripResponse>(`/api/trips/${id}`, {
    method: "DELETE",
  });
}
