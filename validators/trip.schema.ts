import { z } from "zod";

export const tripSchema = z.object({
  destination: z
    .string("Destination is required")
    .trim()
    .min(1, "Destination is required")
    .max(100, "Destination must be 100 characters or fewer")
    .toLowerCase(),

  travelStyle: z.array(z.string().trim().toLowerCase()),

  days: z.preprocess(
    (value) =>
      value === "" || (typeof value === "number" && Number.isNaN(value))
        ? undefined
        : value,
    z.number("Days is required")
      .positive("Days must be greater than 0"),
  ),

  budget: z.preprocess(
    (value) =>
      value === "" || (typeof value === "number" && Number.isNaN(value))
        ? undefined
        : value,
    z.number("Budget is required").positive("Budget must be greater than 0"),
  ),

  travelGroup: z
    .string("Travel group is required")
    .trim()
    .min(1, "Travel group is required")
    .max(50, "Travel group must be 50 characters or fewer")
    .toLowerCase(),

  interests: z.array(z.string().trim().toLowerCase()).optional(),
});

export const tripUpdateSchema = tripSchema.partial();

export type TripUpdateInput = z.infer<typeof tripUpdateSchema>;

export type TripInput = z.infer<typeof tripSchema>;
