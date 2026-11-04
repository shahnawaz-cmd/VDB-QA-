import { test, expect } from '../fixtures/test.fixture';
import { ProofHelper } from '../utils/ProofHelper';

test.describe('Check All Frontend Pages Open Fine', () => {

  test('Check all 8 industry pages open fine', { tag: ['@coverage', '@industry', '@regression'] }, async ({ page }) => {
    const industries = [
      { path: '/industry/car-dealerships', name: 'Car Dealerships' },
      { path: '/industry/auto-insurance', name: 'Auto Insurance' },
      { path: '/industry/auto-repair', name: 'Auto Repair' },
      { path: '/industry/car-finance', name: 'Car Finance' },
      { path: '/industry/car-rental', name: 'Car Rental' },
      { path: '/industry/auto-parts', name: 'Auto Parts' },
      { path: '/industry/car-website', name: 'Car Website' },
      { path: '/industry/classifieds-websites', name: 'Classifieds' }
    ];

    for (const ind of industries) {
      await test.step(`Open ${ind.name} page`, async () => {
        ProofHelper.logStep(`Opening ${ind.name} page`);
        const res = await page.goto(ind.path, { waitUntil: 'domcontentloaded' });
        expect(res).not.toBeNull();
        expect(res!.status()).toBe(200);

        const heading = page.locator('h1').first();
        await expect(heading).toBeVisible();
        ProofHelper.logVerified(`${ind.name} page is good`);
      });
    }
  });

  test('Check all 19 automotive API pages open fine', { tag: ['@coverage', '@api', '@regression'] }, async ({ request }) => {
    const apiProducts = [
      '/api/vin-decoder',
      '/api/classic-vin-decoder',
      '/api/license-plate',
      '/api/ocr',
      '/api/auction-history',
      '/api/sales-history',
      '/api/stolen-vehicle',
      '/api/vin-title-check',
      '/api/motorcycle-data',
      '/api/vehicle-specifications',
      '/api/vehicle-market-value',
      '/api/vehicle-services',
      '/api/window-sticker',
      '/api/repair-pricing',
      '/api/vehicle-maintenance',
      '/api/vehicle-recalls',
      '/api/vehicle-warranty',
      '/api/owner-manual',
      '/api/electric-vehicle-specifications'
    ];

    for (const productPath of apiProducts) {
      await test.step(`Check ${productPath}`, async () => {
        ProofHelper.logStep(`Checking ${productPath}`);
        const res = await request.get(productPath);
        expect(res.status()).toBe(200);
        const text = await res.text();
        expect(text.length).toBeGreaterThan(500);
        ProofHelper.logVerified(`${productPath} is online`);
      });
    }
  });

  test('Check about us, articles, and terms pages', { tag: ['@coverage', '@legal', '@company', '@regression'] }, async ({ page }, testInfo) => {
    const companyPages = [
      { path: '/about-us', name: 'About Us' },
      { path: '/case-studies', name: 'Case Studies' },
      { path: '/case-studies/detailed-vehicle-history', name: 'Vehicle History Case Study' },
      { path: '/automotive-research', name: 'Automotive Research' },
      { path: '/auction-platform', name: 'Auction Platform' },
      { path: '/articles', name: 'Articles' },
      { path: '/privacy-policy', name: 'Privacy Policy' },
      { path: '/terms-and-conditions', name: 'Terms and Conditions' },
      { path: '/downloads/request', name: 'Download Request' }
    ];

    for (const cp of companyPages) {
      await test.step(`Open ${cp.name}`, async () => {
        ProofHelper.logStep(`Checking ${cp.name}`);
        const res = await page.goto(cp.path, { waitUntil: 'domcontentloaded' });
        expect(res).not.toBeNull();
        expect(res!.status()).toBe(200);

        const body = page.locator('body');
        await expect(body).toBeVisible();
        ProofHelper.logVerified(`${cp.name} is online`);
      });
    }

    await ProofHelper.captureProof(page, testInfo, 'coverage-company-legal', 'Company pages check');
  });

  test('Check documentation guide pages', { tag: ['@coverage', '@docs', '@regression'] }, async ({ page }) => {
    const docPaths = [
      '/docs',
      '/docs/api-architecture',
      '/docs/api-architecture/requests',
      '/docs/api-architecture/responses'
    ];

    for (const doc of docPaths) {
      await test.step(`Open doc page: ${doc}`, async () => {
        ProofHelper.logStep(`Checking ${doc}`);
        const res = await page.goto(doc, { waitUntil: 'domcontentloaded' });
        expect(res).not.toBeNull();
        expect(res!.status()).toBe(200);

        const heading = page.locator('h1, h2').first();
        await expect(heading).toBeVisible();
        ProofHelper.logVerified(`Doc page ${doc} is good`);
      });
    }
  });

});
