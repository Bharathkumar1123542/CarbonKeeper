const CO2_EQUIVALENTS = [
  { threshold: 0.01, text: "charging a smartphone", value: 0.008 },
  { threshold: 0.5, text: "boiling a kettle", value: 0.015 },
  { threshold: 2.0, text: "a load of laundry", value: 0.6 },
  { threshold: 10.0, text: "a gallon of gas consumed", value: 8.88 },
  { threshold: 50.0, text: "a tree grown for 10 years", value: 21.0 },
  { threshold: 200.0, text: "a flight from NY to LA", value: 150.0 },
];

/**
 * Returns a human-readable equivalent string for the given CO2e amount in kilograms,
 * expressed in terms of everyday activities.
 *
 * @param kgCO2 - The CO2e amount in kilograms.
 * @returns A string like `"= 2.5x boiling a kettle"` or `"Zero emissions!"` if <= 0.
 * @example
 * ```ts
 * const eq = getEquivalent(0.5);
 * // "= 0.8x a load of laundry"
 * ```
 */
export function getEquivalent(kgCO2: number): string {
  if (kgCO2 <= 0) return "Zero emissions!";
  
  for (let i = CO2_EQUIVALENTS.length - 1; i >= 0; i--) {
    const equivalent = CO2_EQUIVALENTS[i];
    if (kgCO2 >= equivalent.threshold) {
      const count = Math.round((kgCO2 / equivalent.value) * 10) / 10;
      return `= ${count}x ${equivalent.text}`;
    }
  }
  
  const count = Math.round((kgCO2 / CO2_EQUIVALENTS[0].value) * 10) / 10;
  return `= ${count}x ${CO2_EQUIVALENTS[0].text}`;
}
