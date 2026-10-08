import { expect, test } from '@playwright/test';

const viewports = [
  { width: 320, height: 740 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
] as const;

for (const size of viewports) {
  test(`portal portraits really render (not a blank frame) at ${size.width}px`, async ({ page }) => {
    await page.setViewportSize(size);
    await page.goto('/');

    for (const world of ['crystal', 'ghost', 'crystal'] as const) {
      await page.locator(`.world-choice`).nth(world === 'crystal' ? 0 : 1).click();
      await expect(page.locator('#art-stage')).toHaveAttribute('data-world', world);
      const image = page.locator(`#stage-${world}`);
      await expect(image).toHaveCount(1);
      await expect(page.locator('.stage-inner > .protected-frame')).toHaveCount(1);
      await expect(image).toBeVisible();
      await expect(image).toHaveJSProperty('complete', true);
      const rendered = await image.evaluate(el => {
        const img = el as HTMLImageElement;
        const style = getComputedStyle(img);
        const box = img.getBoundingClientRect();
        const wrapper = img.closest<HTMLElement>('.protected-frame');
        const wrapperRect = wrapper?.getBoundingClientRect();
        return {
          intrinsicWidth: img.naturalWidth,
          intrinsicHeight: img.naturalHeight,
          opacity: Number(style.opacity),
          visibility: style.visibility,
          display: style.display,
          width: box.width,
          height: box.height,
          wrapperHeight: wrapperRect?.height ?? 0,
          left: box.left,
          right: box.right,
          wrapperPosition: wrapper ? getComputedStyle(wrapper).position : '',
          imagePosition: style.position,
        };
      });
      expect(rendered.intrinsicWidth, `${world} file failed to load at ${size.width}px`).toBeGreaterThan(300);
      expect(rendered.intrinsicHeight).toBeGreaterThan(200);
      expect(rendered.opacity, `${world} hidden by CSS at ${size.width}px`).toBeGreaterThanOrEqual(.99);
      expect(rendered.visibility).toBe('visible');
      expect(rendered.display).not.toBe('none');
      expect(rendered.width).toBeGreaterThan(140);
      expect(rendered.height, `${world} has zero rendered height`).toBeGreaterThan(160);
      expect(rendered.wrapperHeight, `${world} wrapper collapsed`).toBeGreaterThan(160);
      expect(rendered.left).toBeGreaterThanOrEqual(-2);
      expect(rendered.right).toBeLessThanOrEqual(size.width + 2);
      if (size.width <= 720) {
        expect(rendered.wrapperPosition).toBe('relative');
        expect(rendered.imagePosition).toBe('relative');
      }
    }
    const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(documentWidth).toBeLessThanOrEqual(size.width + 2);
  });
}

test('hero portrait is eagerly requested and has meaningful alt text in PT/EN', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const img = page.locator('#stage-crystal');
  await expect(img).toHaveAttribute('loading', 'eager');
  await expect(img).toHaveAttribute('fetchpriority', 'high');
  await expect(img).toHaveAttribute('alt', /cabelo|cristal/i);
  await page.locator('.language-switch button[lang="en"]').click();
  await expect(img).toHaveAttribute('alt', /crystal|character/i);
  await page.locator('.world-choice').nth(1).click();
  await expect(page.locator('#stage-ghost')).toHaveAttribute('fetchpriority', 'high');
  await expect(page.locator('#stage-crystal')).toHaveCount(0);
});
