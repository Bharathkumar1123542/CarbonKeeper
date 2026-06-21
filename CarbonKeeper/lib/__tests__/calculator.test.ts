import { calculateActivityEmissions } from "../agents/calculator";

describe("calculateActivityEmissions", () => {
  it("returns correct emissions for transport category", () => {
    const result = calculateActivityEmissions(
      "transport",
      "car",
      10,
      "drove 10km",
    );
    expect(result.category).toBe("transport");
    expect(result.subCategory).toBe("car");
    expect(result.amount).toBe(10);
    expect(result.unit).toBe("km");
    expect(result.co2e).toBeCloseTo(1.7, 10);
    expect(result.rawInput).toBe("drove 10km");
  });

  it("returns correct emissions for food category", () => {
    const result = calculateActivityEmissions("food", "beef", 0.5);
    expect(result.category).toBe("food");
    expect(result.subCategory).toBe("beef");
    expect(result.amount).toBe(0.5);
    expect(result.unit).toBe("kg");
    expect(result.co2e).toBe(13.5);
  });

  it("returns zero emissions for bike", () => {
    const result = calculateActivityEmissions("transport", "bike", 15);
    expect(result.co2e).toBe(0);
    expect(result.equivalent).toBe("Zero emissions!");
  });

  it("returns unknown unit for unrecognized subCategory", () => {
    const result = calculateActivityEmissions("transport", "helicopter", 10);
    expect(result.unit).toBe("unknown");
  });

  it("generates equivalent string for positive emissions", () => {
    const result = calculateActivityEmissions("shopping", "new_laptop", 1);
    expect(result.co2e).toBe(230);
    expect(result.equivalent).toContain("flight");
  });

  it("handles negative amounts", () => {
    const result = calculateActivityEmissions("transport", "car", -10);
    expect(result.co2e).toBeCloseTo(-1.7);
  });

  it("handles zero amount", () => {
    const result = calculateActivityEmissions("transport", "car", 0);
    expect(result.co2e).toBe(0);
  });

  it("applies region modifier to energy emissions", () => {
    const result = calculateActivityEmissions("energy", "grid_avg", 10, undefined, "india");
    expect(result.co2e).toBeCloseTo(7.0, 10);
  });

  it("does not apply region modifier to transport", () => {
    const result = calculateActivityEmissions("transport", "car", 10, undefined, "india");
    expect(result.co2e).toBeCloseTo(1.7, 10);
  });
});
