import { createAIRoute } from "@/lib/api/route-factory";
import { getRecommendations } from "@/lib/agents/recommender";
import { recommendSchema } from "@/lib/schemas/recommend";
import type { Recommendation } from "@/lib/types";

export const POST = createAIRoute({
  schema: recommendSchema,
  cachePrefix: "rec",
  cacheKeyFn: (input) => ({ history: input.history, region: input.region }),
  handler: async (input) => getRecommendations(input.history, input.region),
  responseFn: (recommendations: Recommendation[] | null | undefined) => ({ recommendations: recommendations || [] }),
  errorHandler: () => ({ error: "Failed to generate recommendations.", status: 500 }),
});