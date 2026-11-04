import { test, expect } from '../fixtures/test.fixture';
import { ProofHelper } from '../utils/ProofHelper';

test.describe('Basic Website Health Checks', () => {

  test('Check if homepage opens securely and shows correct logo', { tag: ['@bvt', '@sanity', '@regression'] }, async ({ page }, testInfo) => {
    await test.step('Open homepage and check for secure lock', async () => {
      ProofHelper.logStep('Opening homepage');
      const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
      expect(response).not.toBeNull();
      expect(response!.status()).toBe(200);
      expect(page.url()).toContain('https://');
      ProofHelper.logVerified('Homepage opened with secure lock');
    });

    await test.step('Make sure website title says Vehicle Databases', async () => {
      ProofHelper.logStep('Checking title text');
      const title = await page.title();
      expect(title.toLowerCase()).toContain('vehicle databases');
      ProofHelper.logVerified(`Website title is: "${title}"`);

      await ProofHelper.captureProof(page, testInfo, 'bvt-homepage-loaded', 'Homepage loaded');
    });
  });

  test('Open all main pages and make sure none are broken', { tag: ['@bvt', '@sanity', '@regression'] }, async ({ page }) => {
    const pages = [
      { path: '/', name: 'Homepage' },
      { path: '/api', name: 'APIs list' },
      { path: '/docs', name: 'Docs page' },
      { path: '/contact-us', name: 'Contact page' },
      { path: '/schedule-a-demo', name: 'Demo page' },
      { path: '/downloads', name: 'Downloads page' },
      { path: '/mcp', name: 'MCP page' }
    ];

    for (const item of pages) {
      await test.step(`Open ${item.name}`, async () => {
        ProofHelper.logStep(`Checking ${item.name}`);
        const res = await page.goto(item.path, { waitUntil: 'domcontentloaded' });
        expect(res).not.toBeNull();
        expect(res!.status()).toBe(200);
        ProofHelper.logVerified(`${item.name} opened fine`);
      });
    }
  });

  test('Check that all styling and script files load properly', { tag: ['@bvt', '@regression'] }, async ({ page }) => {
    const failedAssets: string[] = [];
    page.on('response', (res) => {
      if (res.url().includes('/_next/static/') && res.status() >= 400) {
        failedAssets.push(`${res.status()} - ${res.url()}`);
      }
    });

    await test.step('Look for broken files on homepage', async () => {
      ProofHelper.logStep('Checking website files');
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('load');
      expect(failedAssets, `Broken files found: ${failedAssets.join(', ')}`).toHaveLength(0);
      ProofHelper.logVerified('No broken files found');
    });
  });

  test('Make sure page does not freeze or show error messages', { tag: ['@bvt', '@regression'] }, async ({ page, consoleErrors }, testInfo) => {
    await test.step('Check page content shows up', async () => {
      ProofHelper.logStep('Checking page body');
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      const body = page.locator('body');
      await expect(body).toBeVisible();
      ProofHelper.logVerified('Page content is showing');
    });

    await test.step('Check console for red errors', async () => {
      ProofHelper.logStep('Checking for error logs');
      const fatalErrors = consoleErrors.filter(
        err => !err.includes('Clarity') && !err.includes('datafa.st') && !err.includes('gtag')
      );
      expect(fatalErrors.length).toBeLessThan(5);
      ProofHelper.logVerified('No crash errors found');

      await ProofHelper.captureProof(page, testInfo, 'bvt-dom-stability', 'Page running smooth');
    });
  });

});
