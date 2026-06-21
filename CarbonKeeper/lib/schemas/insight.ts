import { z } from "zod";
import { activitySchema } from "./activity";

/** Zod schema for the input to the insight agent (activity history, daily budget, and optional region). */
export const insightSchema = z.object({
  history: z.array(activitySchema),
  budget: z.number().positive(),
  region: z.string().optional(),
});
