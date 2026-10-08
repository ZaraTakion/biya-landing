import { expect, test } from '@playwright/test';

const screens = [
  { width: 320, height: 740 },
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1080, height: 1080 },
  { width: 1440, height: 900 },
  { width: 3840, height: 2160 },
];

for (const screen of screens) {
  test(`Parallel Worlds fits ${screen.width} × ${screen.height}`, async ({ page }) => {
    await page.setViewportSize(screen);
    await page.goto('/');

    await expect(page.locator('#portal-title')).toBeVisible();
    await expect(page.locator('.world-control')).toBeVisible();
    await expect(page.locator('.footer-version')).toContainText(/VERSÃO \/ [a-f0-9]{7}/);

    const metrics = await page.evaluate(() => {
      const viewport = document.documentElement.clientWidth;
      const bounds = ['.header', '.world-control', '.pulse-machine', '.gallery-experience'].map(selector => {
        const element = document.querySelector(selector);
        const rect = element?.getBoundingClientRect();
        return { selector, left: rect?.left ?? 0, right: rect?.right ?? 0 };
      });
      return { viewport, scrollWidth: document.documentElement.scrollWidth, bounds };
    });
    expect(metrics.scrollWidth, `Horizontal overflow at ${screen.width}px`).toBeLessThanOrEqual(metrics.viewport + 2);
    for (const { selector, left, right } of metrics.bounds) {
      expect(left, `${selector} left edge at ${screen.width}px`).toBeGreaterThanOrEqual(-2);
      expect(right, `${selector} right edge at ${screen.width}px`).toBeLessThanOrEqual(screen.width + 2);
    }

    if (screen.width <= 900) {
      const menuButton = page.locator('.mobile-menu-button');
      await expect(menuButton).toBeVisible();
      expect(await menuButton.evaluate(node => node.getBoundingClientRect().height)).toBeGreaterThanOrEqual(40);
      await menuButton.click();
      await expect(page.locator('#mobile-menu')).toBeVisible();
      await page.locator('#mobile-menu a[href="#archive"]').click();
      await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    }
  });
}

test('375px bilingual world switch and gallery keyboard remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  await page.locator('.world-control button').nth(1).click();
  await expect(page.locator('body')).toHaveAttribute('data-world', 'ghost');

  await page.locator('.language-switch button[lang="en"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('.footer-version')).toContainText('VERSION /');

  const viewer = page.locator('.gallery-experience');
  await viewer.focus();
  await viewer.press('ArrowRight');
  await expect(page.locator('.gallery-serial')).toContainText('02 — 06');
});

test('release manifest is public and matches the footer', async ({ page, request }) => {
  await page.goto('/');
  const response = await request.get('/version.json');
  expect(response.ok()).toBeTruthy();
  const manifest = await response.json();
  expect(manifest.site).toBe('biya-prism');
  expect(manifest.revision).toMatch(/^([a-f0-9]{40}|local)$/);
  await expect(page.locator('.footer-version')).toContainText(manifest.shortRevision);
});
