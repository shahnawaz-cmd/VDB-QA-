import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class PortalAuthPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly nameInput: Locator;
  readonly submitButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly switchToSignUpLink: Locator;
  readonly switchToLoginLink: Locator;
  readonly termsCheckbox: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
    this.passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    this.confirmPasswordInput = page.locator('input[type="password"][name*="confirm" i], input[placeholder*="confirm" i]').first();
    this.nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();
    this.submitButton = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Login"), button:has-text("Sign Up"), button:has-text("Get Started")').first();
    this.forgotPasswordLink = page.locator('a:has-text("Forgot password"), a[href*="forgot"]').first();
    this.switchToSignUpLink = page.locator('a:has-text("Sign Up"), a[href*="signup"], a:has-text("Create account")').first();
    this.switchToLoginLink = page.locator('a:has-text("Sign In"), a:has-text("Log in"), a[href*="login"]').first();
    this.termsCheckbox = page.locator('input[type="checkbox"]').first();
    this.errorMessage = page.locator('.error, [role="alert"], .text-red-500, .text-danger, p:has-text("invalid" i), p:has-text("required" i)').first();
  }

  async login(email: string, pass: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.submitButton.click();
  }
}
