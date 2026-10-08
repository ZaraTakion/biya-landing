import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * Test the chosen editorial-text tokens against representative solid chapter
 * surfaces. This does not replace testing composited backgrounds in a browser.
 */
const stylesheet = readFileSync(new URL('../../src/react/design-v2.css', import.meta.url), 'utf8');

function token(name: string): string {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = stylesheet.match(new RegExp(`--${escaped}:\\s*(#[a-f\\d]{6})\\s*;`, 'i'));
  if (!match) throw new Error(`Missing CSS contrast token: ${name}`);
  return match[1];
}

function luminance(hex: string) {
  const channels = hex.slice(1).match(/../g);
  if (!channels || channels.length !== 3) throw new Error('Expected an RGB hex color');
  const [r, g, b] = channels.map(value => {
    const channel = Number.parseInt(value, 16) / 255;
    return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
  });
  return .2126 * r + .7152 * g + .0722 * b;
}

function contrastRatio(a: string, b: string) {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}

describe('BIYA editorial UI contrast tokens', () => {
  it('maintains 4.5:1 for muted text on representative Crystal surfaces', () => {
    const foreground = token('biya-copy-muted-light');
    for (const surface of ['#f3f1f7', '#f5f5fa', '#fbfafe']) {
      expect(contrastRatio(foreground, surface), `light on ${surface}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('maintains 4.5:1 for muted text on representative Ghost and archive surfaces', () => {
    const foreground = token('biya-copy-muted-dark');
    for (const surface of ['#181524', '#1b1622', '#201b29']) {
      expect(contrastRatio(foreground, surface), `dark on ${surface}`).toBeGreaterThanOrEqual(4.5);
    }
  });
});
