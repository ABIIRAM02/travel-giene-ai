import { generateText, Output } from "ai";
import { models } from "./provider";
import { itinerarySchema } from "@/validators/itinerary.schema";

export async function generateItinerary(trip: {
  destination: string;
  days: number;
  budget: number;
  travelStyle: string[];
  travelGroup: string;
  interests: string[];
}) {
  const { output } = await generateText({
    model: models.smart,

    output: Output.object({
      schema: itinerarySchema,
    }),

    prompt: `
      Create a travel itinerary for the following trip:

      Destination: ${trip.destination}
      Number of days: ${trip.days}
      Budget: ₹${trip.budget}
      Travel style: ${trip.travelStyle.join(", ")}
      Travel group: ${trip.travelGroup}
      Interests: ${trip.interests?.join(", ") || "None specified"}
    `,
  });

  return output;
}