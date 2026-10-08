import { expect, test } from '@playwright/test';

test('Crystal and Ghost receive distinct live scenes while the original portraits remain visible', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('.world-scene')).toHaveAttribute('data-scene', 'crystal');
  await expect(page.locator('.world-scene .scene-fragment')).toHaveCount(3);
  const crystal = await page.locator('.world-scene .scene-light').evaluate(el => getComputedStyle(el).backgroundImage);
  await expect(page.locator('#stage-crystal')).toBeVisible();

  await page.locator('.world-choice').nth(1).click();
  await expect(page.locator('.world-scene')).toHaveAttribute('data-scene', 'ghost');
  const ghost = await page.locator('.world-scene .scene-light').evaluate(el => getComputedStyle(el).backgroundImage);
  expect(crystal).not.toBe(ghost);
  await expect(page.locator('#stage-ghost')).toBeVisible();
  await expect(page.locator('#stage-crystal')).toHaveCount(0);
  await expect(page.locator('.world-scene .scene-fragment')).toHaveCount(3);
});

test('fine pointer lights the scene without moving the artwork itself', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/motion-ready/);
  await page.locator('.portal').dispatchEvent('pointermove', {
    pointerType: 'mouse',
    clientX: 975,
    clientY: 410,
  });
  await expect.poll(async () => page.locator('.portal').evaluate(el => el.style.getPropertyValue('--pointer-x'))).not.toBe('');
  const data = await page.locator('.world-scene .scene-light').evaluate(el => ({
    transform: getComputedStyle(el).transform,
    image: getComputedStyle(el).backgroundImage,
  }));
  expect(data.image).toContain('radial-gradient');
  expect(data.transform).not.toBe('none');
  await expect(page.locator('#stage-crystal')).toBeVisible();
});

test('changing a gallery selection changes its scene and updates editorial progress', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const gallery = page.locator('.gallery-experience');
  await expect(gallery).toHaveAttribute('data-art-index', '0');
  const initial = await page.locator('.art-showcase').evaluate(el => getComputedStyle(el).backgroundImage);
  const progress = page.locator('.gallery-progress > span');
  await expect(progress).toHaveCSS('transform', /matrix/);
  await gallery.locator('.round-arrow').nth(1).click();
  await expect(gallery).toHaveAttribute('data-art-index', '1');
  await expect(page.locator('.gallery-serial')).toContainText('02 — 06');
  const next = await page.locator('.art-showcase').evaluate(el => getComputedStyle(el).backgroundImage);
  expect(next).not.toBe(initial);
  await expect(page.locator('#gallery-image')).toHaveAttribute('src', /outfits\.webp/);
  await expect(page.locator('.gallery-title-area')).toContainText(/Muitas Facetas|Many Faces/);
});

test('reduced motion stops all new atmosphere and artwork animations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  for (const selector of [
    '.world-scene', '.world-scene .scene-fragment-one',
    '.art-showcase > .protected-frame', '.gallery-title-area',
  ]) {
    await expect(page.locator(selector)).toHaveCSS('animation-name', 'none');
  }
  await page.locator('.world-choice').nth(1).click();
  await expect(page.locator('#stage-ghost')).toBeVisible();
  const bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(bodyWidth).toBeLessThanOrEqual(377);
});

test('art-first mobile remains stable at 320px across world changes and gallery selection', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/');
  await page.locator('.world-choice').nth(1).click();
  await expect(page.locator('#stage-ghost')).toBeVisible();
  await page.locator('.world-choice').nth(0).click();
  await expect(page.locator('#stage-crystal')).toBeVisible();
  await page.locator('.archive-thumbs button').nth(2).click();
  await expect(page.locator('.gallery-experience')).toHaveAttribute('data-art-index', '2');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(322);
});
