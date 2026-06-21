import { parseInputSchema } from "../schemas/parse";
import { activitySchema } from "../schemas/activity";
import { recommendSchema } from "../schemas/recommend";
import { insightSchema } from "../schemas/insight";

describe("parseInputSchema", () => {
  it("validates a correct parse input", () => {
    expect(parseInputSchema.safeParse({ input: "I drove 10km" }).success).toBe(true);
  });

  it("rejects an empty parse input", () => {
    expect(parseInputSchema.safeParse({ input: "" }).success).toBe(false);
  });

  it("rejects input exceeding 500 characters", () => {
    expect(parseInputSchema.safeParse({ input: "a".repeat(501) }).success).toBe(false);
  });

  it("rejects missing input field", () => {
    expect(parseInputSchema.safeParse({}).success).toBe(false);
  });

  it("rejects non-string input", () => {
    expect(parseInputSchema.safeParse({ input: 123 }).success).toBe(false);
  });

  it("accepts optional region field", () => {
    expect(parseInputSchema.safeParse({ input: "drove 10km", region: "india" }).success).toBe(true);
  });
});

describe("activitySchema", () => {
  const validActivity = {
    id: "123",
    timestamp: "2026-06-08T12:00:00Z",
    category: "transport",
    subCategory: "car",
    amount: 10,
    unit: "km",
    co2e: 1.7,
    equivalent: "X smartphone charges",
    rawInput: "drove 10km"
  };

  it("validates a correct activity object", () => {
    expect(activitySchema.safeParse(validActivity).success).toBe(true);
  });

  it("validates activity without rawInput", () => {
    expect(activitySchema.safeParse({ ...validActivity, rawInput: undefined }).success).toBe(true);
  });

  it("rejects activity with non-numeric amount", () => {
    expect(activitySchema.safeParse({ ...validActivity, amount: "ten" }).success).toBe(false);
  });

  it("rejects activity with missing category", () => {
    const { category, ...noCat } = validActivity;
    void category;
    expect(activitySchema.safeParse(noCat).success).toBe(false);
  });
});

describe("recommendSchema", () => {
  it("validates with empty history", () => {
    expect(recommendSchema.safeParse({ history: [] }).success).toBe(true);
  });

  it("rejects missing history field", () => {
    expect(recommendSchema.safeParse({}).success).toBe(false);
  });

  it("rejects non-array history", () => {
    expect(recommendSchema.safeParse({ history: "not-array" }).success).toBe(false);
  });

  it("accepts optional region field", () => {
    expect(recommendSchema.safeParse({ history: [], region: "france" }).success).toBe(true);
  });
});

describe("insightSchema", () => {
  it("validates with history and positive budget", () => {
    expect(insightSchema.safeParse({ history: [], budget: 10 }).success).toBe(true);
  });

  it("rejects zero or negative budget", () => {
    expect(insightSchema.safeParse({ history: [], budget: -5 }).success).toBe(false);
    expect(insightSchema.safeParse({ history: [], budget: 0 }).success).toBe(false);
  });

  it("rejects missing budget", () => {
    expect(insightSchema.safeParse({ history: [] }).success).toBe(false);
  });

  it("rejects non-numeric budget", () => {
    expect(insightSchema.safeParse({ history: [], budget: "ten" }).success).toBe(false);
  });

  it("accepts optional region field", () => {
    expect(insightSchema.safeParse({ history: [], budget: 10, region: "uk" }).success).toBe(true);
  });
});
