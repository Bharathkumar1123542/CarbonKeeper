import { getEquivalent } from '../equivalents';

describe('getEquivalent', () => {
  it('returns zero emissions message for 0 kg', () => {
    expect(getEquivalent(0)).toBe('Zero emissions!');
  });

  it('returns zero for negative values', () => {
    expect(getEquivalent(-5)).toBe('Zero emissions!');
  });

  it('returns smartphone equivalent for small values', () => {
    const result = getEquivalent(0.01);
    expect(result).toContain('smartphone');
  });

  it('returns laundry equivalent for mid-range values', () => {
    const result = getEquivalent(2.0);
    expect(result).toContain('laundry');
  });

  it('returns flight equivalent for large values', () => {
    const result = getEquivalent(200);
    expect(result).toContain('flight');
  });

  it('returns a non-empty string for any positive value', () => {
    const result = getEquivalent(1);
    expect(result.length).toBeGreaterThan(0);
    expect(result).toContain('x');
  });
});
