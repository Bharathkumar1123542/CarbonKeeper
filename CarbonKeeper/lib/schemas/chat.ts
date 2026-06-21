import { z } from "zod";
import { activitySchema } from "./activity";

/** Zod schema for the input to the chat agent (user message and activity history). */
export const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z.array(activitySchema),
});
