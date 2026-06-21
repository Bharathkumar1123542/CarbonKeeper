import {
  EMISSION_FACTORS,
  REGION_GRID_FACTORS,
  DEFAULT_REGION,
  GRID_AVERAGE_KG_PER_KWH,
  EMISSION_FACTOR_SOURCE,
} from "./data/emissions-factors";

/**
 * Emission factors for various activities and categories, indexed by category and sub-category.
 */
export {
  EMISSION_FACTORS,
  REGION_GRID_FACTORS,
  DEFAULT_REGION,
  GRID_AVERAGE_KG_PER_KWH,
  EMISSION_FACTOR_SOURCE,
};


function getRegionFactor(region: string): number {
  return REGION_GRID_FACTORS[region]?.factor ?? 1.0;
}

/**
 * Calculates CO2e emissions for a given activity category, sub-category, amount, and optional region.
 *
 * @param category - The activity category (e.g. "energy", "travel").
 * @param subCategory - The sub-category within the category (e.g. "grid_avg").
 * @param amount - The quantity of the activity (e.g. kWh, km).
 * @param region - Optional region key to apply a regional grid factor for energy calculations.
 * @returns The calculated CO2e in kilograms, or 0 if no matching emission factor exists.
 * @example
 * ```ts
 * const co2e = calculateEmissions("energy", "grid_avg", 10, "US");
 * // 4.5
 * ```
 */
export function calculateEmissions(
  category: string,
  subCategory: string,
  amount: number,
  region?: string,
): number {
  const factor = EMISSION_FACTORS[category]?.[subCategory]?.value;
  if (factor === undefined) return 0;

  let adjusted = factor * amount;

  if (category === "energy" && subCategory === "grid_avg" && region) {
    adjusted *= getRegionFactor(region);
  }

  return adjusted;
}

/**
 * Returns the human-readable label for a region key.
 *
 * @param region - The region key (e.g. "US", "DE").
 * @returns The display label for the region, or "Global Average" if not found.
 * @example
 * ```ts
 * const label = getRegionLabel("US");
 * // "United States"
 * ```
 */
export function getRegionLabel(region: string): string {
  return REGION_GRID_FACTORS[region]?.label ?? "Global Average";
}
