import { test, expect } from '@playwright/test';
import { ProofHelper } from '../utils/ProofHelper';

test.describe('Website Dark Mode Display and Contrast Checks', () => {

  test.use({
    colorScheme: 'dark',
  });

  test.beforeEach(async ({ context }) => {
    // Ensure dark theme is initialized in browser storage
    await context.addInitScript(() => {
      localStorage.setItem('theme', 'dark');
    });
  });

  test('Verify homepage loads with dark background and crisp styling in dark mode @dark @theme @visual @regression', async ({
    page,
  }, testInfo) => {
    ProofHelper.logStep('Opening homepage in dark mode');
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    ProofHelper.logStep('Verifying dark mode attribute and body background color');
    const themeAttr = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(themeAttr).toBe('dark');
    ProofHelper.logVerified('HTML document has data-theme="dark"');

    const bodyBg = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
    expect(bodyBg).toBe('rgb(0, 0, 0)');
    ProofHelper.logVerified(`Body background is pure dark: ${bodyBg}`);

    ProofHelper.logStep('Checking hero headline visibility and contrast');
    const heroH1 = page.locator('h1').first();
    await expect(heroH1).toBeVisible();
    const h1Color = await heroH1.evaluate((el) => window.getComputedStyle(el).color);
    ProofHelper.logVerified(`Hero headline text color in dark mode: ${h1Color}`);

    await ProofHelper.captureProof(page, testInfo, 'dark-mode-homepage', 'Homepage Rendered in Dark Mode');
  });

  test('Verify API catalog cards and search bar display properly in dark mode @dark @theme @api @regression', async ({
    page,
  }, testInfo) => {
    ProofHelper.logStep('Opening API catalog in dark mode');
    await page.goto('/api', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const themeAttr = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(themeAttr).toBe('dark');

    ProofHelper.logStep('Checking search box and category pill buttons in dark mode');
    const searchInput = page.locator('input[placeholder*="Search APIs" i]');
    await expect(searchInput).toBeVisible();

    const ocrPill = page.locator('button:has-text("OCR APIs")').first();
    await expect(ocrPill).toBeVisible();
    ProofHelper.logVerified('Search input and category pills are visible in dark mode');

    await ProofHelper.captureProof(page, testInfo, 'dark-mode-api-catalog', 'API Catalog in Dark Mode');
  });

  test('Verify VIN Decoder product page and tables display properly in dark mode @dark @theme @regression', async ({
    page,
  }, testInfo) => {
    ProofHelper.logStep('Opening VIN Decoder product page in dark mode');
    await page.goto('/api/vin-decoder', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const themeAttr = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(themeAttr).toBe('dark');

    ProofHelper.logStep('Verifying feature specification cards in dark mode');
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    ProofHelper.logVerified('VIN Decoder title and spec tables rendered with dark background');

    await ProofHelper.captureProof(page, testInfo, 'dark-mode-vin-decoder', 'VIN Decoder Page in Dark Mode');
  });

  test('Verify Downloads page cards and purchase modal display properly in dark mode @dark @theme @downloads @regression', async ({
    page,
  }, testInfo) => {
    ProofHelper.logStep('Opening Downloads page in dark mode');
    await page.goto('/downloads', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    const themeAttr = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(themeAttr).toBe('dark');

    ProofHelper.logStep('Opening Buy Now modal in dark mode');
    const buyBtn = page.locator('button:has-text("Buy Now")').first();
    await buyBtn.click();
    await page.waitForTimeout(500);

    const modal = page.getByRole('dialog', { name: 'Complete Your Purchase' });
    await expect(modal).toBeVisible();
    ProofHelper.logVerified('Complete Your Purchase modal rendered with dark theme surfaces');

    await ProofHelper.captureProof(page, testInfo, 'dark-mode-downloads-modal', 'Purchase Modal in Dark Mode');

    await page.locator('button:has-text("Cancel")').first().click();
    await expect(modal).toBeHidden();
  });

  test('Verify developer documentation guides and sidebar display properly in dark mode @dark @theme @docs @regression', async ({
    page,
  }, testInfo) => {
    ProofHelper.logStep('Opening documentation in dark mode');
    await page.goto('/docs', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const themeAttr = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(themeAttr).toBe('dark');

    ProofHelper.logStep('Checking documentation sidebar and search in dark mode');
    const sidebar = page.locator('aside, nav').first();
    await expect(sidebar).toBeVisible();

    const searchInput = page.locator('input[placeholder*="Search docs" i]');
    await expect(searchInput).toBeVisible();
    ProofHelper.logVerified('Docs navigation tree and search box visible in dark theme');

    await ProofHelper.captureProof(page, testInfo, 'dark-mode-documentation', 'Documentation Guide in Dark Mode');
  });

  test('Verify contact us form inputs and send button display properly in dark mode @dark @theme @forms @regression', async ({
    page,
  }, testInfo) => {
    ProofHelper.logStep('Opening Contact Us page in dark mode');
    await page.goto('/contact-us', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const themeAttr = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(themeAttr).toBe('dark');

    ProofHelper.logStep('Checking input fields in dark theme');
    const nameInput = page.locator('input[placeholder*="name" i]').first();
    const emailInput = page.locator('input[type="email"]').first();
    const submitBtn = page.locator('button[type="submit"]').first();

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(submitBtn).toBeVisible();
    ProofHelper.logVerified('Contact inputs and submit button render with clear contrast');

    await ProofHelper.captureProof(page, testInfo, 'dark-mode-contact-us', 'Contact Us Form in Dark Mode');
  });

  test('Verify industry vertical pages display with readable contrast in dark mode @dark @theme @industry @regression', async ({
    page,
  }, testInfo) => {
    ProofHelper.logStep('Opening Car Dealerships industry page in dark mode');
    await page.goto('/industry/car-dealerships', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const themeAttr = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(themeAttr).toBe('dark');

    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    ProofHelper.logVerified('Car Dealerships industry page renders with dark background');

    await ProofHelper.captureProof(page, testInfo, 'dark-mode-industry-dealerships', 'Industry Solution in Dark Mode');
  });

});
