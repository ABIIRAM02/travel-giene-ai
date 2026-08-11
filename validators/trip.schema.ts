import { z } from "zod";

export const tripSchema = z.object({
  destination: z.string().trim().min(1).max(100).toLowerCase(),

  travelStyle: z.string().trim().min(1).max(50).toLowerCase(),

  days: z.number().int().positive(),

  budget: z.number().positive(),
});

export const tripUpdateSchema = tripSchema.partial();

export type TripUpdateInput = z.infer<typeof tripUpdateSchema>;

export type TripInput = z.infer<typeof tripSchema>;
