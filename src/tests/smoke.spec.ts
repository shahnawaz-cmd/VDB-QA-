import { test, expect } from '../fixtures/test.fixture';
import { ProofHelper } from '../utils/ProofHelper';

test.describe('Important User Features Checks', () => {

  test('Test top menu links and login buttons', { tag: ['@smoke', '@sanity', '@regression'] }, async ({ page, headerFooter }, testInfo) => {
    await test.step('Make sure top menu bar and logo are visible', async () => {
      ProofHelper.logStep('Looking at top menu bar and logo');
      await headerFooter.navigateTo('/');
      await expect(headerFooter.navHeader).toBeVisible();
      await expect(headerFooter.logo).toBeVisible();
      ProofHelper.logVerified('Top menu and logo are showing');
    });

    await test.step('Check Login and Free Trial button links', async () => {
      ProofHelper.logStep('Checking where Login and Free Trial buttons point');
      await expect(headerFooter.clientLoginBtn).toBeVisible();
      await expect(headerFooter.freeTrialBtn).toBeVisible();

      const loginHref = await headerFooter.clientLoginBtn.getAttribute('href');
      const trialHref = await headerFooter.freeTrialBtn.getAttribute('href');
      expect(loginHref).toContain('/portal/login');
      expect(trialHref).toContain('/portal/signup');
      ProofHelper.logVerified('Buttons link to login and signup pages');

      await ProofHelper.captureProof(page, testInfo, 'smoke-header-navigation', 'Top menu check');
    });

    await test.step('Click Docs link and check it opens', async () => {
      ProofHelper.logStep('Clicking Docs link');
      await headerFooter.openDocs();
      await expect(page).toHaveURL(/.*\/docs.*/, { timeout: 15000 });
      ProofHelper.logVerified('Docs page opened fine');
    });
  });

  test('Check footer links, phone number and social icons', { tag: ['@smoke', '@regression'] }, async ({ page, headerFooter }, testInfo) => {
    await test.step('Scroll down to footer', async () => {
      ProofHelper.logStep('Scrolling to bottom of page');
      await headerFooter.navigateTo('/');
      await headerFooter.scrollToElement(headerFooter.footer);
      await expect(headerFooter.footer).toBeVisible();
      ProofHelper.logVerified('Footer is visible');
    });

    await test.step('Check Privacy and Terms links exist', async () => {
      ProofHelper.logStep('Checking legal links');
      await expect(headerFooter.privacyPolicyLink.first()).toBeVisible();
      await expect(headerFooter.termsConditionsLink.first()).toBeVisible();
      ProofHelper.logVerified('Privacy Policy and Terms links are visible');
    });

    await test.step('Check phone number and WhatsApp chat buttons', async () => {
      ProofHelper.logStep('Checking contact buttons');
      const hasPhone = await headerFooter.phoneLink.isVisible();
      const hasWhatsapp = await headerFooter.whatsappLink.isVisible();
      expect(hasPhone || hasWhatsapp).toBeTruthy();
      ProofHelper.logVerified('Phone or WhatsApp contact option is available');

      await ProofHelper.captureProof(page, testInfo, 'smoke-footer-links', 'Footer check');
    });
  });

  test('Check contact us form inputs and send button', { tag: ['@smoke', '@forms', '@regression'] }, async ({ page, contactDemo }, testInfo) => {
    await test.step('Open Contact page', async () => {
      ProofHelper.logStep('Going to Contact page');
      await contactDemo.navigateTo('/contact-us');
      await expect(page).toHaveURL(/.*\/contact-us/);
      ProofHelper.logVerified('Contact page opened');
    });

    await test.step('Check all form boxes are showing on screen', async () => {
      ProofHelper.logStep('Checking input boxes');
      await expect(contactDemo.firstNameInput).toBeVisible();
      await expect(contactDemo.lastNameInput).toBeVisible();
      await expect(contactDemo.emailInput).toBeVisible();
      await expect(contactDemo.phoneInput).toBeVisible();
      await expect(contactDemo.companyInput).toBeVisible();
      await expect(contactDemo.submitButton).toBeVisible();
      ProofHelper.logVerified('All boxes and submit button are showing');

      await ProofHelper.captureProof(page, testInfo, 'smoke-contact-form-rendered', 'Contact form inputs');
    });
  });

  test('Search for a keyword in documentation', { tag: ['@smoke', '@docs', '@regression'] }, async ({ page, docsPage }, testInfo) => {
    await test.step('Open Docs page', async () => {
      ProofHelper.logStep('Opening Docs page');
      await docsPage.navigateTo('/docs');
      await expect(page).toHaveURL(/.*\/docs/);
      ProofHelper.logVerified('Docs page opened');
    });

    await test.step('Type vin in search box', async () => {
      ProofHelper.logStep('Typing in search box');
      await expect(docsPage.searchInput).toBeVisible();
      await docsPage.searchDocs('vin');
      await expect(docsPage.searchInput).toHaveValue('vin');
      ProofHelper.logVerified('Search box takes the text');

      await ProofHelper.captureProof(page, testInfo, 'smoke-docs-search', 'Docs search box');
    });
  });

});
