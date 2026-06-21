import { z } from "zod";
import { activitySchema } from "./activity";

/** Zod schema for the input to the recommendation agent (activity history and optional region). */
export const recommendSchema = z.object({
  history: z.array(activitySchema),
  region: z.string().optional(),
});

/** Zod schema for a single AI-generated recommendation. */
export const recommendationSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  potentialSavings: z.number().nonnegative().max(10000),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
});

/** Zod schema for an array of recommendations returned by the recommendation agent. */
export const recommendationArraySchema = z.array(recommendationSchema);
