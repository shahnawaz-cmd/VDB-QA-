import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DocsPage extends BasePage {
  readonly searchInput: Locator;
  readonly sidebarNav: Locator;
  readonly codeBlocks: Locator;
  readonly copyCodeButton: Locator;
  readonly docHeadings: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();
    this.sidebarNav = page.locator('aside, nav[aria-label*="sidebar" i], .sidebar').first();
    this.codeBlocks = page.locator('pre, code');
    this.copyCodeButton = page.locator('button:has-text("Copy"), button[aria-label*="copy" i]').first();
    this.docHeadings = page.locator('h1, h2, h3');
  }

  async searchDocs(query: string) {
    await this.searchInput.fill(query);
  }
}
