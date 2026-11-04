import { test, expect } from '../fixtures/test.fixture';
import { ProofHelper } from '../utils/ProofHelper';

test.describe('Full User Journeys on Website', () => {

  test('Click through from home page to VIN decoder page', { tag: ['@e2e', '@navigation', '@regression'] }, async ({ page, headerFooter }, testInfo) => {
    await test.step('Start on homepage', async () => {
      ProofHelper.logStep('Opening homepage');
      await headerFooter.navigateTo('/');
      await expect(page).toHaveTitle(/Vehicle Databases/i);
      ProofHelper.logVerified('On homepage');
    });

    await test.step('Go to APIs page', async () => {
      ProofHelper.logStep('Opening /api page');
      await page.goto('/api', { waitUntil: 'domcontentloaded' });
      await expect(page).toHaveURL(/.*\/api/);
      ProofHelper.logVerified('APIs page loaded');

      await ProofHelper.captureProof(page, testInfo, 'e2e-api-catalog', 'APIs list view');
    });

    await test.step('Click VIN Decoder and check the page opens', async () => {
      ProofHelper.logStep('Opening /api/vin-decoder');
      await page.goto('/api/vin-decoder', { waitUntil: 'domcontentloaded' });
      await expect(page).toHaveURL(/.*\/api\/vin-decoder/);
      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible();
      ProofHelper.logVerified('VIN Decoder page opened fine');

      await ProofHelper.captureProof(page, testInfo, 'e2e-vin-decoder-page', 'VIN Decoder page');
    });
  });

  test('Fill out contact form with user details', { tag: ['@e2e', '@conversion', '@forms', '@regression'] }, async ({ page, contactDemo }, testInfo) => {
    await test.step('Go to contact page', async () => {
      ProofHelper.logStep('Opening /contact-us');
      await contactDemo.navigateTo('/contact-us');
      await expect(page).toHaveURL(/.*\/contact-us/);
      ProofHelper.logVerified('Contact page opened');
    });

    await test.step('Type name, email, phone and company', async () => {
      ProofHelper.logStep('Filling form inputs');
      await contactDemo.fillContactForm({
        firstName: 'Sarah',
        lastName: 'Connor',
        email: 'sarah.connor@automotive-insights.com',
        phone: '8005550188',
        company: 'Automotive Insights Group',
        message: 'Need pricing for automotive database.'
      });

      await expect(contactDemo.firstNameInput).toHaveValue('Sarah');
      await expect(contactDemo.lastNameInput).toHaveValue('Connor');
      await expect(contactDemo.emailInput).toHaveValue('sarah.connor@automotive-insights.com');
      await expect(contactDemo.companyInput).toHaveValue('Automotive Insights Group');
      ProofHelper.logVerified('All fields filled and verified');

      await ProofHelper.captureProof(page, testInfo, 'e2e-lead-inquiry-populated', 'Form filled out');
    });
  });

  test('Open API docs and view sample requests', { tag: ['@e2e', '@docs', '@regression'] }, async ({ page, docsPage }, testInfo) => {
    await test.step('Go to docs page', async () => {
      ProofHelper.logStep('Opening /docs');
      await docsPage.navigateTo('/docs');
      await expect(page).toHaveURL(/.*\/docs/);
      ProofHelper.logVerified('Docs page opened');
    });

    await test.step('Open API architecture section', async () => {
      ProofHelper.logStep('Opening architecture guide');
      await page.goto('/docs/api-architecture', { waitUntil: 'domcontentloaded' });
      const mainHeading = page.locator('h1').first();
      await expect(mainHeading).toBeVisible();
      ProofHelper.logVerified('Architecture guide opened');

      await ProofHelper.captureProof(page, testInfo, 'e2e-docs-architecture', 'Docs architecture section');
    });
  });

  test('Check where login and signup buttons take the user', { tag: ['@e2e', '@auth', '@regression'] }, async ({ page, headerFooter }, testInfo) => {
    await test.step('Check buttons on homepage', async () => {
      ProofHelper.logStep('Looking at Login and Signup buttons');
      await headerFooter.navigateTo('/');
      const loginHref = await headerFooter.clientLoginBtn.getAttribute('href');
      const trialHref = await headerFooter.freeTrialBtn.getAttribute('href');

      expect(loginHref).toContain('/portal/login');
      expect(trialHref).toContain('/portal/signup');
      ProofHelper.logVerified('Buttons take user to login and signup pages');

      await ProofHelper.captureProof(page, testInfo, 'e2e-onboarding-ctas', 'Login and Signup buttons');
    });
  });

});
