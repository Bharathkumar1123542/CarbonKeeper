import { buildActivity } from "../services/activity-builder";

describe("activity-service", () => {
  it("buildActivity assigns required fields from parsed input", () => {
    const activity = buildActivity(
      "drove 10km",
      { category: "transport", subCategory: "car", amount: 10 },
      "global",
    );

    expect(activity.category).toBe("transport");
    expect(activity.subCategory).toBe("car");
    expect(activity.amount).toBe(10);
    expect(activity.rawInput).toBe("drove 10km");
    expect(activity.id).toBeTruthy();
    expect(activity.timestamp).toBeTruthy();
    expect(activity.co2e).toBeGreaterThan(0);
  });

  it("buildActivity applies defaults for partial parse results", () => {
    const activity = buildActivity("something vague", {}, "global");

    expect(activity.category).toBe("transport");
    expect(activity.subCategory).toBe("car");
    expect(activity.amount).toBe(1);
  });
});
