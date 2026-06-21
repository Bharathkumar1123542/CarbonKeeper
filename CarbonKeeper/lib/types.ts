import type { z } from "zod";
import type { activityCategorySchema, activitySchema } from "@/lib/schemas/activity";
import type { challengeSchema } from "@/lib/schemas/challenge";
import type { recommendationSchema } from "@/lib/schemas/recommend";

/**
 * Union of valid activity category strings, inferred from `activityCategorySchema`.
 */
export type ActivityCategory = z.infer<typeof activityCategorySchema>;

/**
 * A single carbon-tracked activity record, inferred from `activitySchema`.
 */
export type Activity = z.infer<typeof activitySchema>;

/**
 * An AI-generated recommendation, inferred from `recommendationSchema`.
 */
export type Recommendation = z.infer<typeof recommendationSchema>;

/**
 * A sustainability challenge, inferred from `challengeSchema`.
 */
export type Challenge = z.infer<typeof challengeSchema>;

/**
 * A chat message with a role and text content, used for AI conversation threads.
 */
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
