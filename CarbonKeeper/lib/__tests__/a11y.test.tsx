import { render, act } from "@testing-library/react";
import { axe } from "jest-axe";

jest.mock("next/dynamic", () => {
  const React = jest.requireActual("react");
  return function mockDynamic() {
    const Placeholder = (props: Record<string, unknown>) =>
      React.createElement("div", { ...props, "data-testid": "mock-dynamic" });
    Placeholder.displayName = "DynamicPlaceholder";
    return Placeholder;
  };
});

jest.mock("framer-motion", () => {
  const React = jest.requireActual("react");
  const createProxy = (tag: string) => {
    const C = ({ children, ...props }: Record<string, unknown>) =>
      React.createElement(tag, props, children);
    C.displayName = `motion.${tag}`;
    return C;
  };
  return {
    motion: new Proxy(
      {},
      { get: (_target: never, tag: string) => createProxy(tag) },
    ),
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});

import Home from "../../app/page";
import DashboardPage from "../../app/dashboard/page";
import SettingsPage from "../../app/dashboard/settings/page";
import LogsPage from "../../app/dashboard/logs/page";
import InsightsPage from "../../app/dashboard/insights/page";



const mockStoreState = {
  activities: [],
  dailyFootprint: 0,
  budgetUsed: 0,
  weeklyTrend: [],
  recommendations: [],
  challenges: [],
  insight: null,
  isProcessing: false,
  dailyBudget: 10,
  region: "global",
  addActivity: jest.fn(),
  loadSampleData: jest.fn(),
  toggleChallenge: jest.fn(),
  setDailyBudget: jest.fn(),
  setRegion: jest.fn(),
  setRecommendations: jest.fn(),
  setInsight: jest.fn(),
  setIsProcessing: jest.fn(),
  clearActivities: jest.fn(),
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

jest.mock("next/font/google", () => ({
  Inter: () => ({ className: "inter" }),
}));

jest.mock("next/link", () => {
  const MockLink = ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
  MockLink.displayName = "MockLink";
  return MockLink;
});

it("landing page has no accessibility violations", async () => {
  const { container } = render(<Home />);
  const results = await act(async () => axe(container));
  expect(results).toHaveNoViolations();
});

it("dashboard page has no accessibility violations", async () => {
  const { container } = render(<DashboardPage />);
  const results = await act(async () => axe(container));
  expect(results).toHaveNoViolations();
});

it("settings page has no accessibility violations", async () => {
  const { container } = render(<SettingsPage />);
  const results = await act(async () => axe(container));
  expect(results).toHaveNoViolations();
});

it("logs page has no accessibility violations", async () => {
  const { container } = render(<LogsPage />);
  const results = await act(async () => axe(container));
  expect(results).toHaveNoViolations();
});

it("insights page has no accessibility violations", async () => {
  const { container } = render(<InsightsPage />);
  const results = await act(async () => axe(container));
  expect(results).toHaveNoViolations();
});
