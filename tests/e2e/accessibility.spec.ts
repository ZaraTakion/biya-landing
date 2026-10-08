import { expect, test } from '@playwright/test';

test('mobile disclosure supports Escape, outside dismissal, and desktop resize', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const trigger = page.locator('.mobile-menu-button');
  const menu = page.locator('#mobile-menu');

  await expect(menu).toHaveAttribute('inert', '');
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(menu).not.toHaveAttribute('inert', '');
  await expect(menu).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(menu.locator('a').first()).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toHaveAttribute('inert', '');

  await trigger.click();
  // Click the concept-bar outside the expanded overlay rather than an obscured element.
  await page.mouse.click(6, 6);
  await expect(menu).toHaveAttribute('inert', '');

  await trigger.click();
  await page.setViewportSize({ width: 1100, height: 800 });
  await expect(trigger).toBeHidden();
  await expect(menu).toHaveAttribute('inert', '');
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('gallery artwork dialog keeps its close control visible and restores keyboard focus on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  const open = page.locator('.expand-art');
  await open.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const close = dialog.getByRole('button', { name: /FECHAR/ });
  await expect(close).toBeFocused();

  const dimensions = await dialog.evaluate(element => {
    const box = element.getBoundingClientRect();
    return { left: box.left, right: box.right, top: box.top, bottom: box.bottom };
  });
  expect(dimensions.left).toBeGreaterThanOrEqual(0);
  expect(dimensions.right).toBeLessThanOrEqual(320);
  expect(dimensions.top).toBeGreaterThanOrEqual(0);
  expect(dimensions.bottom).toBeLessThanOrEqual(568);

  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(open).toBeFocused();
});

test('reduced-motion visitors do not see animated portal entrance or hidden chapter content', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await expect(page.locator('#portal-title')).toBeVisible();
  const motion = await page.evaluate(() => ({
    portalAnimation: getComputedStyle(document.querySelector('.portal-copy')!).animationName,
    artworkAnimation: getComputedStyle(document.querySelector('.art-stage')!).animationName,
    revealHidden: [...document.querySelectorAll('[data-reveal]')].some(node => getComputedStyle(node).visibility === 'hidden'),
  }));
  expect(motion.portalAnimation).toBe('none');
  expect(motion.artworkAnimation).toBe('none');
  expect(motion.revealHidden).toBe(false);
});

test('200% CSS-zoom stress keeps mobile content and dialog controls within the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 720 });
  await page.goto('/');
  // CSS zoom is an automated reflow stress test, not a substitute for native browser zoom/manual QA.
  await page.addStyleTag({ content: 'html { zoom: 2 !important; }' });
  await expect(page.locator('#portal-title')).toBeVisible();

  const viewport = await page.evaluate(() => {
    const root = document.documentElement;
    return { width: root.clientWidth, scrollWidth: root.scrollWidth };
  });
  expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.width + 2);

  const trigger = page.locator('.mobile-menu-button');
  await expect(trigger).toBeVisible();
  await trigger.click();
  await expect(page.locator('#mobile-menu')).toBeVisible();

  await page.keyboard.press('Escape');
  await page.locator('.expand-art').click();
  const dialog = page.getByRole('dialog');
  const close = dialog.getByRole('button', { name: /FECHAR/ });
  await expect(close).toBeVisible();
  const box = await close.boundingBox();
  expect(box).toBeTruthy();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(640);
  await close.click();
  await expect(dialog).toHaveCount(0);
});
