import { z } from "zod";

/** Zod enum schema for valid activity categories. */
export const activityCategorySchema = z.enum([
  "transport",
  "food",
  "energy",
  "shopping",
]);

/** Zod schema for a single carbon-tracked activity record. */
export const activitySchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  category: activityCategorySchema,
  subCategory: z.string().min(1),
  amount: z.number(),
  unit: z.string(),
  co2e: z.number(),
  equivalent: z.string(),
  rawInput: z.string().optional(),
});

/** Zod schema for an array of activity records. */
export const activitiesArraySchema = z.array(activitySchema);
