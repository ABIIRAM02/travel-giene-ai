
import { Itinerary } from "@/validators/itinerary.schema";

type TripDetails = {
  days: number;
  budget: number;
};

export function validateGeneratedItinerary(
  itinerary: Itinerary,
  trip: TripDetails,
) {
  const errors: string[] = [];

  // Validate number of days
  if (itinerary.days.length !== trip.days) {
    errors.push(
      `Expected ${trip.days} days, but AI generated ${itinerary.days.length} days.`,
    );
  }

  // Validate maximum budget
  if (itinerary.budget.total > trip.budget) {
    errors.push(
      `Generated budget ₹${itinerary.budget.total} exceeds the maximum budget of ₹${trip.budget}.`,
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}