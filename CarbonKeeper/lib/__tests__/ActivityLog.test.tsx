import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ActivityLog } from "../../components/ActivityLog";

const mockAddActivity = jest.fn();
const mockSetRecommendations = jest.fn();
const mockSetInsight = jest.fn();
const mockSetIsProcessing = jest.fn();

const mockIsProcessing = false;

const mockStoreState = {
  activities: [],
  addActivity: mockAddActivity,
  setRecommendations: mockSetRecommendations,
  setInsight: mockSetInsight,
  setIsProcessing: mockSetIsProcessing,
  isProcessing: mockIsProcessing,
  region: "global",
  dailyBudget: 10,
};

jest.mock("../../lib/stores/activity-store", () => {
  const { createMockStoreHook } = require("@/lib/test-utils/mock-stores");
  return { useActivityStore: createMockStoreHook(() => mockStoreState) };
});

jest.mock("../../lib/stores/settings-store", () => {
  const { createMockStoreHook } = require("@/lib/test-utils/mock-stores");
  return { useSettingsStore: createMockStoreHook(() => mockStoreState) };
});

jest.mock("../../lib/stores/ai-store", () => {
  const { createMockStoreHook } = require("@/lib/test-utils/mock-stores");
  return { useAIStore: createMockStoreHook(() => mockStoreState) };
});

jest.mock("../../lib/hooks/useLogActivity", () => ({
  useLogActivity: () => async (input: string) => {
    const res = await fetch("/api/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input, region: mockStoreState.region }),
    });
    if (!res.ok) throw new Error("Failed to parse");
    const parsed = await res.json();
    mockStoreState.addActivity({
      id: "test-id",
      timestamp: new Date().toISOString(),
      category: parsed.category,
      subCategory: parsed.subCategory,
      amount: parsed.amount,
      unit: "km",
      co2e: 1.7,
      equivalent: "test",
      rawInput: input,
    });
  },
}));

global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  mockStoreState.isProcessing = false;
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({
      category: "transport",
      subCategory: "car",
      amount: 10,
    }),
  });
});

describe("ActivityLog", () => {
  it("renders the input field", () => {
    render(<ActivityLog />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(<ActivityLog />);
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeInTheDocument();
  });

  it("renders the terminal header", () => {
    render(<ActivityLog />);
    expect(screen.getByText("Log Activity")).toBeInTheDocument();
  });

  it("disables submit button when input is empty", () => {
    render(<ActivityLog />);
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeDisabled();
  });

  it("enables submit button when input has text", () => {
    render(<ActivityLog />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "drove 10km" } });
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).not.toBeDisabled();
  });

  it("disables button while processing", () => {
    mockStoreState.isProcessing = true;
    render(<ActivityLog />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "drove 10km" } });
    const button = screen.getByRole("button", { name: /process/i });
    expect(button).toBeDisabled();
  });

  it("calls API and updates store on submit", async () => {
    render(<ActivityLog />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "drove 10km" } });

    const button = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/parse",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: "drove 10km", region: "global" }),
        }),
      );
    });

    expect(mockSetIsProcessing).toHaveBeenCalledWith(true);
    expect(mockAddActivity).toHaveBeenCalled();
    expect(mockSetIsProcessing).toHaveBeenCalledWith(false);
  });
});
