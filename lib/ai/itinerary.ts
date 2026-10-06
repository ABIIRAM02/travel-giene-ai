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
  You are an expert travel itinerary planner.

  Create a practical, personalized travel itinerary based on the user's trip details.

  TRIP DETAILS
  Destination: ${trip.destination}
  Number of days: ${trip.days}
  Maximum budget: ₹${trip.budget}
  Travel style: ${trip.travelStyle.join(", ")}
  Travel group: ${trip.travelGroup}
  Interests: ${trip.interests?.join(", ") || "None specified"}

  BUDGET RULES

  - The user's budget is the maximum estimated spending per person.
  - Never exceed the user's maximum budget.
  - The estimated total may be lower than the maximum budget.
  - Do not add unnecessary activities or expenses just to use the
    remaining budget.
  - budget.total represents the overall estimated trip cost per person.
  - The budget breakdown should be a realistic estimate of the major
    trip expense categories.
  - Individual spot fees are approximate per-person costs and do not
    need to sum exactly to budget.total because the overall budget also
    includes expenses such as accommodation, transportation, meals, and
    miscellaneous costs that may not appear as itinerary spots.
  - Keep the overall budget estimate consistent with the itinerary.
    Do not produce a budget total that is clearly unrealistic for the
    activities, meals, transportation, and accommodation planned.

  FOOD COST RULES

  - Food spots must have a realistic approximate meal cost.
  - Do NOT use fee: 0 for a normal restaurant, cafe, breakfast, lunch,
    or dinner unless the meal is genuinely free.
  - For food spots, fee represents an approximate cost per person for
    that meal.
  - For attractions and activities, fee represents the approximate
    entry/activity cost per person.
  - Use reasonable approximate values rather than pretending prices are exact.
  - If the exact price is uncertain, provide a sensible estimate and make
    the uncertainty clear in thingsToNote.

  DESTINATION HIGHLIGHTS

  - Include important and iconic attractions of the destination when they
    are relevant to the trip.
  - Do not omit well-known signature experiences simply because lesser-known
    attractions are available.
  - Prioritize attractions that strongly match the user's travel style
    and interests.
  - Balance iconic attractions with less-crowded or local experiences.
  - Do not force an attraction into the itinerary if it is clearly
    incompatible with the number of days, budget, travel style, or logistics.

  For example, when planning a Munnar trip, consider major experiences such
  as Eravikulam National Park, Kolukkumalai, tea plantations, Mattupetty,
  Echo Point, major waterfalls, viewpoints, and trekking experiences when
  appropriate. Do not include all of them automatically; select the ones
  that best fit the user's trip.

  RESTAURANT RULES

  - Recommend well-known or locally relevant restaurants when appropriate.
  - Restaurant names are allowed and preferred when the model has reasonable
    confidence that the place is real and relevant to the destination.
  - Do not fabricate restaurant or business names.
  - If uncertain about a specific restaurant, use a generic description such
    as "Local Kerala restaurant in Munnar town".
  - Provide an approximate meal cost rather than using 0 for a normal meal.

  ACTIVITY LOAD AND PACING

  - Consider the physical and mental effort required by each activity.
  - Do not treat all activities as equal in intensity.
  - A long trek, peak hike, strenuous adventure, or very early-morning
    excursion counts as a high-intensity activity.
  - Avoid scheduling multiple high-intensity activities on the same day.
  - After a major or physically demanding activity, prefer lighter
    sightseeing, meals, rest, scenic stops, or flexible time.
  - An extremely early start should reduce the number of demanding
    activities planned later that day.
  - For relaxed travel styles, keep the daily activity load lighter.
  - For adventure-oriented travel styles, more activity is acceptable,
    but the itinerary should still allow adequate recovery and realistic
    travel time.
  - Do not fill every available hour with an activity. Leave reasonable
    free time for rest, exploration, delays, and unexpected changes.

  PLANNING REQUIREMENTS

  1. Create exactly ${trip.days} days.
     - Number days sequentially starting from 1.
     - Do not add or omit days.

  2. Personalize the itinerary.
     - Use travel style to determine activity type and intensity.
     - Prioritize the user's interests.
     - Consider the travel group when choosing activities and pacing.

  3. Create a realistic daily schedule.
     - Activities must not overlap.
     - Account for travel time between locations.
     - Do not assume an activity's duration includes travel time.
     - Follow the activity load and pacing rules above.
     - Balance demanding activities with relaxed periods.

  4. Consider geographical practicality.
     - Group nearby attractions together where possible.
     - Avoid unnecessary backtracking.
     - Consider approximate travel time between locations.
     - Do not assume every attraction in the destination is close together.

  5. Avoid repetition.
     - Do not repeatedly recommend the same attraction or experience.
     - Give each day a meaningful purpose and variety.

  6. Make descriptions useful.
     - Explain what the traveler can actually expect.
     - Avoid generic filler descriptions.

  7. Things to note should include relevant practical information such as:
     - approximate pricing uncertainty
     - advance booking requirements
     - weather considerations
     - equipment or clothing
     - activity difficulty
     - access restrictions
     - transportation considerations

  8. Do not present uncertain information as guaranteed.
     - Prices, opening hours, availability, booking requirements, and access
       conditions can change.
     - Treat all unverified prices as approximate.

  OUTPUT REQUIREMENTS

  - Keep mainTitle very short.
  - Do not include number of days, budget, travel group, or other trip
    metadata in mainTitle.
  - Keep the itinerary practical and easy to follow.
  - Ensure every day contains a coherent set of activities.
  - Ensure the budget breakdown adds up exactly to budget.total.
  - Ensure budget.total does not exceed ₹${trip.budget}.
  - Ensure food spots have an approximate non-zero cost unless genuinely free.
  - Ensure the final itinerary is internally consistent.
`,
  });

  return output;
}
