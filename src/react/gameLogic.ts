import type { World } from './data';

export type PulseItem = {
  id: number;
  x: number;
  y: number;
  kind: World;
  radius: number;
  speed: number;
};

export type CatchResult = {
  score: number;
  combo: number;
  misses: number;
  matched: boolean;
};

export function resolvePulse(
  playerWorld: World,
  itemWorld: World,
  score: number,
  combo: number,
  misses: number,
): CatchResult {
  const matched = playerWorld === itemWorld;
  if (matched) {
    const nextCombo = combo + 1;
    return {
      matched: true,
      combo: nextCombo,
      misses,
      score: score + 10 + Math.min(40, nextCombo * 2),
    };
  }
  return {
    matched: false,
    combo: 0,
    misses: misses + 1,
    score: Math.max(0, score - 5),
  };
}

export function nextWorld(world: World): World {
  return world === 'crystal' ? 'ghost' : 'crystal';
}
