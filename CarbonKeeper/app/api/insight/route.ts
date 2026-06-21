import { createAIRoute } from "@/lib/api/route-factory";
import { generateInsight } from "@/lib/agents/insights";
import { insightSchema } from "@/lib/schemas/insight";

export const POST = createAIRoute({
  schema: insightSchema,
  cachePrefix: "ins",
  cacheKeyFn: (input) => ({
    history: input.history,
    budget: input.budget,
    region: input.region,
  }),
  handler: async (input) => generateInsight(input.history, input.budget, input.region),
  responseFn: (insight: string | null | undefined) => ({ insight: insight || "" }),
  errorHandler: () => ({ error: "Failed to generate insights.", status: 500 }),
});