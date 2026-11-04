import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContactDemoPage extends BasePage {
  // Contact Us locators
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly companyInput: Locator;
  readonly messageTextarea: Locator;
  readonly submitButton: Locator;

  // Downloads page locators
  readonly downloadNameInput: Locator;
  readonly downloadEmailInput: Locator;
  readonly downloadPhoneInput: Locator;
  readonly downloadSubmitBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('input[name="name"], input[placeholder="First Name"]').first();
    this.lastNameInput = page.locator('input[name="lastName"], input[placeholder="Last name"]').first();
    this.emailInput = page.locator('input[name="email"], input[type="email"]').first();
    this.phoneInput = page.locator('input[name="phone"], input[type="tel"]').first();
    this.companyInput = page.locator('input[name="company"], input[placeholder="Company Name"]').first();
    this.messageTextarea = page.locator('textarea[name="message"], textarea').first();
    this.submitButton = page.locator('button[type="submit"], button:has-text("Send Message")').first();

    // Downloads
    this.downloadNameInput = page.locator('input[placeholder*="Your name" i]').first();
    this.downloadEmailInput = page.locator('input[placeholder*="Work email" i]').first();
    this.downloadPhoneInput = page.locator('input[placeholder*="Phone number" i]').first();
    this.downloadSubmitBtn = page.locator('button:has-text("Download Sample"), button[type="submit"]').first();
  }

  async fillContactForm(data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    company?: string;
    message?: string;
  }) {
    if (data.firstName !== undefined) await this.firstNameInput.fill(data.firstName);
    if (data.lastName !== undefined) await this.lastNameInput.fill(data.lastName);
    if (data.email !== undefined) await this.emailInput.fill(data.email);
    if (data.phone !== undefined) await this.phoneInput.fill(data.phone);
    if (data.company !== undefined) await this.companyInput.fill(data.company);
    if (data.message !== undefined && (await this.messageTextarea.isVisible())) {
      await this.messageTextarea.fill(data.message);
    }
  }

  async clickSubmit() {
    await this.submitButton.click();
  }
}
