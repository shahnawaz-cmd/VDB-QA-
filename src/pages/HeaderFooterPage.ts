import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HeaderFooterPage extends BasePage {
  // Header locators
  readonly logo: Locator;
  readonly navHeader: Locator;
  readonly clientLoginBtn: Locator;
  readonly freeTrialBtn: Locator;
  readonly bookMeetingBtn: Locator;
  readonly docsNavLink: Locator;
  readonly apisDropdownTrigger: Locator;
  readonly industriesDropdownTrigger: Locator;
  readonly mobileMenuButton: Locator;

  // Footer locators
  readonly footer: Locator;
  readonly footerLinks: Locator;
  readonly privacyPolicyLink: Locator;
  readonly termsConditionsLink: Locator;
  readonly phoneLink: Locator;
  readonly whatsappLink: Locator;
  readonly socialLinks: Locator;

  constructor(page: Page) {
    super(page);
    this.navHeader = page.locator('header');
    this.logo = page.locator('header a[href="/"], header a:has(img[alt*="logo" i]), header a:has(svg)').first();
    this.clientLoginBtn = page.locator('header a:has-text("Client Login"), header a[href*="/portal/login"]').first();
    this.freeTrialBtn = page.locator('header a:has-text("Free Trial"), header a[href*="/portal/signup"]').first();
    this.bookMeetingBtn = page.locator('header a[href*="/schedule-a-demo"], header a:has-text("Book A Meeting")').first();
    this.docsNavLink = page.locator('header a[href="/docs"], header a:has-text("Docs")').first();
    this.apisDropdownTrigger = page.locator('header button:has-text("APIs"), header a:has-text("All APIs")').first();
    this.industriesDropdownTrigger = page.locator('header button:has-text("Industries")').first();
    this.mobileMenuButton = page.locator('header button[aria-label*="menu" i], header button:has(svg)').first();

    // Footer
    this.footer = page.locator('footer');
    this.footerLinks = page.locator('footer a');
    this.privacyPolicyLink = page.locator('footer a[href*="privacy-policy"]');
    this.termsConditionsLink = page.locator('footer a[href*="terms-and-conditions"]');
    this.phoneLink = page.locator('footer a[href^="tel:"]').first();
    this.whatsappLink = page.locator('footer a[href*="wa.me"]').first();
    this.socialLinks = page.locator('footer a[href*="linkedin.com"], footer a[href*="twitter.com"], footer a[href*="facebook.com"], footer a[href*="youtube.com"]');
  }

  async clickLogo() {
    await this.logo.click();
  }

  async openDocs() {
    await this.docsNavLink.click();
  }

  async clickLogin() {
    await this.clientLoginBtn.click();
  }

  async clickFreeTrial() {
    await this.freeTrialBtn.click();
  }
}
