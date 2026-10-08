import { expect, test } from '@playwright/test';

test('V6 removes the ornamental navigation and redundant separator sections', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  for (const obsolete of ['.concept-bar', '.ribbon', '.intermission', '.rail-nav', '.site-utility', '.stage-sticker', '.archive-decor', '.world-ambient']) {
    await expect(page.locator(obsolete), `Obsolete design UI: ${obsolete}`).toHaveCount(0);
  }
  await expect(page.locator('.header-nav')).toBeVisible();
  await expect(page.locator('#archive-title')).toBeVisible();
  await expect(page.locator('.archive-thumbs button')).toHaveCount(6);
  await expect(page.locator('.signal-summary a[href*="youtube.com"]')).toHaveCount(1);
  await expect(page.locator('.footer-bottom a[href="/art-policy"]')).toBeVisible();
});

test('worlds have distinct art direction and Ghost reverses the desktop composition', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const frame = async () => page.evaluate(() => {
    const copy = document.querySelector('.portal-copy')!.getBoundingClientRect();
    const art = document.querySelector('.art-stage')!.getBoundingClientRect();
    const hero = getComputedStyle(document.querySelector('#portal-title')!);
    const gallery = document.querySelector('.gallery-experience')!.getBoundingClientRect();
    const showcase = document.querySelector('.art-showcase')!.getBoundingClientRect();
    return {
      copyX: copy.left,
      artX: art.left,
      heroFont: hero.fontFamily,
      showcaseWidth: showcase.width,
      galleryWidth: gallery.width,
      scrollWidth: document.documentElement.scrollWidth,
      width: document.documentElement.clientWidth,
    };
  });
  const crystal = await frame();
  expect(crystal.copyX).toBeLessThan(crystal.artX);
  expect(crystal.showcaseWidth).toBeGreaterThan(crystal.galleryWidth * .55);

  await page.locator('.world-choice').nth(1).click();
  await expect(page.locator('body')).toHaveAttribute('data-world', 'ghost');
  const ghost = await frame();
  expect(ghost.artX).toBeLessThan(ghost.copyX);
  expect(ghost.heroFont.toLowerCase()).toContain('georgia');
  expect(crystal.heroFont.toLowerCase()).not.toContain('georgia');
  expect(ghost.scrollWidth).toBeLessThanOrEqual(ghost.width + 2);
});

for (const world of ['crystal', 'ghost'] as const) {
  test(`V6 art-first chapters preserve touch and no horizontal overflow on 375px: ${world}`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    if (world === 'ghost') await page.locator('.world-choice').nth(1).click();
    await expect(page.locator('#portal-title')).toBeVisible();
    await expect(page.locator('.art-stage')).toBeVisible();
    await expect(page.locator('.gallery-experience')).toBeVisible();
    await expect(page.locator('.signal-rail .broadcast')).toHaveCount(3);
    const measures = await page.evaluate(() => {
      const client = document.documentElement.clientWidth;
      return {
        client, width: document.documentElement.scrollWidth,
        sections: ['.portal', '.archive', '.signal', '.pulse-section', '.about', '.footer'].map(s => {
          const rect = document.querySelector(s)!.getBoundingClientRect();
          return { selector: s, left: rect.left, right: rect.right };
        }),
      };
    });
    expect(measures.width, `Horizontal overflow in ${world}`).toBeLessThanOrEqual(measures.client + 2);
    for (const section of measures.sections) {
      expect(section.left, section.selector).toBeGreaterThanOrEqual(-2);
      expect(section.right, section.selector).toBeLessThanOrEqual(377);
    }
    await page.locator('.archive-thumbs button').nth(4).click();
    await expect(page.locator('.gallery-serial')).toContainText('05 — 06');
  });
}
