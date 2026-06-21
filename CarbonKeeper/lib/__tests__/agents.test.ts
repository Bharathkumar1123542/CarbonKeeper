import { getRecommendations } from "../agents/recommender";
import { generateInsight } from "../agents/insights";
import { parseNaturalLanguage } from "../agents/orchestrator";

const mockGenerateContent = jest.fn();

jest.mock("@google/genai", () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: mockGenerateContent,
    },
  })),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("parseNaturalLanguage", () => {
  it("returns parsed result on successful Gemini response", async () => {
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify({ category: "transport", subCategory: "car", amount: 10 }),
    });
    const result = await parseNaturalLanguage("drove 10km");
    expect(result.category).toBe("transport");
    expect(result.subCategory).toBe("car");
    expect(result.amount).toBe(10);
  });

  it("returns empty object on JSON parse failure", async () => {
    mockGenerateContent.mockResolvedValue({ text: "not json" });
    const result = await parseNaturalLanguage("garbage");
    expect(result).toEqual({});
  });

  it("returns empty object on null response", async () => {
    mockGenerateContent.mockResolvedValue({ text: null });
    const result = await parseNaturalLanguage("drove 10km");
    expect(result).toEqual({});
  });

  it("includes region context in prompt", async () => {
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify({ category: "transport", subCategory: "car", amount: 10 }),
    });
    await parseNaturalLanguage("drove", "india");
    const promptText = mockGenerateContent.mock.calls[0][0].contents;
    expect(promptText).toContain("India");
  });
});

describe("getRecommendations", () => {
  it("returns empty array for empty history", async () => {
    const result = await getRecommendations([]);
    expect(result).toEqual([]);
  });

  it("returns parsed recommendations on success", async () => {
    const recs = [
      { id: "r1", title: "Test Rec", description: "Desc", potentialSavings: 100, difficulty: "Easy" },
    ];
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify(recs),
    });
    const result = await getRecommendations([{
      id: "1", timestamp: new Date().toISOString(), category: "transport",
      subCategory: "car", amount: 10, unit: "km", co2e: 1.7,
      equivalent: "test", rawInput: "drove",
    }]);
    expect(result).toEqual(recs);
  });
});

describe("generateInsight", () => {
  it("returns empty string on empty response", async () => {
    mockGenerateContent.mockResolvedValue({});
    const result = await generateInsight([], 10);
    expect(result).toBe("");
  });

  it("returns AI text on success", async () => {
    mockGenerateContent.mockResolvedValue({ text: "You're doing great!" });
    const result = await generateInsight([{
      id: "1", timestamp: new Date().toISOString(), category: "transport",
      subCategory: "car", amount: 10, unit: "km", co2e: 1.7,
      equivalent: "test",
    }], 10);
    expect(result).toBe("You're doing great!");
  });

  it("handles API error gracefully", async () => {
    mockGenerateContent.mockRejectedValue(new Error("API failure"));
    const result = await generateInsight([{
      id: "1", timestamp: new Date().toISOString(), category: "transport",
      subCategory: "car", amount: 10, unit: "km", co2e: 1.7,
      equivalent: "test",
    }], 10);
    expect(result).toBe("");
  });
});
