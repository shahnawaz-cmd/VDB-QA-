import { test, expect } from '../fixtures/test.fixture';
import { ProofHelper } from '../utils/ProofHelper';

test.describe('Frequently Asked Questions Accordions', () => {

  test('Check FAQ questions expand and collapse on the homepage', { tag: ['@faq', '@home', '@regression'] }, async ({ page }, testInfo) => {
    ProofHelper.logStep('Opening homepage');
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 35000 });

    ProofHelper.logStep('Locating FAQ accordions');
    const faqItems = page.locator('details.rounded-2xl');
    const count = await faqItems.count();
    ProofHelper.logVerified(`Found ${count} FAQ accordion items on homepage`);
    expect(count).toBeGreaterThan(3);

    const firstItem = faqItems.first();
    const summary = firstItem.locator('summary');
    const questionText = (await summary.innerText()).trim();
    ProofHelper.logVerified(`Testing FAQ: "${questionText}"`);

    await summary.scrollIntoViewIfNeeded();
    const isInitiallyOpen = await firstItem.evaluate((el: HTMLElement) => el.hasAttribute('open'));

    ProofHelper.logStep('Clicking question to toggle accordion');
    await summary.click();
    await page.waitForTimeout(400);

    const stateAfterFirstClick = await firstItem.evaluate((el: HTMLElement) => el.hasAttribute('open'));
    expect(stateAfterFirstClick).toBe(!isInitiallyOpen);
    ProofHelper.logVerified(`Accordion toggled cleanly`);

    await ProofHelper.captureProof(page, testInfo, 'faq-homepage-toggled', 'Homepage FAQ accordion toggled');

    ProofHelper.logStep('Clicking question again to return to original state');
    await summary.click();
    await page.waitForTimeout(400);

    const finalState = await firstItem.evaluate((el: HTMLElement) => el.hasAttribute('open'));
    expect(finalState).toBe(isInitiallyOpen);
    ProofHelper.logVerified(`Accordion returned to original state`);
  });

  test('Check FAQ questions expand and collapse on the main API catalog page', { tag: ['@faq', '@catalog', '@regression'] }, async ({ page }, testInfo) => {
    ProofHelper.logStep('Opening /api catalog page');
    await page.goto('/api', { waitUntil: 'domcontentloaded', timeout: 35000 });

    ProofHelper.logStep('Locating FAQ accordions on /api');
    const faqItems = page.locator('details.rounded-2xl');
    const count = await faqItems.count();
    ProofHelper.logVerified(`Found ${count} FAQ accordion items on /api`);
    expect(count).toBeGreaterThan(1);

    const firstItem = faqItems.first();
    const summary = firstItem.locator('summary');
    const questionText = (await summary.innerText()).trim();
    ProofHelper.logVerified(`Testing /api FAQ: "${questionText}"`);

    await summary.scrollIntoViewIfNeeded();
    const isInitiallyOpen = await firstItem.evaluate((el: HTMLElement) => el.hasAttribute('open'));

    ProofHelper.logStep('Clicking question to toggle');
    await summary.click();
    await page.waitForTimeout(400);
    const toggled = await firstItem.evaluate((el: HTMLElement) => el.hasAttribute('open'));
    expect(toggled).toBe(!isInitiallyOpen);
    ProofHelper.logVerified(`Toggled successfully on /api`);

    await ProofHelper.captureProof(page, testInfo, 'faq-api-catalog-toggled', 'API Catalog FAQ accordion toggled');

    ProofHelper.logStep('Clicking question again to toggle back');
    await summary.click();
    await page.waitForTimeout(400);
    const restored = await firstItem.evaluate((el: HTMLElement) => el.hasAttribute('open'));
    expect(restored).toBe(isInitiallyOpen);
    ProofHelper.logVerified(`Restored original state on /api`);
  });

  test('Check FAQ questions expand and collapse on Vehicle Services page', { tag: ['@faq', '@api-services', '@regression'] }, async ({ page }, testInfo) => {
    ProofHelper.logStep('Opening /api/vehicle-services');
    await page.goto('/api/vehicle-services', { waitUntil: 'domcontentloaded', timeout: 35000 });

    const faqItems = page.locator('details.rounded-2xl');
    const count = await faqItems.count();
    expect(count).toBeGreaterThan(0);
    ProofHelper.logVerified(`Found ${count} FAQ accordion items on /api/vehicle-services`);

    const item = faqItems.first();
    const summary = item.locator('summary');
    const qText = (await summary.innerText()).trim();
    ProofHelper.logVerified(`Testing FAQ: "${qText.substring(0, 50)}..."`);

    await summary.scrollIntoViewIfNeeded();
    const initial = await item.evaluate((el: HTMLElement) => el.hasAttribute('open'));

    await summary.click();
    await page.waitForTimeout(400);
    const afterClick = await item.evaluate((el: HTMLElement) => el.hasAttribute('open'));
    expect(afterClick).toBe(!initial);
    ProofHelper.logVerified('FAQ toggled on /api/vehicle-services');

    await ProofHelper.captureProof(page, testInfo, 'faq-vehicle-services-toggled', 'Vehicle services FAQ toggled');

    await summary.click();
    await page.waitForTimeout(400);
    const finalState = await item.evaluate((el: HTMLElement) => el.hasAttribute('open'));
    expect(finalState).toBe(initial);
    ProofHelper.logVerified('FAQ reset cleanly on /api/vehicle-services');
  });

  test('Check FAQ questions expand and collapse on VIN Decoder page', { tag: ['@faq', '@vin-decoder', '@regression'] }, async ({ page }, testInfo) => {
    ProofHelper.logStep('Opening /api/vin-decoder');
    await page.goto('/api/vin-decoder', { waitUntil: 'domcontentloaded', timeout: 35000 });

    const faqItems = page.locator('details.rounded-2xl');
    const count = await faqItems.count();
    expect(count).toBeGreaterThan(0);
    ProofHelper.logVerified(`Found ${count} FAQ accordion items on /api/vin-decoder`);

    const item = faqItems.first();
    const summary = item.locator('summary');
    const qText = (await summary.innerText()).trim();
    ProofHelper.logVerified(`Testing FAQ: "${qText.substring(0, 50)}..."`);

    await summary.scrollIntoViewIfNeeded();
    const initial = await item.evaluate((el: HTMLElement) => el.hasAttribute('open'));

    await summary.click();
    await page.waitForTimeout(400);
    const afterClick = await item.evaluate((el: HTMLElement) => el.hasAttribute('open'));
    expect(afterClick).toBe(!initial);
    ProofHelper.logVerified('FAQ toggled on /api/vin-decoder');

    await ProofHelper.captureProof(page, testInfo, 'faq-vin-decoder-toggled', 'VIN decoder FAQ toggled');

    await summary.click();
    await page.waitForTimeout(400);
    const finalState = await item.evaluate((el: HTMLElement) => el.hasAttribute('open'));
    expect(finalState).toBe(initial);
    ProofHelper.logVerified('FAQ reset cleanly on /api/vin-decoder');
  });

  test('Check FAQ questions expand and collapse on Car Dealerships page', { tag: ['@faq', '@industry', '@regression'] }, async ({ page }, testInfo) => {
    ProofHelper.logStep('Opening /car-dealerships');
    await page.goto('/car-dealerships', { waitUntil: 'domcontentloaded', timeout: 35000 });

    const faqItems = page.locator('details.rounded-2xl');
    const count = await faqItems.count();
    expect(count).toBeGreaterThan(0);
    ProofHelper.logVerified(`Found ${count} FAQ accordion items on /car-dealerships`);

    const item = faqItems.first();
    const summary = item.locator('summary');
    const qText = (await summary.innerText()).trim();
    ProofHelper.logVerified(`Testing FAQ: "${qText.substring(0, 50)}..."`);

    await summary.scrollIntoViewIfNeeded();
    const initial = await item.evaluate((el: HTMLElement) => el.hasAttribute('open'));

    await summary.click();
    await page.waitForTimeout(400);
    const afterClick = await item.evaluate((el: HTMLElement) => el.hasAttribute('open'));
    expect(afterClick).toBe(!initial);
    ProofHelper.logVerified('FAQ toggled on /car-dealerships');

    await ProofHelper.captureProof(page, testInfo, 'faq-car-dealerships-toggled', 'Car dealerships FAQ toggled');

    await summary.click();
    await page.waitForTimeout(400);
    const finalState = await item.evaluate((el: HTMLElement) => el.hasAttribute('open'));
    expect(finalState).toBe(initial);
    ProofHelper.logVerified('FAQ reset cleanly on /car-dealerships');
  });

  test('Check FAQ questions expand and collapse on Downloads page', { tag: ['@faq', '@downloads', '@regression'] }, async ({ page }, testInfo) => {
    ProofHelper.logStep('Opening /downloads');
    await page.goto('/downloads', { waitUntil: 'domcontentloaded', timeout: 35000 });

    const faqItems = page.locator('details.rounded-2xl');
    const count = await faqItems.count();
    expect(count).toBeGreaterThan(0);
    ProofHelper.logVerified(`Found ${count} FAQ accordion items on /downloads`);

    const item = faqItems.first();
    const summary = item.locator('summary');
    const qText = (await summary.innerText()).trim();
    ProofHelper.logVerified(`Testing FAQ: "${qText.substring(0, 50)}..."`);

    await summary.scrollIntoViewIfNeeded();
    const initial = await item.evaluate((el: HTMLElement) => el.hasAttribute('open'));

    await summary.click();
    await page.waitForTimeout(400);
    const afterClick = await item.evaluate((el: HTMLElement) => el.hasAttribute('open'));
    expect(afterClick).toBe(!initial);
    ProofHelper.logVerified('FAQ toggled on /downloads');

    await ProofHelper.captureProof(page, testInfo, 'faq-downloads-toggled', 'Downloads FAQ toggled');

    await summary.click();
    await page.waitForTimeout(400);
    const finalState = await item.evaluate((el: HTMLElement) => el.hasAttribute('open'));
    expect(finalState).toBe(initial);
    ProofHelper.logVerified('FAQ reset cleanly on /downloads');
  });

});
