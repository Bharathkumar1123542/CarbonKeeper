import { createAIRoute } from "@/lib/api/route-factory";
import { generateChatResponse } from "@/lib/agents/chat";
import { chatSchema } from "@/lib/schemas/chat";

export const POST = createAIRoute({
  schema: chatSchema,
  cachePrefix: "chat",
  cacheKeyFn: (input) => ({ message: input.message, history: input.history }),
  handler: async (input) => generateChatResponse(input.message, input.history),
  responseFn: (response: string | null | undefined) => ({ response: response || "" }),
  errorHandler: () => ({ error: "Failed to generate chat response.", status: 500 }),
});