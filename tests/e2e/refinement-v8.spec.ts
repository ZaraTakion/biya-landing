import { expect, test } from '@playwright/test';

test('V8 scroll indicator follows the viewport without requiring app state', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const progress = page.locator('progress.progress');
  await expect(progress).toHaveAttribute('max', '100');
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(async () => progress.evaluate(element => (element as HTMLProgressElement).value)).toBeGreaterThan(95);
});

test('V8 browser theme and language metadata follow Crystal and Ghost', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#f5f5fa');
  await page.locator('.world-choice').nth(1).click();
  await expect(page.locator('body')).toHaveAttribute('data-world', 'ghost');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#1b1425');
  await page.locator('.language-switch button[lang="en"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'en_US');
  await expect(page.locator('meta[property="og:locale:alternate"]')).toHaveAttribute('content', 'pt_BR');
});

test('V8 artwork policy keeps the selected language across navigation', async ({ page }) => {
  await page.goto('/');
  await page.locator('.language-switch button[lang="en"]').click();
  await page.goto('/art-policy.html');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('h1')).toHaveText('Artwork policy');
  await page.locator('.policy-language button[lang="pt-BR"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
});

test('V8 reduced motion initializes immediately and gallery controls stay usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/motion-reduced/);
  await page.locator('.archive-thumbs button').nth(2).click();
  await expect(page.locator('.gallery-serial')).toContainText('03 — 06');
  const transition = await page.locator('.archive-thumbs button').nth(2)
    .evaluate(element => getComputedStyle(element).transitionDuration);
  expect(transition.split(',').every(value => parseFloat(value) === 0)).toBeTruthy();
});
