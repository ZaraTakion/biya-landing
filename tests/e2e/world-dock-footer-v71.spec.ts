import { expect, test } from '@playwright/test';

for (const width of [320, 375, 1440]) {
  test(`V7.1 floating world control clears footer and reappears by Archive at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 760 });
    await page.goto('/');
    const dock = page.locator('.biya-world-dock');

    await page.locator('#archive-title').scrollIntoViewIfNeeded();
    await expect(dock).toBeVisible();
    await expect(dock.locator('button')).toHaveCount(2);

    await page.locator('.footer-bottom').scrollIntoViewIfNeeded();
    await expect(dock).toHaveCount(0);
    await expect(page.locator('.footer-bottom a[href="/art-policy"]')).toBeVisible();

    await page.locator('#archive-title').scrollIntoViewIfNeeded();
    await expect(dock).toBeVisible();
    await dock.locator('button').nth(1).click();
    await expect(page.locator('body')).toHaveAttribute('data-world', 'ghost');
    expect(await page.evaluate(() => document.documentElement.scrollWidth))
      .toBeLessThanOrEqual(width + 2);
  });
}
