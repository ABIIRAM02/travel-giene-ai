import { z } from "zod";

export const itinerarySchema = z.object({
  title: z.string(),

  budget: z.object({
    total: z.number(),
    currency: z.literal("INR"),
    breakdown: z.object({
      stay: z.number(),
      food: z.number(),
      activities: z.number(),
      transport: z.number(),
      miscellaneous: z.number(),
    }),
  }),

  thingsToNote: z.array(z.string()),

  days: z.array(
    z.object({
      day: z.number(),
      title: z.string(),
      spots: z.array(
        z.object({
          time: z.string(),
          duration: z.string(),
          title: z.string(),
          description: z.string(),
          location: z.string(),
          type: z.enum(["sight", "food", "activity"]),
          fee: z.number().nonnegative(),
        }),
      ),
    }),
  ),
});

export type Itinerary = z.infer<typeof itinerarySchema>;