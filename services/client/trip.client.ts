import { TripSelect } from "@/lib/generated/prisma/models";
import { api } from "@/utils/api";
import { TripInput } from "@/validators/trip.schema";

interface tripResponse {
  message: string,
  trip: TripSelect
}

export async function generateTrip(data: TripInput) {
  return api<tripResponse>("/api/trips", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
