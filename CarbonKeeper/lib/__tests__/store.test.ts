import { useActivityStore } from "../stores/activity-store";
import { useSettingsStore } from "../stores/settings-store";
import { useAIStore } from "../stores/ai-store";
import { Activity } from "../types";

function makeActivity(overrides: Partial<Activity> = {}): Activity {
  return {
    id: "1",
    category: "transport",
    subCategory: "car",
    amount: 10,
    unit: "km",
    co2e: 1.7,
    timestamp: new Date().toISOString(),
    equivalent: "= 212.5x charging a smartphone",
    rawInput: "drove 10km",
    ...overrides,
  };
}

describe("useActivityStore", () => {
  beforeEach(() => {
    useActivityStore.setState({
      activities: [],
      dailyFootprint: 0,
      budgetUsed: 0,
      weeklyTrend: [],
    });
    useSettingsStore.setState({
      dailyBudget: 10,
      region: "global",
    });
    useAIStore.setState({
      recommendations: [],
      challenges: [
        { id: "c1", title: "Challenge 1", description: "Desc", active: false, streak: 0, completed: false },
        { id: "c2", title: "Challenge 2", description: "Desc", active: false, streak: 0, completed: false },
      ],
      insight: null,
      isProcessing: false,
    });
  });

  it("starts with an empty state", () => {
    const state = useActivityStore.getState();
    expect(state.activities.length).toBe(0);
    expect(state.dailyFootprint).toBe(0);
  });

  it("adds an activity and updates footprint", () => {
    const store = useActivityStore.getState();
    store.addActivity(makeActivity({ id: "1", co2e: 1.7 }));

    const state = useActivityStore.getState();
    expect(state.activities.length).toBe(1);
    expect(state.activities[0].subCategory).toBe("car");
    expect(state.dailyFootprint).toBe(1.7);
  });

  it("appends multiple activities and sums footprint", () => {
    const store = useActivityStore.getState();
    store.addActivity(makeActivity({ id: "1", co2e: 1.7 }));
    store.addActivity(makeActivity({ id: "2", co2e: 5.4, category: "food", subCategory: "beef", rawInput: "ate beef" }));

    const state = useActivityStore.getState();
    expect(state.activities.length).toBe(2);
    expect(state.dailyFootprint).toBe(1.7 + 5.4);
  });

  it("caps budgetUsed at 100", () => {
    const store = useActivityStore.getState();
    store.addActivity(makeActivity({ id: "1", co2e: 999, rawInput: "huge emissions" }));

    const state = useActivityStore.getState();
    expect(state.budgetUsed).toBe(100);
  });

  it("clears activities and resets state", () => {
    const store = useActivityStore.getState();
    store.addActivity(makeActivity({ id: "1", co2e: 1.7 }));
    store.clearActivities();

    const state = useActivityStore.getState();
    expect(state.activities.length).toBe(0);
    expect(state.dailyFootprint).toBe(0);
    expect(state.budgetUsed).toBe(0);
  });

  it("persists activities to localStorage on add", () => {
    const localStorageStore: Record<string, string> = {};
    jest
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation((key, value) => {
        localStorageStore[key] = value;
      });

    const store = useActivityStore.getState();
    const activity = makeActivity({ id: "persist-1", co2e: 2.1 });
    store.addActivity(activity);

    expect(localStorageStore.CARBON_ACTIVITIES).toContain("persist-1");
  });

  it("sets recommendations", () => {
    const recommendation = { id: "r1", title: "Test", description: "Desc", potentialSavings: 100, difficulty: "Easy" as const };
    useAIStore.getState().setRecommendations([recommendation]);

    expect(useAIStore.getState().recommendations).toEqual([recommendation]);
  });

  it("sets insight", () => {
    useAIStore.getState().setInsight("You're doing great!");

    expect(useAIStore.getState().insight).toBe("You're doing great!");
  });

  it("toggles challenge active state and increments streak", () => {
    const store = useAIStore.getState();
    expect(store.challenges.length).toBeGreaterThan(0);
    const firstId = store.challenges[0].id;

    store.toggleChallenge(firstId);
    expect(useAIStore.getState().challenges[0].active).toBe(true);
    expect(useAIStore.getState().challenges[0].streak).toBe(1);

    useAIStore.getState().toggleChallenge(firstId);
    expect(useAIStore.getState().challenges[0].active).toBe(false);
  });

  it("starts with default global region", () => {
    expect(useSettingsStore.getState().region).toBe("global");
  });

  it("sets region correctly", () => {
    useSettingsStore.getState().setRegion("india");
    expect(useSettingsStore.getState().region).toBe("india");
  });
});