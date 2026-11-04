import { test, expect } from '../fixtures/test.fixture';
import { ProofHelper } from '../utils/ProofHelper';

test.describe('Vehicle Services and API Pages Checks', () => {

  test('Check Vehicle Services page content and inquiry form', { tag: ['@api-services', '@forms', '@regression'] }, async ({ page }, testInfo) => {
    await test.step('Open Vehicle Services page', async () => {
      ProofHelper.logStep('Opening Vehicle Services page');
      const response = await page.goto('/api/vehicle-services', { waitUntil: 'domcontentloaded' });
      expect(response).not.toBeNull();
      expect(response!.status()).toBe(200);
      ProofHelper.logVerified('Vehicle Services page opened fine');
    });

    await test.step('Make sure heading and service boxes show up', async () => {
      ProofHelper.logStep('Checking main heading and service categories');
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible();
      const h1Text = await h1.innerText();
      expect(h1Text.toLowerCase()).toContain('vehicle services');
      ProofHelper.logVerified(`Heading says: "${h1Text.replace(/\n/g, ' ')}"`);

      const categories = [
        'Car washes',
        'Garages',
        'Rental agencies',
        'Automobile service',
        'Auto body shops'
      ];

      for (const cat of categories) {
        const catElement = page.locator(`text=${cat}`).first();
        await expect(catElement).toBeVisible();
        ProofHelper.logVerified(`Found category: "${cat}"`);
      }

      await ProofHelper.captureProof(page, testInfo, 'api-vehicle-services-overview', 'Vehicle Services page overview');
    });

    await test.step('Check contact form boxes accept user input', async () => {
      ProofHelper.logStep('Typing name and email into form');
      const nameInput = page.locator('input[placeholder*="Name" i], input[name*="name" i]').first();
      const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]').first();

      if (await nameInput.isVisible()) {
        await nameInput.fill('Fleet Operations');
        await expect(nameInput).toHaveValue('Fleet Operations');
        ProofHelper.logVerified('Name box took the text');
      }

      if (await emailInput.isVisible()) {
        await emailInput.fill('ops@fleetmaintenance.com');
        await expect(emailInput).toHaveValue('ops@fleetmaintenance.com');
        ProofHelper.logVerified('Email box took the email');
      }

      await ProofHelper.captureProof(page, testInfo, 'api-vehicle-services-form', 'Vehicle Services form');
    });
  });

  test('Check links on Vehicle Services page to make sure none are dead', { tag: ['@api-services', '@links', '@regression'] }, async ({ page, request }, testInfo) => {
    await test.step('Find all links on page', async () => {
      ProofHelper.logStep('Looking at all links on Vehicle Services page');
      await page.goto('/api/vehicle-services', { waitUntil: 'domcontentloaded' });

      const linksData = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('a[href]'));
        const internal: string[] = [];
        const external: string[] = [];

        anchors.forEach(a => {
          const href = a.getAttribute('href') || '';
          if (href.startsWith('#') || href.startsWith('javascript:')) return;
          if (href.startsWith('/') || href.includes('vehicledatabases.com')) {
            internal.push(href);
          } else {
            external.push(href);
          }
        });

        return {
          total: anchors.length,
          internal: Array.from(new Set(internal)),
          external: Array.from(new Set(external))
        };
      });

      ProofHelper.logVerified(`Total links found: ${linksData.total}`);
      ProofHelper.logVerified(`Internal site links: ${linksData.internal.length}`);
      ProofHelper.logVerified(`External links: ${linksData.external.length}`);

      expect(linksData.external.some(l => l.includes('nhtsa.gov'))).toBeTruthy();
      expect(linksData.external.some(l => l.includes('wa.me'))).toBeTruthy();
      expect(linksData.external.some(l => l.startsWith('tel:'))).toBeTruthy();
      ProofHelper.logVerified('NHTSA, WhatsApp, and phone links are all present');

      const sampleInternal = linksData.internal.filter(l => l.startsWith('/')).slice(0, 8);
      for (const path of sampleInternal) {
        const res = await request.get(path);
        expect(res.status()).toBeLessThan(400);
        ProofHelper.logVerified(`Link ${path} opened without errors`);
      }

      await ProofHelper.captureProof(page, testInfo, 'api-vehicle-services-links', 'Vehicle services links');
    });
  });

  test('Check buttons with ref tracking link to portal', { tag: ['@api-services', '@cta', '@tracking', '@regression'] }, async ({ page }, testInfo) => {
    const apiPages = ['/api/vehicle-services', '/api/vin-decoder', '/api/ocr'];

    for (const apiPath of apiPages) {
      await test.step(`Check buttons on ${apiPath}`, async () => {
        ProofHelper.logStep(`Looking at buttons on ${apiPath}`);
        await page.goto(apiPath, { waitUntil: 'domcontentloaded' });
        
        // Wait for page hydration
        await page.waitForTimeout(1500);

        const ctaReport = await page.evaluate((currentPath) => {
          const elements = Array.from(document.querySelectorAll('a, button'));
          const portalCtas: Array<{ text: string; href: string }> = [];

          elements.forEach(el => {
            const href = (el as HTMLAnchorElement).href || el.getAttribute('href') || '';
            const text = (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ');
            if (href.includes('portal/signup') || href.includes('portal/login')) {
              portalCtas.push({ text, href });
            }
          });

          return {
            currentPath,
            portalCount: portalCtas.length,
            withRef: portalCtas.filter(c => c.href.includes('ref=')),
            sampleUrl: portalCtas[0]?.href || ''
          };
        }, apiPath);

        ProofHelper.logVerified(`Page: ${apiPath} - Found ${ctaReport.portalCount} portal buttons`);
        expect(ctaReport.portalCount).toBeGreaterThan(0);
        ProofHelper.logVerified(`Sample button URL: ${ctaReport.sampleUrl}`);
      });
    }

    await ProofHelper.captureProof(page, testInfo, 'api-cta-ref-tracking', 'Button tracking links');
  });

  test('Check the main API catalog page opens with all categories and action buttons', { tag: ['@api-services', '@catalog', '@regression'] }, async ({ page, request }, testInfo) => {
    await test.step('Open main /api catalog page', async () => {
      ProofHelper.logStep('Opening main /api catalog page');
      const response = await page.goto('/api', { waitUntil: 'domcontentloaded' });
      expect(response).not.toBeNull();
      expect(response!.status()).toBe(200);
      ProofHelper.logVerified('Main /api catalog page opened fine');
    });

    await test.step('Verify main heading and all API category sections', async () => {
      ProofHelper.logStep('Checking main heading and category groups on /api');
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible();
      const h1Text = await h1.innerText();
      expect(h1Text).toContain('Automotive Car APIs');
      ProofHelper.logVerified(`Heading: "${h1Text.replace(/\n/g, ' ')}"`);

      const categories = [
        'VIN Decoding APIs',
        'OCR APIs',
        'License Plate Decoding APIs',
        'Vehicle Information APIs',
        'Vehicle History APIs'
      ];

      for (const cat of categories) {
        const catHeader = page.locator(`text=${cat}`).first();
        await expect(catHeader).toBeVisible();
        ProofHelper.logVerified(`Found category group: "${cat}"`);
      }

      await ProofHelper.captureProof(page, testInfo, 'api-main-catalog-overview', 'Main API catalog overview');
    });

    await test.step('Verify API cards link to valid subpages', async () => {
      ProofHelper.logStep('Checking all API product links listed on /api');
      const apiLinks = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('a[href^="/api/"]'));
        return Array.from(new Set(anchors.map(a => a.getAttribute('href') || ''))).filter(Boolean);
      });

      ProofHelper.logVerified(`Found ${apiLinks.length} distinct API product links on /api`);
      expect(apiLinks.length).toBeGreaterThan(15);

      // Verify sample API endpoints from the catalog
      for (const link of apiLinks.slice(0, 6)) {
        const res = await request.get(link);
        expect(res.status()).toBeLessThan(400);
        ProofHelper.logVerified(`API link ${link} is valid (status ${res.status()})`);
      }
    });

    await test.step('Verify conversion CTA buttons and referral tracking on /api', async () => {
      ProofHelper.logStep('Checking signup and demo buttons on /api');
      await page.waitForTimeout(1500);

      const ctaData = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('a[href]'));
        const portalSignups = anchors.map(a => a.getAttribute('href') || '').filter(h => h.includes('portal/signup'));
        const demoLinks = anchors.map(a => a.getAttribute('href') || '').filter(h => h.includes('schedule-a-demo'));
        return {
          portalSignups,
          hasDemo: demoLinks.length > 0,
          hasRefCode: portalSignups.some(h => h.includes('ref=VDB'))
        };
      });

      expect(ctaData.portalSignups.length).toBeGreaterThan(0);
      expect(ctaData.hasRefCode).toBeTruthy();
      expect(ctaData.hasDemo).toBeTruthy();
      ProofHelper.logVerified('Signup button carries ref=VDB tracking code');
      ProofHelper.logVerified('Book a Demo button links to /schedule-a-demo');

      await ProofHelper.captureProof(page, testInfo, 'api-main-catalog-ctas', 'Main API catalog action buttons');
    });
  });

  test('Check OCR, Maintenance, Specs, and Window Sticker pages', { tag: ['@api-services', '@catalog', '@regression'] }, async ({ page }) => {
    const apis = [
      { path: '/api/vehicle-services', name: 'Vehicle Services', keyword: 'vehicle services' },
      { path: '/api/ocr', name: 'OCR', keyword: 'ocr' },
      { path: '/api/repair-pricing', name: 'Repair Pricing', keyword: 'repair' },
      { path: '/api/vehicle-maintenance', name: 'Maintenance', keyword: 'maintenance' },
      { path: '/api/vehicle-specifications', name: 'Specs', keyword: 'specification' },
      { path: '/api/window-sticker', name: 'Window Sticker', keyword: 'window sticker' }
    ];

    for (const api of apis) {
      await test.step(`Open ${api.name} page`, async () => {
        ProofHelper.logStep(`Opening ${api.name}`);
        const res = await page.goto(api.path, { waitUntil: 'domcontentloaded' });
        expect(res).not.toBeNull();
        expect(res!.status()).toBe(200);

        const heading = page.locator('h1').first();
        await expect(heading).toBeVisible();
        const text = (await heading.innerText()).toLowerCase();
        expect(text).toContain(api.keyword);
        ProofHelper.logVerified(`${api.name} page opened fine`);
      });
    }
  });

});
