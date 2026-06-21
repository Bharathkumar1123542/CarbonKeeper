import { z } from "zod";

/** Base Zod schema for a challenge, containing id, title, and description. */
export const challengeBaseSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

/** Full Zod schema for a challenge, extending the base schema with active, streak, and completed fields. */
export const challengeSchema = challengeBaseSchema.extend({
  active: z.boolean(),
  streak: z.number().nonnegative(),
  completed: z.boolean(),
});
