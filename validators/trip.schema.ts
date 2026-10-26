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
value === "" ||
(typeof value === "number" && Number.isNaN(value))
? undefined
: value,
z.number("Days is required").positive("Days must be greater than 0"),
),

budget: z.preprocess(
(value) =>
value === "" ||
(typeof value === "number" && Number.isNaN(value))
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
