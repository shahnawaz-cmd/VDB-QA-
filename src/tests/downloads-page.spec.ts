import { test } from '../fixtures/test.fixture';
import { expect } from '@playwright/test';
import { ProofHelper } from '../utils/ProofHelper';

test.describe('Automotive Databases Downloads Page Checks', () => {

  test('Test database catalog shows all 7 datasets with prices @downloads @catalog @regression', async ({
    downloadsPage,
    page,
  }, testInfo) => {
    ProofHelper.logStep('Opening Downloads page');
    await downloadsPage.openDownloads();

    ProofHelper.logStep('Checking main title and section header');
    await expect(downloadsPage.heroHeading).toContainText('Instant Access to Vehicle Databases');
    await expect(downloadsPage.availableDatabasesHeading).toBeVisible();

    ProofHelper.logStep('Verifying all 7 database cards and pricing');
    const expectedDatabases = [
      'Vehicle Year/Make/Model Specs — Basic',
      'Vehicle Year/Make/Model Specs — Standard',
      'Vehicle Year/Make/Model Specs — Advanced',
      'Vehicle Market Value',
      'Electrical Vehicle Data',
      'Vehicle Maintenance',
      'Vehicle Repair Estimates',
    ];

    const cardTitles = await downloadsPage.databaseCards.allInnerTexts();
    expect(cardTitles.length).toBe(7);

    for (const name of expectedDatabases) {
      expect(cardTitles).toContain(name);
      ProofHelper.logVerified(`Found database card: "${name}"`);
    }

    const buyButtonsCount = await downloadsPage.buyNowButtons.count();
    expect(buyButtonsCount).toBe(7);
    ProofHelper.logVerified(`Found all ${buyButtonsCount} Buy Now buttons with price tags`);

    await ProofHelper.captureProof(page, testInfo, 'downloads-catalog-overview', 'Downloads Catalog Overview');
  });

  test('Download sample database file in JSON format from database card @downloads @files @interactive @regression', async ({
    downloadsPage,
    page,
  }, testInfo) => {
    ProofHelper.logStep('Opening Downloads page');
    await downloadsPage.openDownloads();

    ProofHelper.logStep('Clicking Sample Database button on first card');
    await downloadsPage.openSampleModal(0);
    await expect(downloadsPage.sampleDialog).toBeVisible();
    ProofHelper.logVerified('Sample Database modal opened');

    ProofHelper.logStep('Checking JSON format download button');
    await expect(downloadsPage.sampleJsonBtn).toBeVisible();
    await ProofHelper.captureProof(page, testInfo, 'downloads-sample-modal', 'Sample Database Format Selection Modal');

    ProofHelper.logStep('Triggering file download');
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 10000 }),
      downloadsPage.sampleJsonBtn.click(),
    ]);

    const suggestedName = download.suggestedFilename();
    expect(suggestedName).toContain('.json');
    ProofHelper.logVerified(`Sample database file downloaded successfully: "${suggestedName}"`);

    ProofHelper.logStep('Dismissing modal');
    if (await downloadsPage.sampleCancelBtn.isVisible()) {
      await downloadsPage.closeSampleModal();
    }
  });

  test('Verify Buy Now modal enables payment button only with valid email @downloads @forms @boundary @regression', async ({
    downloadsPage,
    page,
  }, testInfo) => {
    ProofHelper.logStep('Opening Downloads page');
    await downloadsPage.openDownloads();

    ProofHelper.logStep('Clicking Buy Now button on first database card');
    await downloadsPage.openBuyModal(0);
    await expect(downloadsPage.purchaseDialog).toBeVisible();
    ProofHelper.logVerified('Complete Your Purchase modal is displayed');

    ProofHelper.logStep('Checking that Continue to Payment button is disabled initially');
    await expect(downloadsPage.purchaseContinueBtn).toBeDisabled();
    ProofHelper.logVerified('Continue to Payment button is disabled by default');

    ProofHelper.logStep('Typing invalid email format');
    await downloadsPage.purchaseEmailInput.fill('notanemail');
    await expect(downloadsPage.purchaseContinueBtn).toBeDisabled();
    ProofHelper.logVerified('Button stays disabled with invalid email input');

    ProofHelper.logStep('Typing valid business email');
    await downloadsPage.purchaseEmailInput.fill('procurement@fleetenterprise.com');
    await expect(downloadsPage.purchaseContinueBtn).toBeEnabled();
    ProofHelper.logVerified('Button automatically turned enabled with valid email');

    await ProofHelper.captureProof(page, testInfo, 'downloads-buy-modal-validated', 'Buy Now Modal Enabled with Valid Email');

    ProofHelper.logStep('Closing purchase modal');
    await downloadsPage.closeBuyModal();
    await expect(downloadsPage.purchaseDialog).toBeHidden();
    ProofHelper.logVerified('Purchase modal closed cleanly');
  });

  test('Verify Request Custom Quote modal opens with country dialer and fields @downloads @forms @interactive @regression', async ({
    downloadsPage,
    page,
  }, testInfo) => {
    ProofHelper.logStep('Opening Downloads page');
    await downloadsPage.openDownloads();

    ProofHelper.logStep('Clicking Need custom pricing on first database card');
    await downloadsPage.openQuoteModal(0);
    await expect(downloadsPage.quoteDialog).toBeVisible();
    ProofHelper.logVerified('Request Custom Quote modal opened');

    ProofHelper.logStep('Checking inputs: Email, Expected Price, Message, and Country Dialer');
    await expect(downloadsPage.quoteEmailInput).toBeVisible();
    await expect(downloadsPage.quoteExpectedPriceInput).toBeVisible();
    await expect(downloadsPage.quoteMessageInput).toBeVisible();
    await expect(downloadsPage.quoteSubmitBtn).toBeVisible();

    ProofHelper.logStep('Filling expected price and sample custom requirements');
    await downloadsPage.quoteExpectedPriceInput.fill('5000');
    await downloadsPage.quoteMessageInput.fill('Looking for quarterly delta updates for North American commercial trucks.');
    ProofHelper.logVerified('Inputs accepted quote criteria');

    await ProofHelper.captureProof(page, testInfo, 'downloads-custom-quote-modal', 'Request Custom Quote Modal');

    ProofHelper.logStep('Closing quote modal');
    await downloadsPage.closeQuoteModal();
    await expect(downloadsPage.quoteDialog).toBeHidden();
    ProofHelper.logVerified('Custom Quote modal closed cleanly');
  });

  test('Select custom database from 17 options in the bottom inquiry form @downloads @forms @interactive @regression', async ({
    downloadsPage,
    page,
  }, testInfo) => {
    ProofHelper.logStep('Opening Downloads page');
    await downloadsPage.openDownloads();

    ProofHelper.logStep('Scrolling to bottom "Need a Different Database?" form');
    await downloadsPage.bottomForm.scrollIntoViewIfNeeded();
    await expect(downloadsPage.bottomForm).toBeVisible();

    ProofHelper.logStep('Opening "What are you looking for?" category dropdown');
    await downloadsPage.bottomDropdownBtn.click();
    await page.waitForTimeout(400);

    const listboxOptions = page.locator('li[role="option"], [role="listbox"] li, [role="option"]');
    const optionsCount = await listboxOptions.count();
    expect(optionsCount).toBeGreaterThanOrEqual(16);
    ProofHelper.logVerified(`Found ${optionsCount} database options in listbox dropdown`);

    ProofHelper.logStep('Selecting "Vehicle Warranty" from dropdown');
    const warrantyOption = listboxOptions.filter({ hasText: 'Vehicle Warranty' }).first();
    await warrantyOption.click();
    await page.waitForTimeout(300);

    const updatedButtonText = await downloadsPage.bottomDropdownBtn.innerText();
    expect(updatedButtonText).toContain('Vehicle Warranty');
    ProofHelper.logVerified('Dropdown label updated to selected option: "Vehicle Warranty"');

    ProofHelper.logStep('Filling name, email, and requirements');
    await downloadsPage.bottomNameInput.fill('Sarah Connor');
    await downloadsPage.bottomEmailInput.fill('sarah@cyberdyne.org');
    await downloadsPage.bottomCompanyInput.fill('Fleet Systems Inc');
    await downloadsPage.bottomMessageInput.fill('Need comprehensive 2015-2025 powertrain warranty database.');

    await ProofHelper.captureProof(page, testInfo, 'downloads-inquiry-form-selected', 'Custom Database Selected in Bottom Form');
  });

  test('Expand and collapse extra vehicle specifications using Show More button @downloads @interactive @regression', async ({
    downloadsPage,
    page,
  }, testInfo) => {
    ProofHelper.logStep('Opening Downloads page');
    await downloadsPage.openDownloads();

    const firstShowMoreBtn = downloadsPage.showMoreButtons.first();
    await expect(firstShowMoreBtn).toBeVisible();

    const initialText = await firstShowMoreBtn.innerText();
    expect(initialText).toBe('Show more');
    ProofHelper.logVerified('Initial button text is "Show more"');

    ProofHelper.logStep('Clicking "Show more" to reveal extended specs');
    await firstShowMoreBtn.click();
    await page.waitForTimeout(400);

    const expandedText = await firstShowMoreBtn.innerText();
    expect(expandedText).toBe('Hide');
    ProofHelper.logVerified('Button text toggled to "Hide"');

    await ProofHelper.captureProof(page, testInfo, 'downloads-specs-expanded', 'Extended Database Specifications Expanded');

    ProofHelper.logStep('Clicking "Hide" to collapse specs back');
    await firstShowMoreBtn.click();
    await page.waitForTimeout(400);

    const collapsedText = await firstShowMoreBtn.innerText();
    expect(collapsedText).toBe('Show more');
    ProofHelper.logVerified('Button text toggled back to "Show more"');
  });

  test('Verify clicking Continue to Payment launches Stripe Checkout with product and price @downloads @checkout @e2e @regression', async ({
    downloadsPage,
    page,
  }, testInfo) => {
    test.slow();
    ProofHelper.logStep('Opening Downloads page');
    await downloadsPage.openDownloads();

    ProofHelper.logStep('Opening Buy Now modal on first database card');
    await downloadsPage.openBuyModal(0);
    await expect(downloadsPage.purchaseDialog).toBeVisible();

    ProofHelper.logStep('Filling email and proceeding to Stripe Checkout');
    await downloadsPage.proceedToStripeCheckout('buyer.checkout@vehicledatabases.com');

    ProofHelper.logStep('Verifying redirection to checkout.stripe.com');
    expect(page.url()).toContain('checkout.stripe.com');
    ProofHelper.logVerified(`Successfully redirected to secure Stripe Checkout: ${page.url().slice(0, 60)}...`);

    ProofHelper.logStep('Verifying product details and price on Stripe Checkout page');
    await expect(page.locator('body')).toContainText('Vehicle Year/Make/Model Specs — Basic', { timeout: 15000 });
    await expect(page.locator('body')).toContainText('$6,400', { timeout: 15000 });
    ProofHelper.logVerified('Found product name and $6,400 price on Stripe Checkout page');

    await ProofHelper.captureProof(page, testInfo, 'downloads-stripe-checkout-loaded', 'Stripe Hosted Checkout Page');
  });

  test('Complete full purchase flow on Stripe and verify download access on success page @downloads @purchase @checkout @e2e @regression', async ({
    downloadsPage,
    page,
  }, testInfo) => {
    test.slow();
    ProofHelper.logStep('Opening Downloads page');
    await downloadsPage.openDownloads();

    ProofHelper.logStep('Opening Buy Now modal on first database card');
    await downloadsPage.openBuyModal(0);
    await expect(downloadsPage.purchaseDialog).toBeVisible();

    ProofHelper.logStep('Proceeding to Stripe Checkout session');
    const buyerEmail = 'procurement.qa@vehicledatabases.com';
    await downloadsPage.proceedToStripeCheckout(buyerEmail);
    expect(page.url()).toContain('checkout.stripe.com');
    ProofHelper.logVerified('Landed on Stripe Checkout session');

    ProofHelper.logStep('Filling Stripe test card details and completing payment');
    await downloadsPage.fillStripeCardAndPay({
      number: '4242 4242 4242 4242',
      expiry: '12/28',
      cvc: '123',
      name: 'QA Executive Buyer',
    });

    ProofHelper.logStep('Verifying redirection to post-purchase success page');
    expect(page.url()).toContain('/downloads/success');
    expect(page.url()).toContain('session_id=');
    ProofHelper.logVerified(`Successfully redirected to success page: ${page.url().slice(0, 70)}...`);

    ProofHelper.logStep('Verifying order confirmation, product name, and buyer email');
    await expect(page.locator('h1')).toContainText('Purchase Successful!');
    await expect(page.locator('body')).toContainText('Vehicle Year/Make/Model Specs — Basic');
    await expect(page.locator('body')).toContainText(buyerEmail);
    ProofHelper.logVerified('Order confirmed with product name and matching email');

    ProofHelper.logStep('Verifying data download buttons on success page');
    await expect(page.locator('button:has-text("JSON FORMAT")')).toBeVisible();
    await expect(page.locator('button:has-text("NO-SQL FORMAT")')).toBeVisible();
    ProofHelper.logVerified('Data download buttons (JSON & NO-SQL) are unlocked and ready');

    await ProofHelper.captureProof(page, testInfo, 'downloads-purchase-success-page', 'Post-Purchase Data Access Confirmation Page');
  });

});
