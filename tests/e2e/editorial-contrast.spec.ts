import { expect, test } from '@playwright/test';

type Sample = { label: string; foreground: string; surface: string; ratio: number };

for (const world of ['crystal', 'ghost'] as const) {
  test(`computed editorial contrast in ${world} mode`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    if (world === 'ghost') {
      await page.locator('.world-choice').nth(1).click();
    }
    await expect(page.locator('body')).toHaveAttribute('data-world', world);

    const measured = await page.evaluate(() => {
      type Rgba = [number, number, number, number];
      const cssColor = (value: string): Rgba => {
        const parts = value.match(/[\d.]+/g)?.map(Number) ?? [];
        if (parts.length < 3) throw new Error(`Unrecognized computed RGB color: ${value}`);
        return [parts[0], parts[1], parts[2], parts[3] ?? 1];
      };
      // Composition is on solid base color from the actual CSS cascade. A gradient
      // or backdrop-filter may change pixels: see manual audit limitation below.
      const blend = (over: Rgba, under: Rgba): Rgba => {
        const a = over[3] + under[3] * (1 - over[3]);
        return [
          ...[0, 1, 2].map(i => (over[i] * over[3] + under[i] * under[3] * (1 - over[3])) / a),
          a,
        ] as Rgba;
      };
      const lum = (c: Rgba) => {
        const [r, g, b] = c.slice(0, 3).map(n => {
          const v = n / 255;
          return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4;
        });
        return r * .2126 + g * .7152 + b * .0722;
      };
      const ratio = (fg: Rgba, bg: Rgba) => {
        const f = lum(fg), b = lum(bg);
        return Number(((Math.max(f, b) + .05) / (Math.min(f, b) + .05)).toFixed(2));
      };
      const get = (selector: string) => {
        const el = document.querySelector<HTMLElement>(selector);
        if (!el) throw new Error(`Missing UI element: ${selector}`);
        return getComputedStyle(el);
      };
      const surface = (top: string, base?: string) => {
        const bg = cssColor(get(top).backgroundColor);
        if (bg[3] === 1) return bg;
        if (!base) throw new Error(`Transparent surface without solid base: ${top}`);
        return blend(bg, cssColor(get(base).backgroundColor));
      };
      const cases: [string, string, string, string?][] = [
        ['signal caption', '.signal-end > span', '.signal'],
        ['about description', '.about-description', '.about-copy'],
        ['stream metadata', '.broadcast-meta > span', '.broadcast', '.signal'],
        ['signal summary', '.signal-summary span', '.signal-summary', '.signal'],
        ['footer metadata', '.footer-bottom > span', '.footer'],
        ['archive overview label', '.archive-overview-head span', '.archive'],
      ];
      return cases.map(([label, element, panel, parent]) => {
        const foreground = cssColor(get(element).color);
        const bg = surface(panel, parent);
        return {
          label,
          foreground: get(element).color,
          surface: panel,
          ratio: ratio(foreground, bg),
        };
      });
    });

    console.log(`${world.toUpperCase()} computed contrast (flat base + transparent panel; gradients need visual review):`, measured);
    for (const result of measured as Sample[]) {
      expect(result.ratio, `${world} — ${result.label}: ${result.foreground} on ${result.surface}`).toBeGreaterThanOrEqual(4.5);
    }
  });
}

for (const world of ['crystal', 'ghost'] as const) {
  test(`320px text spacing/reflow in ${world} mode`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto('/');
    if (world === 'ghost') await page.locator('.world-choice').nth(1).click();

    // WCAG 1.4.12 user-overrides: line-height 1.5, letter-spacing .12em,
    // word-spacing .16em, paragraph spacing 2em. Browser-native zoom is a
    // separate manual exercise; this verifies overriding styles at 320 CSS px.
    await page.addStyleTag({ content: `
      :is(p, a, button, span, small, strong, h1, h2, h3) {
        line-height: 1.5 !important;
        letter-spacing: .12em !important;
        word-spacing: .16em !important;
      }
      p { margin-bottom: 2em !important; }
    ` });
    const result = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      keyControls: ['.mobile-menu-button', '.world-control', '.gallery-experience', '.footer-links'].map(selector => {
        const el = document.querySelector(selector);
        if (!el) throw new Error(`Missing section ${selector}`);
        const rect = el.getBoundingClientRect();
        return { selector, left: rect.left, right: rect.right };
      }),
    }));
    expect(result.scrollWidth).toBeLessThanOrEqual(result.viewport + 2);
    for (const el of result.keyControls) {
      expect(el.left, el.selector).toBeGreaterThanOrEqual(-2);
      expect(el.right, el.selector).toBeLessThanOrEqual(322);
    }
    const trigger = page.locator('.mobile-menu-button');
    await trigger.click();
    await expect(page.locator('#mobile-menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
  });
}
