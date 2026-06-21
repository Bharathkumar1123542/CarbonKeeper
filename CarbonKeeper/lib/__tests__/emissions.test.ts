import { calculateEmissions } from '../emissions';

describe('calculateEmissions', () => {
  it('calculates car transport correctly', () => {
    expect(calculateEmissions('transport', 'car', 10)).toBeCloseTo(1.7, 10);
  });

  it('calculates flight correctly', () => {
    expect(calculateEmissions('transport', 'flight', 1000)).toBe(255);
  });

  it('calculates bus correctly', () => {
    expect(calculateEmissions('transport', 'bus', 5)).toBe(0.4);
  });

  it('calculates train correctly', () => {
    expect(calculateEmissions('transport', 'train', 50)).toBe(2.0);
  });

  it('returns zero for bike', () => {
    expect(calculateEmissions('transport', 'bike', 10)).toBe(0);
  });

  it('calculates beef correctly', () => {
    expect(calculateEmissions('food', 'beef', 0.5)).toBe(13.5);
  });

  it('calculates chicken correctly', () => {
    expect(calculateEmissions('food', 'chicken', 1)).toBe(6.9);
  });

  it('calculates energy correctly', () => {
    expect(calculateEmissions('energy', 'grid_avg', 50)).toBe(20);
  });

  it('calculates solar as near-zero', () => {
    expect(calculateEmissions('energy', 'solar', 100)).toBe(5);
  });

  it('calculates shopping items correctly', () => {
    expect(calculateEmissions('shopping', 'new_laptop', 1)).toBe(230);
  });

  it('returns 0 for unknown categories', () => {
    expect(calculateEmissions('unknown', 'category', 10)).toBe(0);
  });

  it('returns 0 for unknown subcategories', () => {
    expect(calculateEmissions('transport', 'helicopter', 10)).toBe(0);
  });

  it('handles zero amount correctly', () => {
    expect(calculateEmissions('transport', 'car', 0)).toBe(0);
  });

  it('handles negative amounts (returns negative emissions)', () => {
    expect(calculateEmissions('transport', 'car', -10)).toBeCloseTo(-1.7, 10);
  });

  it('applies regional grid modifier for energy', () => {
    expect(calculateEmissions('energy', 'grid_avg', 10, 'india')).toBeCloseTo(7.0, 10);
  });

  it('uses default factor for unknown region', () => {
    expect(calculateEmissions('energy', 'grid_avg', 10, 'unknown')).toBeCloseTo(4.0, 10);
  });

  it('does not apply region modifier to non-energy categories', () => {
    expect(calculateEmissions('transport', 'car', 10, 'india')).toBeCloseTo(1.7, 10);
  });
});
