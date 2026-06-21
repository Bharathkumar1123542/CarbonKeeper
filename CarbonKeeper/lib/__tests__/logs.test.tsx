import { render, screen, fireEvent } from "@testing-library/react";
import LogsPage from "../../app/dashboard/logs/page";
import { Activity, Recommendation, Challenge } from "../../lib/types";

interface MockState {
  activities?: Activity[];
  dailyFootprint?: number;
  budgetUsed?: number;
  dailyBudget?: number;
  region?: string;
  weeklyTrend?: { date: string; value: number }[];
  recommendations?: Recommendation[];
  challenges?: Challenge[];
  insight?: string | null;
  isProcessing?: boolean;
  loadSampleData?: jest.Mock;
  toggleChallenge?: jest.Mock;
  addActivity?: jest.Mock;
  setRecommendations?: jest.Mock;
  setInsight?: jest.Mock;
  setIsProcessing?: jest.Mock;
  clearActivities?: jest.Mock;
}

const mockClearActivities = jest.fn();

const baseState: MockState = {
  activities: [],
  clearActivities: mockClearActivities,
};

let mockStoreState = baseState;

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

jest.mock("lucide-react", () => ({
  Trash2: () => <span>Trash2</span>,
  FileText: () => <span>FileText</span>,
}));

jest.mock("date-fns", () => ({
  format: () => "Jun 8, 2026 12:00",
}));



describe("LogsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStoreState = baseState;
  });

  it("renders the header", () => {
    render(<LogsPage />);
    expect(screen.getByText("Track: Activity Logs & Carbon History")).toBeInTheDocument();
  });

  it("shows empty state when no activities", () => {
    render(<LogsPage />);
    expect(screen.getByText("No logs found")).toBeInTheDocument();
    expect(screen.getByText(/Head over to the Overview page/)).toBeInTheDocument();
  });

  it("does not show Clear Data button when no activities", () => {
    render(<LogsPage />);
    expect(screen.queryByText("Clear Data")).not.toBeInTheDocument();
  });

  it("renders table headers when activities exist", () => {
    mockStoreState = {
      ...baseState,
      activities: [
        { id: "1", category: "transport", subCategory: "car", amount: 10, unit: "km", co2e: 1.7, timestamp: "2026-06-08T12:00:00Z", equivalent: "= 212x phone", rawInput: "drove 10km" },
      ],
    };
    render(<LogsPage />);
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Raw Input")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("CO₂e (kg)")).toBeInTheDocument();
    expect(screen.getByText("Global Equivalent")).toBeInTheDocument();
  });

  it("renders activity data in table", () => {
    mockStoreState = {
      ...baseState,
      activities: [
        { id: "1", category: "transport", subCategory: "car", amount: 10, unit: "km", co2e: 1.7, timestamp: "2026-06-08T12:00:00Z", equivalent: "= 212x phone", rawInput: "drove 10km" },
      ],
    };
    render(<LogsPage />);
    expect(screen.getByText("transport › car")).toBeInTheDocument();
    expect(screen.getByText("drove 10km")).toBeInTheDocument();
    expect(screen.getByText("10 km")).toBeInTheDocument();
    expect(screen.getByText("1.70")).toBeInTheDocument();
    expect(screen.getByText("= 212x phone")).toBeInTheDocument();
  });

  it("shows Clear Data button when activities exist", () => {
    mockStoreState = {
      ...baseState,
      activities: [
        { id: "1", category: "transport", subCategory: "car", amount: 10, unit: "km", co2e: 1.7, timestamp: "2026-06-08T12:00:00Z", equivalent: "test", rawInput: "drove" },
      ],
    };
    render(<LogsPage />);
    expect(screen.getByText("Clear Data")).toBeInTheDocument();
  });

  it("calls clearActivities when Clear Data is clicked and confirmed", () => {
    window.confirm = jest.fn().mockReturnValue(true);
    mockStoreState = {
      ...baseState,
      activities: [
        { id: "1", category: "transport", subCategory: "car", amount: 10, unit: "km", co2e: 1.7, timestamp: "2026-06-08T12:00:00Z", equivalent: "test", rawInput: "drove" },
      ],
    };
    render(<LogsPage />);
    fireEvent.click(screen.getByText("Clear Data"));
    expect(mockClearActivities).toHaveBeenCalled();
  });

  it("displays formatted date from activity", () => {
    mockStoreState = {
      ...baseState,
      activities: [
        { id: "1", category: "transport", subCategory: "car", amount: 10, unit: "km", co2e: 1.7, timestamp: "2026-06-08T12:00:00Z", equivalent: "test", rawInput: "drove" },
      ],
    };
    render(<LogsPage />);
    expect(screen.getByText("Jun 8, 2026 12:00")).toBeInTheDocument();
  });

  it("shows 'Manual entry' when no rawInput", () => {
    mockStoreState = {
      ...baseState,
      activities: [
        { id: "1", category: "transport", subCategory: "car", amount: 10, unit: "km", co2e: 1.7, timestamp: "2026-06-08T12:00:00Z", equivalent: "test" },
      ],
    };
    render(<LogsPage />);
    expect(screen.getByText("Manual entry")).toBeInTheDocument();
  });
});
