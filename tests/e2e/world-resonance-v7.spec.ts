import { expect, test } from '@playwright/test';

test('V7 keeps the frequency switch available past the portal, in PT and EN', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('.biya-world-dock')).toHaveCount(0);
  await page.locator('#archive-title').scrollIntoViewIfNeeded();
  const dock = page.locator('.biya-world-dock');
  await expect(dock).toBeVisible();
  await expect(dock.locator('button')).toHaveCount(2);
  await dock.getByRole('button', { name: 'Mudar para Ghost' }).click();
  await expect(page.locator('body')).toHaveAttribute('data-world', 'ghost');
  await expect(dock.getByRole('button', { name: 'Mudar para Ghost' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.world-scene')).toHaveAttribute('data-scene', 'ghost');
  await dock.getByRole('button', { name: 'Mudar para Crystal' }).click();
  await expect(page.locator('body')).toHaveAttribute('data-world', 'crystal');

  await page.locator('.language-switch button[lang="en"]').click();
  // The sticky header can scroll into view during a programmatic click.
  // Return to the archive before asserting that the dock is available there.
  await page.locator('.gallery-experience').scrollIntoViewIfNeeded();
  await expect(dock.getByRole('button', { name: 'Switch to Ghost' })).toBeVisible();
  await dock.getByRole('button', { name: 'Switch to Ghost' }).click();
  await expect(page.locator('body')).toHaveAttribute('data-world', 'ghost');

  await page.locator('#portal-title').scrollIntoViewIfNeeded();
  await expect(dock).toHaveCount(0);
  await expect(page.locator('.world-choice').nth(1)).toHaveAttribute('aria-pressed', 'true');
});

test('V7 interactive theatre preserves original src, supports arrow navigation and closes with Escape', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.locator('.expand-art').click();
  const dlg = page.getByRole('dialog');
  await expect(dlg).toBeVisible();
  await expect(dlg).toHaveAttribute('aria-modal', 'true');
  await expect(dlg.locator('.biya-theatre-filmstrip button')).toHaveCount(6);
  await expect(dlg.locator('.biya-theatre-count')).toHaveText('01 / 06');
  await expect(dlg.locator('.biya-theatre-stage img.protected-art')).toHaveAttribute('src', /\/assets\//);
  const original = await dlg.locator('.biya-theatre-stage img.protected-art').getAttribute('src');

  await page.keyboard.press('ArrowRight');
  await expect(dlg.locator('.biya-theatre-count')).toHaveText('02 / 06');
  await expect(dlg.locator('.biya-theatre-filmstrip button').nth(1)).toHaveAttribute('aria-pressed', 'true');
  const next = await dlg.locator('.biya-theatre-stage img.protected-art').getAttribute('src');
  expect(next).not.toBe(original);

  await dlg.locator('.biya-theatre-filmstrip button').nth(5).click();
  await expect(dlg.locator('.biya-theatre-count')).toHaveText('06 / 06');
  await dlg.getByRole('button', { name: /Ver próxima arte|View next artwork/i }).click();
  await expect(dlg.locator('.biya-theatre-count')).toHaveText('01 / 06');

  await page.keyboard.press('Escape');
  await expect(dlg).toHaveCount(0);
  await expect(page.locator('.expand-art')).toBeFocused();
  expect(await page.locator('body').evaluate(el => getComputedStyle(el).overflow)).not.toBe('hidden');
});

for (const width of [320, 375, 768, 1440, 3840]) {
  test(`V7 theatre reflows and the original portrait stays visible at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width <= 375 ? 740 : 900 });
    await page.goto('/');
    await expect(page.locator('#stage-crystal')).toBeVisible();
    await page.locator('.world-choice').nth(1).click();
    await expect(page.locator('#stage-ghost')).toBeVisible();
    await page.locator('.expand-art').click();
    const dlg = page.getByRole('dialog');
    await expect(dlg).toBeVisible();

    const box = await dlg.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.x).toBeGreaterThanOrEqual(-2);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width + 2);
    await expect(dlg.locator('.biya-theatre-stage img')).toBeVisible();
    await expect(dlg.locator('.biya-theatre-header button')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dlg).toHaveCount(0);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });
}

test('V7 reduced motion removes decorative orbit and theatre image animations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await expect(page.locator('.art-stage')).toBeVisible();
  const animation = await page.locator('.art-stage').evaluate(el => getComputedStyle(el,'::after').animationName);
  expect(animation).toBe('none');
  await page.locator('.expand-art').click();
  await expect(page.locator('.biya-theatre-stage img')).toHaveCSS('animation-name','none');
});
