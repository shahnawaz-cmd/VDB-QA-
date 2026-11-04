import { test as base, expect } from '@playwright/test';
import {
  HeaderFooterPage,
  ContactDemoPage,
  PortalAuthPage,
  DocsPage,
  VinDecoderPage,
  DownloadsPage,
} from '../pages';

type VdbFixtures = {
  headerFooter: HeaderFooterPage;
  contactDemo: ContactDemoPage;
  portalAuth: PortalAuthPage;
  docsPage: DocsPage;
  vinDecoder: VinDecoderPage;
  downloadsPage: DownloadsPage;
  consoleErrors: string[];
};

export const test = base.extend<VdbFixtures>({
  consoleErrors: async ({ page }, use) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    page.on('pageerror', (err) => {
      errors.push(err.message);
    });
    await use(errors);
  },

  headerFooter: async ({ page }, use) => {
    await use(new HeaderFooterPage(page));
  },

  contactDemo: async ({ page }, use) => {
    await use(new ContactDemoPage(page));
  },

  portalAuth: async ({ page }, use) => {
    await use(new PortalAuthPage(page));
  },

  docsPage: async ({ page }, use) => {
    await use(new DocsPage(page));
  },

  vinDecoder: async ({ page }, use) => {
    await use(new VinDecoderPage(page));
  },

  downloadsPage: async ({ page }, use) => {
    await use(new DownloadsPage(page));
  },
});

export { expect };
