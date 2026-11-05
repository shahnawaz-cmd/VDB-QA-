import { test, expect } from '@playwright/test';
import { ProofHelper } from '../utils/ProofHelper';

test.describe('Multilingual Translation and Language Switcher Verification', () => {
  const translatedEndpoints = [
    { name: 'Auto Parts Industry', path: '/industry/auto-parts' },
    { name: 'VIN Decoder API', path: '/api/vin-decoder' },
    { name: 'Vehicle Specifications API', path: '/api/vehicle-specifications' },
    { name: 'Vehicle Market Value API', path: '/api/vehicle-market-value' },
    { name: 'Vehicle Maintenance API', path: '/api/vehicle-maintenance' },
    { name: 'Vehicle History API', path: '/api/vehicle-history' },
    { name: 'APIs Main Catalog', path: '/api' },
    { name: 'License Plate API', path: '/api/license-plate' },
    { name: 'Repair Pricing API', path: '/api/repair-pricing' },
  ];

  const all18ScreenshotPaths = [
    { path: '/fr/industry/auto-parts', lang: 'fr', titleSubstring: 'pièces automobiles' },
    { path: '/fr/api/vin-decoder', lang: 'fr', titleSubstring: 'décodage VIN' },
    { path: '/fr/api/vehicle-specifications', lang: 'fr', titleSubstring: 'Vehicle Specifications' },
    { path: '/fr/api/vehicle-market-value', lang: 'fr', titleSubstring: 'Vehicle Market Value' },
    { path: '/fr/api/vehicle-maintenance', lang: 'fr', titleSubstring: 'Vehicle Maintenance' },
    { path: '/fr/api/vehicle-history', lang: 'fr', titleSubstring: 'Vehicle History' },
    { path: '/fr/api', lang: 'fr', titleSubstring: 'Explorez toutes les API' },
    { path: '/fr/api/license-plate', lang: 'fr', titleSubstring: 'License Plate' },
    { path: '/fr/api/repair-pricing', lang: 'fr', titleSubstring: 'Repair Pricing' },
    { path: '/es/api/vin-decoder', lang: 'es', titleSubstring: 'decodificación de VIN' },
    { path: '/es/api/vehicle-specifications', lang: 'es', titleSubstring: 'Vehicle Specifications' },
    { path: '/es/industry/auto-parts', lang: 'es', titleSubstring: 'autopartes' },
    { path: '/es/api/vehicle-market-value', lang: 'es', titleSubstring: 'Vehicle Market Value' },
    { path: '/es/api/repair-pricing', lang: 'es', titleSubstring: 'Repair Pricing' },
    { path: '/es/api/vehicle-history', lang: 'es', titleSubstring: 'Vehicle History' },
    { path: '/es/api/vehicle-maintenance', lang: 'es', titleSubstring: 'Vehicle Maintenance' },
    { path: '/es/api/license-plate', lang: 'es', titleSubstring: 'License Plate' },
    { path: '/es/api', lang: 'es', titleSubstring: 'Explore todas las API' },
  ];

  test('Verify language switcher dropdown appears with English, French, and Spanish on all 9 translated pages', { tag: ['@translation', '@i18n', '@regression'] }, async ({ page }, testInfo) => {
    for (const ep of translatedEndpoints) {
      ProofHelper.logStep(`Checking language switcher on ${ep.name} (${ep.path})`);
      await page.goto(ep.path, { waitUntil: 'domcontentloaded', timeout: 35000 });
      await page.waitForTimeout(800);

      const switcher = page.locator('header details[data-language-switcher="true"]').first();
      await expect(switcher).toBeVisible();

      const summaryText = await switcher.locator('summary').innerText();
      expect(summaryText.toLowerCase()).toContain('en');

      // Check available translation links inside the dropdown
      const frOption = switcher.locator(`a[href*="/fr${ep.path}"]`).first();
      const esOption = switcher.locator(`a[href*="/es${ep.path}"]`).first();
      await expect(frOption).toBeAttached();
      await expect(esOption).toBeAttached();

      ProofHelper.logVerified(`${ep.name} has active language switcher with French and Spanish options`);
    }

    await ProofHelper.captureProof(page, testInfo, 'translation-dropdown-active', 'Active language switcher on translated page');
  });

  test('Verify switching language between English, French, and Spanish updates URL and page content', { tag: ['@translation', '@i18n', '@interactive', '@regression'] }, async ({ page }, testInfo) => {
    ProofHelper.logStep('Opening Auto Parts industry page in default English');
    await page.goto('/industry/auto-parts', { waitUntil: 'domcontentloaded', timeout: 35000 });
    await page.waitForTimeout(1000);

    const switcher = page.locator('header details[data-language-switcher="true"]').first();
    const summary = switcher.locator('summary');
    await expect(summary).toBeVisible();

    // Switch to French
    ProofHelper.logStep('Clicking language dropdown and selecting French (Français)');
    await summary.click();
    await page.waitForTimeout(400);

    const frLink = switcher.locator('a[href="/fr/industry/auto-parts"]').first();
    await expect(frLink).toBeVisible();
    await Promise.all([
      page.waitForURL(/.*\/fr\/industry\/auto-parts.*/, { timeout: 30000, waitUntil: 'domcontentloaded' }),
      frLink.click(),
    ]);

    expect(page.url()).toContain('/fr/industry/auto-parts');
    const frHeading = await page.locator('h1').first().innerText();
    expect(frHeading.toLowerCase()).toContain('pièces automobiles');
    ProofHelper.logVerified(`Successfully switched to French: "${frHeading.substring(0, 45)}..."`);
    await ProofHelper.captureProof(page, testInfo, 'translation-french-auto-parts', 'French Auto Parts page loaded');

    // Switch from French to Spanish
    ProofHelper.logStep('Clicking language dropdown and selecting Spanish (Español)');
    const frSwitcher = page.locator('header details[data-language-switcher="true"]').first();
    await frSwitcher.locator('summary').click();
    await page.waitForTimeout(400);

    const esLink = frSwitcher.locator('a[href="/es/industry/auto-parts"]').first();
    await expect(esLink).toBeVisible();
    await Promise.all([
      page.waitForURL(/.*\/es\/industry\/auto-parts.*/, { timeout: 30000, waitUntil: 'domcontentloaded' }),
      esLink.click(),
    ]);

    expect(page.url()).toContain('/es/industry/auto-parts');
    const esHeading = await page.locator('h1').first().innerText();
    expect(esHeading.toLowerCase()).toContain('autopartes');
    ProofHelper.logVerified(`Successfully switched to Spanish: "${esHeading.substring(0, 45)}..."`);
    await ProofHelper.captureProof(page, testInfo, 'translation-spanish-auto-parts', 'Spanish Auto Parts page loaded');
  });

  test('Verify all 18 French and Spanish translated pages from screenshot load with status 200 and correct content', { tag: ['@translation', '@coverage', '@sitemap', '@regression'] }, async ({ request }) => {
    for (const item of all18ScreenshotPaths) {
      ProofHelper.logStep(`Checking status 200 for ${item.path}`);
      const res = await request.get(item.path);
      expect(res.status()).toBe(200);

      const html = await res.text();
      expect(html.toLowerCase()).toContain(item.titleSubstring.toLowerCase());
      ProofHelper.logVerified(`Page ${item.path} returned status 200 and matches translated title`);
    }
  });

  test('Verify language dropdown selector does not offer language options on non-translated pages', { tag: ['@translation', '@negative', '@regression'] }, async ({ page }, testInfo) => {
    const nonTranslatedPages = [
      '/',
      '/downloads',
      '/contact-us',
      '/industry/car-dealerships',
      '/docs',
    ];

    for (const path of nonTranslatedPages) {
      ProofHelper.logStep(`Verifying language switcher options are absent on ${path}`);
      await page.goto(path, { waitUntil: 'domcontentloaded', timeout: 35000 });
      await page.waitForTimeout(800);

      const multiLangOptionsCount = await page.evaluate(() => {
        const switcher = document.querySelector('header details[data-language-switcher="true"]');
        if (!switcher) return 0;
        const options = switcher.querySelectorAll('a[href*="/fr/"], a[href*="/es/"]');
        return options.length;
      });

      expect(multiLangOptionsCount).toBe(0);
      ProofHelper.logVerified(`Language options (FR/ES) correctly absent on ${path}`);
    }

    await ProofHelper.captureProof(page, testInfo, 'translation-absent-non-translated', 'Non-translated pages have no language options');
  });

  test('Verify SEO alternate hreflang tags on multilingual pages', { tag: ['@translation', '@seo', '@regression'] }, async ({ request }) => {
    ProofHelper.logStep('Auditing hreflang tags on /industry/auto-parts');
    const res = await request.get('/industry/auto-parts');
    expect(res.status()).toBe(200);

    const html = await res.text();
    expect(html).toContain('rel="alternate" hrefLang="en"');
    expect(html).toContain('rel="alternate" hrefLang="fr"');
    expect(html).toContain('rel="alternate" hrefLang="es"');
    expect(html).toContain('rel="alternate" hrefLang="x-default"');
    ProofHelper.logVerified('All 4 hreflang alternate links (en, fr, es, x-default) verified');
  });
});
