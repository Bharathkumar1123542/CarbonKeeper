import {
  formatActivityDetailLine,
  formatActivitySummaryLine,
  formatRecentActivities,
} from "../utils/activity-context";
import type { Activity } from "../types";

const sample: Activity = {
  id: "1",
  timestamp: new Date().toISOString(),
  category: "transport",
  subCategory: "car",
  amount: 10,
  unit: "km",
  co2e: 1.7,
  equivalent: "= 212x phone",
  rawInput: "drove",
};

describe("activity-context", () => {
  it("formats summary lines for recommender context", () => {
    expect(formatActivitySummaryLine(sample)).toBe("10km of car (1.7kg CO2)");
  });

  it("formats detail lines for chat context", () => {
    expect(formatActivityDetailLine(sample)).toBe(
      "10km of car (1.7kg CO₂ — = 212x phone)",
    );
  });

  it("returns fallback when no activities exist", () => {
    expect(formatRecentActivities([], formatActivitySummaryLine)).toBe(
      "No activities logged yet.",
    );
  });
});
