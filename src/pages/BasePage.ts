import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(path: string = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async getUrl(): Promise<string> {
    return this.page.url();
  }

  async scrollToElement(locator: Locator) {
    await locator.scrollIntoViewIfNeeded();
  }
}
