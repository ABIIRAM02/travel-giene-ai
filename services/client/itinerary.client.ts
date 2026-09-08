import { api } from "@/utils/api";

export async function generateItineraryById(id:string) {
  return api(`/api/trips/${id}/generate`, {
    method: "POST",
  });
}