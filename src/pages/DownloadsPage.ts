import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DownloadsPage extends BasePage {
  readonly heroHeading: Locator;
  readonly availableDatabasesHeading: Locator;
  readonly databaseCards: Locator;
  readonly sampleDatabaseButtons: Locator;
  readonly buyNowButtons: Locator;
  readonly showMoreButtons: Locator;
  readonly customPricingButtons: Locator;

  // Modals
  readonly purchaseDialog: Locator;
  readonly purchaseEmailInput: Locator;
  readonly purchaseContinueBtn: Locator;
  readonly purchaseCancelBtn: Locator;

  readonly sampleDialog: Locator;
  readonly sampleJsonBtn: Locator;
  readonly sampleCancelBtn: Locator;

  readonly quoteDialog: Locator;
  readonly quoteEmailInput: Locator;
  readonly quoteExpectedPriceInput: Locator;
  readonly quoteMessageInput: Locator;
  readonly quoteCancelBtn: Locator;
  readonly quoteSubmitBtn: Locator;

  // Bottom Inquiry Form
  readonly bottomForm: Locator;
  readonly bottomNameInput: Locator;
  readonly bottomEmailInput: Locator;
  readonly bottomCompanyInput: Locator;
  readonly bottomDropdownBtn: Locator;
  readonly bottomMessageInput: Locator;
  readonly bottomSubmitBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.heroHeading = page.locator('h1').first();
    this.availableDatabasesHeading = page.locator('h2:has-text("Available Databases")');
    this.databaseCards = page.locator('h3.font-display.text-xl');
    this.sampleDatabaseButtons = page.locator('button:has-text("Sample Database")');
    this.buyNowButtons = page.locator('button:has-text("Buy Now")');
    this.showMoreButtons = page.locator('button:has-text("Show more"), button:has-text("Hide")');
    this.customPricingButtons = page.locator('button:has-text("Need custom pricing")');

    // Modals
    this.purchaseDialog = page.getByRole('dialog', { name: 'Complete Your Purchase' });
    this.purchaseEmailInput = this.purchaseDialog.locator('input[type="email"]');
    this.purchaseContinueBtn = this.purchaseDialog.locator('button:has-text("Continue to Payment")');
    this.purchaseCancelBtn = this.purchaseDialog.locator('button:has-text("Cancel")');

    this.sampleDialog = page.getByRole('dialog');
    this.sampleJsonBtn = this.sampleDialog.locator('button:has-text("JSON FORMAT")');
    this.sampleCancelBtn = this.sampleDialog.locator('button:has-text("Cancel")');

    this.quoteDialog = page.getByRole('dialog');
    this.quoteEmailInput = this.quoteDialog.locator('input[type="email"]');
    this.quoteExpectedPriceInput = this.quoteDialog.locator('input[placeholder="1000"]');
    this.quoteMessageInput = this.quoteDialog.locator('textarea[name="message"]');
    this.quoteCancelBtn = this.quoteDialog.locator('button:has-text("Cancel")');
    this.quoteSubmitBtn = this.quoteDialog.locator('button:has-text("Submit Request")');

    // Bottom Inquiry Form
    this.bottomForm = page.locator('form.flex.flex-col');
    this.bottomNameInput = this.bottomForm.locator('input[name="name"]');
    this.bottomEmailInput = this.bottomForm.locator('input[name="email"]');
    this.bottomCompanyInput = this.bottomForm.locator('input[name="company"]');
    this.bottomDropdownBtn = this.bottomForm.locator('button[aria-haspopup="listbox"]');
    this.bottomMessageInput = this.bottomForm.locator('textarea[name="message"]');
    this.bottomSubmitBtn = this.bottomForm.locator('button[type="submit"]');
  }

  async openDownloads(): Promise<void> {
    await this.navigateTo('/downloads');
    await this.page.waitForTimeout(1500); // Allow Next.js client hydration
  }

  async openSampleModal(index = 0): Promise<void> {
    await this.sampleDatabaseButtons.nth(index).click();
    await this.sampleDialog.waitFor({ state: 'visible' });
  }

  async closeSampleModal(): Promise<void> {
    await this.sampleCancelBtn.click();
    await this.sampleDialog.waitFor({ state: 'hidden' });
  }

  async openBuyModal(index = 0): Promise<void> {
    await this.buyNowButtons.nth(index).click();
    await this.purchaseDialog.waitFor({ state: 'visible' });
  }

  async closeBuyModal(): Promise<void> {
    await this.purchaseCancelBtn.click();
    await this.purchaseDialog.waitFor({ state: 'hidden' });
  }

  async proceedToStripeCheckout(email: string): Promise<void> {
    await this.purchaseEmailInput.fill(email);
    await Promise.all([
      this.page.waitForURL(/checkout\.stripe\.com/, {
        timeout: 30000,
        waitUntil: 'domcontentloaded',
      }),
      this.purchaseContinueBtn.click(),
    ]);
  }

  async fillStripeCardAndPay(card = {
    number: '4242 4242 4242 4242',
    expiry: '12/28',
    cvc: '123',
    name: 'QA Test Buyer',
    zip: '90210',
    phone: '2015550123',
  }): Promise<void> {
    const cardInput = this.page.locator('input#cardNumber, input[name="cardNumber"]');
    await cardInput.waitFor({ state: 'visible', timeout: 25000 });
    await cardInput.fill(card.number);
    await this.page.locator('input#cardExpiry, input[name="cardExpiry"]').fill(card.expiry);
    await this.page.locator('input#cardCvc, input[name="cardCvc"]').fill(card.cvc);

    const billingNameInput = this.page.locator('input#billingName, input[name="billingName"]');
    if (await billingNameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await billingNameInput.fill(card.name);
    }

    // Fill ZIP / Postal Code if present (Stripe mandates this when Country is United States)
    const zipInput = this.page.locator('input#billingPostalCode, input[name="postalCode"], input[placeholder="ZIP"], input[autocomplete="postal-code"]');
    if (await zipInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await zipInput.fill(card.zip || '90210');
    }

    // Uncheck "Save my information with Link" checkbox if auto-checked by Stripe
    const linkCheckbox = this.page.getByRole('checkbox', { name: /Save my information with Link/i });
    if (await linkCheckbox.isVisible({ timeout: 1500 }).catch(() => false)) {
      if (await linkCheckbox.isChecked()) {
        await linkCheckbox.uncheck();
      }
    }

    // In case phone number input is required by Link/Stripe
    const phoneInput = this.page.locator('input#phoneNumber, input[type="tel"], input[name="phone"]');
    if (await phoneInput.isVisible({ timeout: 1500 }).catch(() => false)) {
      await phoneInput.fill(card.phone || '2015550123');
    }

    const payBtn = this.page.locator('button[type="submit"], button:has-text("Pay")').first();
    await Promise.all([
      this.page.waitForURL(/\/downloads\/success/, {
        timeout: 60000,
        waitUntil: 'domcontentloaded',
      }),
      payBtn.click(),
    ]);
  }

  async openQuoteModal(index = 0): Promise<void> {
    await this.customPricingButtons.nth(index).click();
    await this.quoteDialog.waitFor({ state: 'visible' });
  }

  async closeQuoteModal(): Promise<void> {
    await this.quoteCancelBtn.click();
    await this.quoteDialog.waitFor({ state: 'hidden' });
  }
}
