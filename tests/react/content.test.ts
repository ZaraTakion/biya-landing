import { describe, expect, it } from 'vitest';
import { artworks, copy, links, media, worlds } from '../../src/react/data';

describe('Biya public content contract', () => {
  it('keeps PT and EN complete for critical release copy', () => {
    for (const locale of ['pt', 'en'] as const) {
      expect(copy[locale].title).toContain('BIYA');
      expect(copy[locale].gameTitle).toBe('PARALLEL PULSE');
      expect(copy[locale].policy.length).toBeGreaterThan(5);
      expect(worlds[locale].crystal.caption).toContain('CRYSTAL');
      expect(worlds[locale].ghost.caption).toContain('GHOST');
    }
  });

  it('has six gallery works and three stream references', () => {
    expect(artworks).toHaveLength(6);
    expect(media).toHaveLength(3);
  });

  it('uses only HTTPS for public external links', () => {
    for (const value of Object.values(links)) expect(value.startsWith('https://')).toBe(true);
  });
});
