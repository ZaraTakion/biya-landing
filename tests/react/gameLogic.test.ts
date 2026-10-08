import { describe, expect, it } from 'vitest';
import { canvasResolution, nextWorld, resolvePulse, shouldAdvancePulse } from '../../src/react/gameLogic';

describe('Parallel Pulse game logic', () => {
  it('switches between Crystal and Ghost', () => {
    expect(nextWorld('crystal')).toBe('ghost');
    expect(nextWorld('ghost')).toBe('crystal');
  });

  it('rewards a matching frequency and grows combo', () => {
    const result = resolvePulse('crystal', 'crystal', 20, 2, 0);
    expect(result.matched).toBe(true);
    expect(result.combo).toBe(3);
    expect(result.score).toBeGreaterThan(20);
    expect(result.misses).toBe(0);
  });

  it('awards the rare white-heart pickup in either world without a miss', () => {
    const crystal = resolvePulse('crystal', 'heart', 10, 2, 1);
    const ghost = resolvePulse('ghost', 'heart', 10, 2, 1);
    expect(crystal).toEqual(ghost);
    expect(crystal.matched).toBe(true);
    expect(crystal.score).toBe(56);
    expect(crystal.combo).toBe(3);
    expect(crystal.misses).toBe(1);
  });

  it('penalizes a mismatched frequency without negative score', () => {
    const result = resolvePulse('ghost', 'crystal', 2, 5, 1);
    expect(result.matched).toBe(false);
    expect(result.combo).toBe(0);
    expect(result.score).toBe(0);
    expect(result.misses).toBe(2);
  });
  it('uses the actual visible canvas box, even on a 320px phone', () => {
    expect(canvasResolution(267.8, 144.2, 3)).toEqual({
      width: 268, height: 144, dpr: 2, pixelWidth: 536, pixelHeight: 288,
    });
  });

  it('caps oversized backing buffers and rejects invalid dimensions', () => {
    const result = canvasResolution(3840, 2076, Number.NaN);
    expect(result).toEqual({
      width: 3840, height: 2076, dpr: 1, pixelWidth: 3840, pixelHeight: 2076,
    });
    expect(canvasResolution(0, 0, 0).pixelWidth).toBe(1);
  });

  it('does not spend frames or advance gameplay when hidden or idle', () => {
    expect(shouldAdvancePulse('idle', true, true)).toBe(false);
    expect(shouldAdvancePulse('over', true, true)).toBe(false);
    expect(shouldAdvancePulse('running', false, true)).toBe(false);
    expect(shouldAdvancePulse('running', true, false)).toBe(false);
    expect(shouldAdvancePulse('running', true, true)).toBe(true);
  });
});
