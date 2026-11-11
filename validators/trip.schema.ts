import { z } from "zod";

const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Please enter a valid time")
  .optional()
  .or(z.literal(""));

export const tripSchema = z.object({
  destination: z
    .string("Destination is required")
    .trim()
    .min(1, "Destination is required")
    .max(100, "Destination must be 100 characters or fewer")
    .toLowerCase(),

  travelStyle: z.array(z.string().trim().toLowerCase()),

  startDate: z.preprocess(
    (value) => {
      if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
        return value;
      }

      return [
        value.getFullYear(),
        String(value.getMonth() + 1).padStart(2, "0"),
        String(value.getDate()).padStart(2, "0"),
      ].join("-");
    },
    z.iso.date({
      error: "Start date is required",
    }),
  ),

  travelers: z.preprocess(
    (value) =>
      value === "" || (typeof value === "number" && Number.isNaN(value))
        ? undefined
        : value,
    z
      .number()
      .max(100, "maximum 100 people")
      .positive("Budget must be greater than 0")
      .optional(),
  ),

  arrivalTime: timeSchema,

  departureTime: timeSchema,

  days: z.preprocess(
    (value) =>
      value === "" || (typeof value === "number" && Number.isNaN(value))
        ? undefined
        : value,
    z.number("Days is required").positive("Days must be greater than 0"),
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

const tripImageSchema = z.object({
  thumbnailUrl: z.string().url().nullable().optional(),
  coverUrl: z.string().url().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  imagePhotographer: z.string().trim().nullable().optional(),
  imagePhotographerUrl: z.string().url().nullable().optional(),
});

export const tripUpdateSchema = tripSchema
  .partial()
  .extend(tripImageSchema.shape)
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update",
  });

export type TripUpdateInput = z.infer<typeof tripUpdateSchema>;
export type TripInput = z.infer<typeof tripSchema>;
