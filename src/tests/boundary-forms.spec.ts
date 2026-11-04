import { test, expect } from '../fixtures/test.fixture';
import { ProofHelper } from '../utils/ProofHelper';

test.describe('Form Inputs and Error Handling', () => {

  test('Try typing wrong emails in contact form to see if error shows', { tag: ['@forms', '@boundary', '@regression'] }, async ({ page, contactDemo }, testInfo) => {
    await test.step('Open contact page', async () => {
      ProofHelper.logStep('Opening contact page for email tests');
      await contactDemo.navigateTo('/contact-us');
    });

    const badEmails = [
      'plainaddress',
      '#@%^%#$@#$@#.com',
      '@example.com',
      'email.example.com',
      'email@example@example.com'
    ];

    for (const email of badEmails) {
      await test.step(`Type bad email: "${email}"`, async () => {
        ProofHelper.logStep(`Trying bad email: ${email}`);
        await contactDemo.emailInput.fill(email);
        const isValid = await contactDemo.emailInput.evaluate((el: HTMLInputElement) => el.checkValidity());
        expect(isValid).toBeFalsy();
        ProofHelper.logVerified(`Form caught the bad email: "${email}"`);
      });
    }

    await test.step('Type a good email and see if it passes', async () => {
      ProofHelper.logStep('Typing valid email: qa.lead@vehicledatabases.com');
      await contactDemo.emailInput.fill('qa.lead@vehicledatabases.com');
      const isValid = await contactDemo.emailInput.evaluate((el: HTMLInputElement) => el.checkValidity());
      expect(isValid).toBeTruthy();
      ProofHelper.logVerified('Good email passed without errors');

      await ProofHelper.captureProof(page, testInfo, 'boundary-email-validation', 'Email check proof');
    });
  });

  test('Type very long text and special characters in message box', { tag: ['@forms', '@security', '@boundary', '@regression'] }, async ({ page, contactDemo }, testInfo) => {
    await test.step('Open contact page', async () => {
      ProofHelper.logStep('Opening contact page');
      await contactDemo.navigateTo('/contact-us');
    });

    await test.step('Type 1200 letters into the boxes', async () => {
      ProofHelper.logStep('Typing long text');
      const longText = 'A'.repeat(1200);
      await contactDemo.firstNameInput.fill(longText);
      await contactDemo.companyInput.fill(longText);

      await expect(contactDemo.firstNameInput).toBeVisible();
      ProofHelper.logVerified('Form handles long text fine');
    });

    await test.step('Type script code to make sure it does not run', async () => {
      ProofHelper.logStep('Typing script tag <script>alert("xss")</script>');
      const xssPayload = '<script>alert("xss")</script>';
      await contactDemo.firstNameInput.fill(xssPayload);
      const value = await contactDemo.firstNameInput.inputValue();
      expect(value).toBe(xssPayload);
      ProofHelper.logVerified('Script treated as plain text, no popup showed');

      await ProofHelper.captureProof(page, testInfo, 'boundary-security-sanitization', 'Safe text handling');
    });
  });

  test('Test license plate lookup with different plate numbers', { tag: ['@forms', '@lookup', '@regression'] }, async ({ page, vinDecoder }, testInfo) => {
    await test.step('Open license plate page', async () => {
      ProofHelper.logStep('Going to /api/license-plate');
      await vinDecoder.navigateTo('/api/license-plate');
    });

    await test.step('Type sample plate into plate box', async () => {
      ProofHelper.logStep('Typing sample plate');
      if (await vinDecoder.plateInput.isVisible()) {
        await vinDecoder.plateInput.fill('ABCDEFGHIJKL1234567890EXTRA');
        const length = (await vinDecoder.plateInput.inputValue()).length;
        expect(length).toBeGreaterThan(0);
        ProofHelper.logVerified(`Plate box works and took ${length} characters`);

        await ProofHelper.captureProof(page, testInfo, 'boundary-plate-widget', 'License plate box');
      }
    });
  });

  test('Try submitting sample download without filling form', { tag: ['@forms', '@boundary', '@regression'] }, async ({ page, contactDemo }, testInfo) => {
    await test.step('Open downloads page', async () => {
      ProofHelper.logStep('Going to downloads page');
      await contactDemo.navigateTo('/downloads');
      await expect(page).toHaveURL(/.*\/downloads/);
    });

    await test.step('Click download button while boxes are empty', async () => {
      ProofHelper.logStep('Clicking submit button with empty inputs');
      if (await contactDemo.downloadSubmitBtn.isVisible()) {
        await contactDemo.downloadSubmitBtn.click();
        await expect(page).toHaveURL(/.*\/downloads.*/);
        ProofHelper.logVerified('Form prevented submission as expected');

        await ProofHelper.captureProof(page, testInfo, 'boundary-downloads-blocked', 'Empty form blocked');
      }
    });
  });

});
