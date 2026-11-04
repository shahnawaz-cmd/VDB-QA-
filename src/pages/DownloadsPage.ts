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

  async openQuoteModal(index = 0): Promise<void> {
    await this.customPricingButtons.nth(index).click();
    await this.quoteDialog.waitFor({ state: 'visible' });
  }

  async closeQuoteModal(): Promise<void> {
    await this.quoteCancelBtn.click();
    await this.quoteDialog.waitFor({ state: 'hidden' });
  }
}
