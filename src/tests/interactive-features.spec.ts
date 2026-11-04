import { test, expect } from '../fixtures/test.fixture';
import { ProofHelper } from '../utils/ProofHelper';

test.describe('Website Interactive Features Checks', () => {

  test('Search and filter APIs live on the API catalog page', { tag: ['@interactive', '@search', '@catalog', '@regression'] }, async ({ page }, testInfo) => {
    ProofHelper.logStep('Opening /api catalog page');
    await page.goto('/api', { waitUntil: 'load', timeout: 35000 });
    // Wait for client hydration
    await page.waitForTimeout(1500);

    const searchInput = page.locator('input[placeholder*="Search APIs" i]');
    await expect(searchInput).toBeVisible();
    ProofHelper.logVerified('Search input is visible');

    // 1. Search for a specific keyword: "VIN"
    ProofHelper.logStep('Typing "VIN" into API search box');
    await searchInput.fill('');
    await searchInput.pressSequentially('VIN', { delay: 50 });
    await page.waitForTimeout(1000);

    const vinCards = page.locator('a[href^="/api/"]:has-text("VIN")');
    const vinCount = await vinCards.count();
    expect(vinCount).toBeGreaterThan(0);
    ProofHelper.logVerified(`Found ${vinCount} VIN API cards matching "VIN"`);

    await ProofHelper.captureProof(page, testInfo, 'interactive-api-search-vin', 'Filtered APIs by VIN keyword');

    // 2. Search for a non-existent keyword to check empty state
    ProofHelper.logStep('Typing a non-existent keyword to verify empty state message');
    await searchInput.fill('');
    await searchInput.pressSequentially('xyznotfound999', { delay: 50 });
    await page.waitForTimeout(1200);

    const emptyMessage = page.locator('text=No APIs match your search');
    await expect(emptyMessage).toBeVisible();
    ProofHelper.logVerified('Empty state message correctly displayed: "No APIs match your search"');

    await ProofHelper.captureProof(page, testInfo, 'interactive-api-search-empty', 'Empty state search result');

    // 3. Clear search box to restore all cards
    ProofHelper.logStep('Clearing search box to restore all API cards');
    await searchInput.fill('');
    await page.waitForTimeout(1000);

    const allCards = page.locator('a[href^="/api/"]');
    const totalCount = await allCards.count();
    expect(totalCount).toBeGreaterThan(15);
    ProofHelper.logVerified(`All ${totalCount} API cards restored cleanly`);
  });

  test('Filter API catalog by category pill buttons', { tag: ['@interactive', '@filter', '@catalog', '@regression'] }, async ({ page }, testInfo) => {
    ProofHelper.logStep('Opening /api catalog page');
    await page.goto('/api', { waitUntil: 'domcontentloaded', timeout: 35000 });

    // Click OCR category button
    ProofHelper.logStep('Clicking "OCR APIs" category button');
    const ocrButton = page.locator('button:has-text("OCR APIs")').first();
    await expect(ocrButton).toBeVisible();
    await ocrButton.click();
    await page.waitForTimeout(500);

    const ocrHeading = page.locator('h2:has-text("OCR APIs")');
    await expect(ocrHeading).toBeVisible();
    ProofHelper.logVerified('"OCR APIs" section is active');

    await ProofHelper.captureProof(page, testInfo, 'interactive-category-pills-ocr', 'Category filter OCR active');

    // Click All APIs button to reset
    ProofHelper.logStep('Clicking "All APIs" button to reset category filters');
    const allButton = page.locator('button:has-text("All APIs")').first();
    await expect(allButton).toBeVisible();
    await allButton.click();
    await page.waitForTimeout(500);

    const vinHeading = page.locator('h2:has-text("VIN Decoding APIs")');
    await expect(vinHeading).toBeVisible();
    ProofHelper.logVerified('Full catalog restored across all categories');
  });

  test('Switch code snippet languages and copy code on homepage', { tag: ['@interactive', '@code-tabs', '@home', '@regression'] }, async ({ page }, testInfo) => {
    ProofHelper.logStep('Opening homepage');
    await page.goto('/', { waitUntil: 'load', timeout: 35000 });
    // Wait for Next.js client-side React hydration
    await page.waitForTimeout(1500);

    const pythonTab = page.locator('button[role="tab"]:has-text("Python")').first();
    const nodeTab = page.locator('button[role="tab"]:has-text("Node")').first();
    const copyButton = page.locator('button:has-text("Copy")').first();

    await pythonTab.scrollIntoViewIfNeeded();
    await expect(pythonTab).toBeVisible();
    ProofHelper.logVerified('Code switcher tabs are visible');

    // Click Python tab
    ProofHelper.logStep('Clicking "Python" code tab');
    await pythonTab.click();
    await page.waitForTimeout(600);

    await expect(pythonTab).toHaveAttribute('aria-selected', 'true');
    const tabsContainer = page.locator('div:has(> button[role="tab"]:has-text("Python"))').first();
    const codeSnippet = tabsContainer.locator('xpath=..//pre').first();
    const pythonCode = await codeSnippet.innerText();
    expect(pythonCode.toLowerCase()).toContain('requests');
    ProofHelper.logVerified('Code block switched to Python (requests) format');

    await ProofHelper.captureProof(page, testInfo, 'interactive-code-tabs-python', 'Python code tab selected');

    // Click Node tab
    ProofHelper.logStep('Clicking "Node" code tab');
    await nodeTab.click();
    await page.waitForTimeout(600);

    await expect(nodeTab).toHaveAttribute('aria-selected', 'true');
    const nodeCode = await codeSnippet.innerText();
    expect(nodeCode.toLowerCase()).toContain('fetch');
    ProofHelper.logVerified('Code block switched to Node (fetch) format');

    // Click Copy button
    ProofHelper.logStep('Testing "Copy" button click event');
    await expect(copyButton).toBeVisible();
    await copyButton.click();
    ProofHelper.logVerified('Copy button clicked successfully');
  });

  test('Select different APIs from interactive demo dropdown on homepage', { tag: ['@interactive', '@demo', '@home', '@regression'] }, async ({ page }, testInfo) => {
    ProofHelper.logStep('Opening homepage to test API demo selector');
    await page.goto('/', { waitUntil: 'load', timeout: 35000 });
    // Wait for Next.js client-side React hydration
    await page.waitForTimeout(1500);

    const apiSelect = page.locator('select').first();
    await apiSelect.scrollIntoViewIfNeeded();
    await expect(apiSelect).toBeVisible();
    ProofHelper.logVerified('API demo dropdown is visible');

    // Check initial iframe src
    const iframe = page.locator('iframe').first();
    await expect(iframe).toBeVisible();
    const initialSrc = await iframe.getAttribute('src') || '';
    ProofHelper.logVerified(`Initial demo iframe: ${initialSrc.substring(0, 50)}...`);

    // Select "Auction History API" option
    ProofHelper.logStep('Selecting "Auction History API" from dropdown');
    await apiSelect.selectOption({ label: 'Auction History API' });
    await page.waitForTimeout(1500);

    const updatedSrc = await iframe.getAttribute('src') || '';
    expect(updatedSrc).toContain('auction');
    ProofHelper.logVerified(`Demo iframe dynamically updated to Auction API: ${updatedSrc.substring(0, 50)}...`);

    await ProofHelper.captureProof(page, testInfo, 'interactive-demo-dropdown-selected', 'Selected Auction History demo');
  });

  test('Toggle dark mode and light mode across the website', { tag: ['@interactive', '@theme', '@regression'] }, async ({ page }, testInfo) => {
    ProofHelper.logStep('Opening homepage to test theme toggle');
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 35000 });

    const themeButton = page.locator('button:has(span.sr-only:has-text("Switch to dark mode")), button:has(span.sr-only:has-text("Switch to light mode"))').first();
    await expect(themeButton).toBeVisible();
    ProofHelper.logVerified('Dark/Light mode switch button is visible');

    // Check initial theme state
    const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme') || 'light');
    ProofHelper.logVerified(`Initial website theme: ${initialTheme}`);

    // Click to toggle theme to dark
    ProofHelper.logStep('Clicking theme toggle button');
    await themeButton.click();
    await page.waitForTimeout(600);

    const toggledTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme') || 'light');
    expect(toggledTheme).toBe('dark');
    ProofHelper.logVerified('Theme successfully changed to: dark');

    await ProofHelper.captureProof(page, testInfo, 'interactive-theme-toggled-dark', 'Website dark theme active');

    // Click again to restore light theme
    ProofHelper.logStep('Clicking theme toggle button again to restore light theme');
    await themeButton.click();
    await page.waitForTimeout(600);

    const restoredTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme') || 'light');
    expect(restoredTheme).toBe('light');
    ProofHelper.logVerified('Theme restored cleanly to: light');
  });

  test('Search documentation in docs search box', { tag: ['@interactive', '@docs', '@regression'] }, async ({ page }, testInfo) => {
    ProofHelper.logStep('Opening /docs page');
    await page.goto('/docs', { waitUntil: 'domcontentloaded', timeout: 35000 });

    const searchDocsInput = page.locator('input[placeholder*="Search docs" i]');
    await expect(searchDocsInput).toBeVisible();
    ProofHelper.logVerified('Docs search input is visible');

    ProofHelper.logStep('Typing "architecture" in documentation search');
    await searchDocsInput.fill('architecture');
    await page.waitForTimeout(800);

    await expect(searchDocsInput).toHaveValue('architecture');
    ProofHelper.logVerified('Search box took the query text cleanly');

    await ProofHelper.captureProof(page, testInfo, 'interactive-docs-search-query', 'Documentation search query typed');
  });

  test('Open and close mobile navigation menu on mobile phone screen', { tag: ['@interactive', '@mobile', '@navigation', '@regression'] }, async ({ page }, testInfo) => {
    ProofHelper.logStep('Setting browser to mobile phone screen size (390x844)');
    await page.setViewportSize({ width: 390, height: 844 });

    ProofHelper.logStep('Opening homepage on mobile');
    await page.goto('/', { waitUntil: 'load', timeout: 35000 });
    await page.waitForTimeout(1000);

    const menuButton = page.locator('button[aria-label="Open menu"], button[aria-controls="mobile-nav"]');
    await expect(menuButton).toBeVisible();
    ProofHelper.logVerified('Mobile menu hamburger button is visible');

    ProofHelper.logStep('Clicking hamburger button to open mobile menu');
    await menuButton.click();
    await page.waitForTimeout(500);

    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    const mobileNav = page.locator('#mobile-nav');
    await expect(mobileNav).toBeVisible();
    ProofHelper.logVerified('Mobile menu drawer opened cleanly');

    await ProofHelper.captureProof(page, testInfo, 'interactive-mobile-drawer-open', 'Mobile navigation drawer open');

    ProofHelper.logStep('Clicking menu button again to close mobile menu');
    await menuButton.click();
    await page.waitForTimeout(500);

    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    ProofHelper.logVerified('Mobile menu drawer closed cleanly');
  });

  test('Navigate through documentation guides using the docs sidebar', { tag: ['@interactive', '@docs', '@sidebar', '@regression'] }, async ({ page }, testInfo) => {
    ProofHelper.logStep('Opening documentation page on desktop');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/docs', { waitUntil: 'load', timeout: 35000 });
    await page.waitForTimeout(1500);

    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();
    ProofHelper.logVerified('Documentation sidebar is visible');

    const architectureLink = sidebar.locator('a[href="/docs/api-architecture"]').first();
    await expect(architectureLink).toBeVisible();
    ProofHelper.logVerified('API Architecture guide link is visible in sidebar');

    ProofHelper.logStep('Clicking "API Architecture" link in sidebar');
    await architectureLink.click();
    await page.waitForURL('**/docs/api-architecture', { timeout: 10000 });

    expect(page.url()).toContain('/docs/api-architecture');
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    const headingText = await heading.innerText();
    expect(headingText.toLowerCase()).toContain('architecture');
    ProofHelper.logVerified(`Successfully navigated to: "${headingText}"`);

    await ProofHelper.captureProof(page, testInfo, 'interactive-docs-sidebar-nav', 'Docs sidebar navigation');
  });

});
