import { render, screen, fireEvent } from "@testing-library/react";
import SettingsPage from "../../app/dashboard/settings/page";

const mockSetDailyBudget = jest.fn();
const mockSetRegion = jest.fn();

const mockStore = {
  dailyBudget: 10,
  region: "global",
  setDailyBudget: mockSetDailyBudget,
  setRegion: mockSetRegion,
};

jest.mock("../../lib/stores/settings-store", () => {
  const { createMockStoreHook } = require("@/lib/test-utils/mock-stores");
  return { useSettingsStore: createMockStoreHook(() => mockStore) };
});

jest.mock("lucide-react", () => ({
  Settings2: () => <span>Settings2</span>,
  Key: () => <span>Key</span>,
  Database: () => <span>Database</span>,
  Globe: () => <span>Globe</span>,
}));

jest.mock("sonner", () => ({
  toast: { success: jest.fn() },
}));

let localStorageStore: Record<string, string> = {};

beforeEach(() => {
  jest.clearAllMocks();
  localStorageStore = {};
  jest
    .spyOn(Storage.prototype, "getItem")
    .mockImplementation((key) => localStorageStore[key] ?? null);
  jest.spyOn(Storage.prototype, "setItem").mockImplementation((key, value) => {
    localStorageStore[key] = value;
  });
});

describe("SettingsPage", () => {
  it("renders the header", () => {
    render(<SettingsPage />);
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders daily budget input", () => {
    render(<SettingsPage />);
    const input = screen.getByDisplayValue("10");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "number");
  });

  it("renders save button", () => {
    render(<SettingsPage />);
    expect(screen.getByText("Save Settings")).toBeInTheDocument();
  });

  it("calls setDailyBudget on submit", () => {
    render(<SettingsPage />);
    const budgetInput = screen.getByDisplayValue("10");
    fireEvent.change(budgetInput, { target: { value: "20" } });
    fireEvent.click(screen.getByText("Save Settings"));
    expect(mockSetDailyBudget).toHaveBeenCalledWith(20);
  });

  it("calls toast.success on successful save", () => {
    render(<SettingsPage />);
    fireEvent.click(screen.getByText("Save Settings"));
    const { toast } = jest.requireMock("sonner");
    expect(toast.success).toHaveBeenCalledWith("Settings saved successfully!");
  });

  it("does not call setDailyBudget for invalid budget", () => {
    render(<SettingsPage />);
    const budgetInput = screen.getByDisplayValue("10");
    fireEvent.change(budgetInput, { target: { value: "abc" } });
    fireEvent.click(screen.getByText("Save Settings"));
    expect(mockSetDailyBudget).not.toHaveBeenCalled();
  });

  it("renders region selector", () => {
    render(<SettingsPage />);
    expect(screen.getByText("Region / Grid Context")).toBeInTheDocument();
  });

  it("calls setRegion on submit", () => {
    render(<SettingsPage />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "france" } });
    fireEvent.click(screen.getByText("Save Settings"));
    expect(mockSetRegion).toHaveBeenCalledWith("france");
  });
});