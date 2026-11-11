import { generateText, Output, stepCountIs, tool } from "ai";
import { z } from "zod";

import { getRouteEstimates } from "../live-data/osrm";
import { models } from "./provider";
import { itinerarySchema } from "@/validators/itinerary.schema";
import { getDestinationCoordinates } from "../live-data/geo-coding";
import { getLivePlaces } from "../live-data/places";
import { LivePlace, tripSelect } from "@/utils/types";

export async function generateItinerary(trip: tripSelect) {
  const routeEstimationTool = tool({
    description:
      "Calculate driving distances and durations between ordered itinerary stops, grouped by day. Never calculate routes between different days.",

    inputSchema: z.object({
      days: z.array(
        z.object({
          day: z.number().int().positive(),
          stops: z
            .array(
              z.object({
                name: z.string(),
                latitude: z.number(),
                longitude: z.number(),
              }),
            )
            .min(2)
            .max(10),
        }),
      ),
    }),

    execute: async ({ days }) => {
      console.log("[OSRM] Tool called");

      const dailyRoutes = await Promise.all(
        days.map(async ({ day, stops }) => {
          console.log(`[OSRM] Day ${day} input:`, stops);

          try {
            const legs = await getRouteEstimates(stops);

            console.log(`[OSRM] Day ${day} estimates:`, legs);

            return {
              day,
              success: true,
              legs,
            };
          } catch (error) {
            console.error(`[OSRM] Day ${day} failed:`, error);

            return {
              day,
              success: false,
              message: "Route estimation unavailable.",
              legs: [],
            };
          }
        }),
      );

      return { dailyRoutes };
    },
  });

  let livePlaces: LivePlace[] = [];

  try {
    const { latitude, longitude } = await getDestinationCoordinates(
      trip.destination,
    );

    livePlaces = await getLivePlaces(latitude, longitude, 30);
  } catch (error) {
    console.error("Live place discovery failed:", error);
  }

  const placesContext = livePlaces.map(
    ({ name, category, latitude, longitude, description, openingHours }) => ({
      name,
      category,
      latitude,
      longitude,
      description,
      openingHours,
    }),
  );

  console.log({ placesContext });

  const { output } = await generateText({
    model: models.smart,

    output: Output.object({
      schema: itinerarySchema,
    }),

    tools: {
      getRouteEstimates: routeEstimationTool,
    },

    prepareStep: ({ stepNumber }) => {
      if (stepNumber === 0) {
        return {
          toolChoice: "required",
        };
      }

      return {
        toolChoice: "auto",
      };
    },

    stopWhen: stepCountIs(10),

    prompt: `
You are an expert travel itinerary planner.
Create a practical, personalized travel itinerary based on the user's trip details.

TRIP DETAILS
Destination: ${trip.destination}
Start date: ${trip.startDate}
Number of days: ${trip.days}
Number of travelers: ${trip.travelers ?? "Not specified"}
Arrival time: ${trip.arrivalTime || "Not specified"}
Departure time: ${trip.departureTime || "Not specified"}
Maximum budget per person: ₹${trip.budget}
Travel style: ${trip.travelStyle.join(", ")}
Travel group: ${trip.travelGroup}
Interests: ${trip.interests?.join(", ") || "None specified"}

LIVE DESTINATION PLACES
${JSON.stringify(placesContext, null, 2)}

INSTRUCTIONS FOR LIVE PLACES
- Prioritize relevant places from the supplied live destination data.
- Use these results as factual references when selecting attractions.
- Do not invent details about the supplied places.
- Do not force every supplied place into the itinerary.
- Select places based on the user's interests, travel style, budget, and trip duration.
- If live place data is empty or insufficient, use your general destination knowledge.
- Live place data is supplementary, not an exhaustive list of destination attractions.
- Do not assume that an iconic or well-known attraction does not exist simply because it is missing from the supplied live place data.
- Continue using your general destination knowledge to identify important attractions that are absent from the live results.
- Do not exclude a well-known attraction solely because Geoapify did not return it.
- Apply the existing budget, travel style, duration, and geographical practicality rules when selecting these attractions.
- If the live destination places array is empty, do not treat it as a lack of attractions.
- Rely on your general destination knowledge to create a complete itinerary.
- Include well-known iconic attractions and relevant local experiences.
- Never mention API failures or missing live data to the traveler.

ROUTE ESTIMATION TOOL
- First select the attractions for each day based on the user's preferences and trip requirements.
- Organize the selected attractions into their respective itinerary days before requesting route estimates.
- Use the getRouteEstimates tool to calculate driving distances and durations between consecutive stops for each day.
- Pass attractions grouped by day, maintaining the intended visiting order within each day.
- Include only stops scheduled for the same itinerary day in each route.
- Never calculate routes between attractions belonging to different itinerary days.
- Use only coordinates supplied in LIVE DESTINATION PLACES.
- Never invent or guess coordinates.
- If an attraction has no supplied coordinates, exclude it from route estimation.
- Use the returned distances and durations to arrange activity timings and avoid unnecessary backtracking.
- Include realistic travel time between consecutive attractions in the daily schedule.
- If route estimation fails for a particular day, continue planning that day with conservative travel-time estimates.
- Do not expose technical tool details to the traveler.

GENERAL FALLBACK
- Failure or incomplete results from external data sources must never prevent itinerary generation.
- Always prioritize generating a complete, practical,destination-specific itinerary using the available information and your geographical knowledge.

TRIP DATES AND STAY
- Calculate each day's date from the provided start date.
- Day 1 must use the exact start date provided.
- Increment the date by one calendar day for each subsequent day.
- Return each day's date in YYYY-MM-DD format.
- Create exactly the specified number of days.
- If arrival time is provided, treat it as the destination arrival and accommodation check-in time.
- On Day 1, schedule accommodation check-in and freshening up around the arrival time.
- Do not schedule sightseeing before arrival and check-in.
- If departure time is provided, treat it as the destination departure and accommodation checkout time.
- On the final day, schedule checkout around the departure time.
- Do not schedule activities that would conflict with checkout or departure.
- If arrival or departure time is not provided, use a reasonable schedule without assuming a specific time.
- Actual accommodation check-in and checkout policies may differ; do not present them as confirmed.

TRAVELER COUNT AND BUDGET
- The budget is per person.
- If the number of travelers is provided, consider group size when estimating shared transportation and accommodation costs.
- Keep the itinerary's displayed budget per person.
- Do not multiply the per-person budget by the number of travelers.
- If the number of travelers is not provided, do not assume a group size.

BUDGET RULES
- The user's budget is the maximum estimated spending per person.
- Never exceed the user's maximum budget.
- The estimated total may be lower than the maximum budget.
- Do not add unnecessary activities or expenses just to use the remaining budget.
- budget.total represents the overall estimated trip cost per person.
- The budget breakdown should be a realistic estimate of the major trip expense categories.
- Individual spot fees are approximate per-person costs and do not need to sum exactly to budget.total because the overall budget also includes expenses such as accommodation, transportation, meals, and miscellaneous costs that may not appear as itinerary spots.
- Keep the overall budget estimate consistent with the itinerary.
- Do not produce a budget total that is clearly unrealistic for the activities, meals, transportation, and accommodation planned.

FOOD COST RULES
- Food spots must have a realistic approximate meal cost.
- Do NOT use fee: 0 for a normal restaurant, cafe, breakfast, lunch, or dinner unless the meal is genuinely free.
- For food spots, fee represents an approximate cost per person for that meal.
- For attractions and activities, fee represents the approximate entry/activity cost per person.
- Use reasonable approximate values rather than pretending prices are exact.
- If the exact price is uncertain, provide a sensible estimate and make the uncertainty clear in thingsToNote.

DESTINATION HIGHLIGHTS
- Include important and iconic attractions of the destination when they are relevant to the trip.
- Do not omit well-known signature experiences simply because lesser-known attractions are available.
- Prioritize attractions that strongly match the user's travel style and interests.
- Balance iconic attractions with less-crowded or local experiences.
- Do not force an attraction into the itinerary if it is clearly incompatible with the number of days, budget, travel style, or logistics.
- For example, when planning a Munnar trip, consider major experiences such as Eravikulam National Park, Kolukkumalai, tea plantations, Mattupetty, Echo Point, major waterfalls, viewpoints, and trekking experiences when appropriate. Do not include all of them automatically; select the ones that best fit the user's trip.

RESTAURANT RULES
- Recommend well-known or locally relevant restaurants when appropriate.
- Restaurant names are allowed and preferred when the model has reasonable confidence that the place is real and relevant to the destination.
- Do not fabricate restaurant or business names.
- If uncertain about a specific restaurant, use a generic description such as "Local Kerala restaurant in Munnar town".
- Provide an approximate meal cost rather than using 0 for a normal meal.

ACTIVITY LOAD AND PACING
- Consider the physical and mental effort required by each activity.
- Do not treat all activities as equal in intensity.
- A long trek, peak hike, strenuous adventure, or very early-morning excursion counts as a high-intensity activity.
- Avoid scheduling multiple high-intensity activities on the same day.
- After a major or physically demanding activity, prefer lighter sightseeing, meals, rest, scenic stops, or flexible time.
- An extremely early start should reduce the number of demanding activities planned later that day.
- For relaxed travel styles, keep the daily activity load lighter.
- For adventure-oriented travel styles, more activity is acceptable, but the itinerary should still allow adequate recovery and realistic travel time.
- Do not fill every available hour with an activity. Leave reasonable free time for rest, exploration, delays, and unexpected changes.

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
   - Approximate pricing uncertainty.
   - Advance booking requirements.
   - Weather considerations.
   - Equipment or clothing.
   - Activity difficulty.
   - Access restrictions.
   - Transportation considerations.

8. Do not present uncertain information as guaranteed.
   - Prices, opening hours, availability, booking requirements, and access conditions can change.
   - Treat all unverified prices as approximate.

OUTPUT REQUIREMENTS
- Keep mainTitle very short.
- Do not include number of days, budget, travel group, or other trip metadata in mainTitle.
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
