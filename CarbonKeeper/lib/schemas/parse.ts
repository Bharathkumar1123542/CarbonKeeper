import { z } from "zod";
import { activityCategorySchema } from "./activity";

/** Zod schema for the input to the parse agent (user text and optional region). */
export const parseInputSchema = z.object({
  input: z.string().min(1).max(500),
  region: z.string().optional(),
});

/** Zod schema for the parsed output of the parse agent (category, sub-category, and amount). */
export const parseOutputSchema = z.object({
  category: activityCategorySchema,
  subCategory: z.string().min(1),
  amount: z.number().nonnegative(),
});
