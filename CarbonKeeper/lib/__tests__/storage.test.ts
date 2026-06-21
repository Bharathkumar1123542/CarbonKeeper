import {
  getActivities,
  setActivities,
  clearStoredActivities,
  getBudget,
  setBudget,
  getRegion,
  setRegion,
} from "../storage";
import type { Activity } from "../types";

const sampleActivity: Activity = {
  id: "1",
  category: "transport",
  subCategory: "car",
  amount: 10,
  unit: "km",
  co2e: 1.7,
  timestamp: new Date().toISOString(),
  equivalent: "= 212.5x charging a smartphone",
  rawInput: "drove 10km",
};

let localStorageStore: Record<string, string> = {};

beforeEach(() => {
  localStorageStore = {};
  jest
    .spyOn(Storage.prototype, "getItem")
    .mockImplementation((key) => localStorageStore[key] ?? null);
  jest.spyOn(Storage.prototype, "setItem").mockImplementation((key, value) => {
    localStorageStore[key] = value;
  });
  jest.spyOn(Storage.prototype, "removeItem").mockImplementation((key) => {
    delete localStorageStore[key];
  });
});

describe("storage", () => {
  it("persists and retrieves activities", () => {
    setActivities([sampleActivity]);
    expect(getActivities()).toEqual([sampleActivity]);
    expect(localStorageStore.CARBON_ACTIVITIES).toBe(
      JSON.stringify([sampleActivity]),
    );
  });

  it("clears stored activities", () => {
    setActivities([sampleActivity]);
    clearStoredActivities();
    expect(getActivities()).toEqual([]);
    expect(localStorageStore.CARBON_ACTIVITIES).toBeUndefined();
  });

  it("returns empty array for invalid stored activities", () => {
    localStorageStore.CARBON_ACTIVITIES = JSON.stringify([{ invalid: true }]);
    expect(getActivities()).toEqual([]);
  });

  it("persists budget and region", () => {
    setBudget(15);
    setRegion("india");
    expect(getBudget()).toBe(15);
    expect(getRegion()).toBe("india");
  });
});
