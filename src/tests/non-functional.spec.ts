import { test, expect } from '../fixtures/test.fixture';
import { ProofHelper } from '../utils/ProofHelper';

test.describe('Website Speed, Security and Screen Sizes', () => {

  test('Check how fast homepage opens', { tag: ['@nonfunctional', '@perf', '@regression'] }, async ({ page }, testInfo) => {
    await test.step('Time how long homepage takes to load', async () => {
      ProofHelper.logStep('Timing homepage load speed');
      const start = Date.now();
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      const duration = Date.now() - start;

      const timing = await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return {
          ttfb: nav ? Math.round(nav.responseStart - nav.requestStart) : 0,
          domLoaded: nav ? Math.round(nav.domContentLoadedEventEnd - nav.startTime) : 0,
        };
      });

      ProofHelper.logVerified(`Page loaded in: ${duration}ms`);
      ProofHelper.logVerified(`Server first response: ${timing.ttfb}ms`);
      ProofHelper.logVerified(`Content ready in: ${timing.domLoaded}ms`);

      expect(timing.domLoaded).toBeLessThan(10000);
      await ProofHelper.captureProof(page, testInfo, 'perf-homepage-timing', 'Speed measurement');
    });
  });

  test('Check website security and padlock', { tag: ['@nonfunctional', '@security', '@regression'] }, async ({ page }, testInfo) => {
    await test.step('Check secure padlock and security settings', async () => {
      ProofHelper.logStep('Checking padlock and headers');
      const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
      expect(response).not.toBeNull();

      const headers = response!.headers();
      ProofHelper.logVerified(`Secure padlock: ${page.url().startsWith('https://') ? 'Yes (HTTPS)' : 'No (HTTP)'}`);
      expect(page.url().startsWith('https://')).toBeTruthy();

      const hasContentTypeOptions = headers['x-content-type-options'] === 'nosniff';
      const server = headers['server'] || 'N/A';

      ProofHelper.logVerified(`Security content type: ${headers['x-content-type-options'] || 'Not set'}`);
      ProofHelper.logVerified(`Referrer rule: ${headers['referrer-policy'] || 'Not set'}`);
      ProofHelper.logVerified(`Cloud provider: ${server}`);

      expect(hasContentTypeOptions).toBeTruthy();
      await ProofHelper.captureProof(page, testInfo, 'sec-security-headers', 'Security check');
    });
  });

  test('Check if pictures have text descriptions for screen readers', { tag: ['@nonfunctional', '@a11y', '@regression'] }, async ({ page }, testInfo) => {
    await test.step('Look at pictures on homepage for alt text descriptions', async () => {
      ProofHelper.logStep('Checking picture descriptions');
      await page.goto('/', { waitUntil: 'domcontentloaded' });

      const audit = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        const missing = imgs.filter(img => !img.hasAttribute('alt') || img.getAttribute('alt')?.trim() === '');
        return {
          total: imgs.length,
          missingCount: missing.length,
          missingSources: missing.map(img => img.src)
        };
      });

      ProofHelper.logVerified(`Total pictures checked: ${audit.total}`);
      ProofHelper.logVerified(`Pictures without description: ${audit.missingCount}`);

      await testInfo.attach('Picture descriptions report', {
        body: JSON.stringify(audit, null, 2),
        contentType: 'application/json'
      });

      expect(audit.total).toBeGreaterThan(0);
      await ProofHelper.captureProof(page, testInfo, 'a11y-images-audit', 'Picture descriptions audit');
    });
  });

  test('Check website layout on computer, tablet and phone', { tag: ['@nonfunctional', '@responsive', '@regression'] }, async ({ page }, testInfo) => {
    const viewports = [
      { name: 'Computer (Desktop)', width: 1440, height: 900, file: 'responsive-desktop' },
      { name: 'iPad (Tablet)', width: 768, height: 1024, file: 'responsive-tablet' },
      { name: 'Mobile Phone', width: 390, height: 844, file: 'responsive-mobile' },
    ];

    for (const vp of viewports) {
      await test.step(`Check view on ${vp.name}`, async () => {
        ProofHelper.logStep(`Resizing browser to ${vp.name}`);
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto('/', { waitUntil: 'domcontentloaded' });

        if (vp.width <= 768) {
          const visibleHeaderButtons = page.locator('header button:visible');
          if (await visibleHeaderButtons.count() > 0) {
            await expect(visibleHeaderButtons.first()).toBeVisible();
            ProofHelper.logVerified(`Mobile menu button shows on ${vp.name}`);
          }
        }

        await ProofHelper.captureProof(page, testInfo, vp.file, `Screenshot for ${vp.name}`);
      });
    }
  });

});
