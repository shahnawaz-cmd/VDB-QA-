import { test, expect } from '@playwright/test';
import { ProofHelper } from '../utils/ProofHelper';

test.describe('Website Sitemap and Published Routes Health Checks', () => {

  test('Verify sitemap index and all 7 sub sitemaps load with status 200 @sitemap @seo @regression', async ({
    request,
    page,
  }, testInfo) => {
    ProofHelper.logStep('Fetching main sitemap index');
    const indexResponse = await request.get('/sitemap-index.xml');
    expect(indexResponse.status()).toBe(200);

    const indexXml = await indexResponse.text();
    expect(indexXml).toContain('<sitemapindex');

    const expectedSubSitemaps = [
      'sitemap-page.xml',
      'sitemap-api.xml',
      'sitemap-case-studies.xml',
      'sitemap-downloads.xml',
      'sitemap-industry.xml',
      'sitemap-blog.xml',
      'sitemap-docs.xml',
    ];

    for (const subSitemap of expectedSubSitemaps) {
      expect(indexXml).toContain(subSitemap);
      ProofHelper.logStep(`Checking sub-sitemap: ${subSitemap}`);
      const subResponse = await request.get(`/${subSitemap}`);
      expect(subResponse.status()).toBe(200);
      const subXml = await subResponse.text();
      expect(subXml).toContain('<urlset');
      ProofHelper.logVerified(`Sub-sitemap ${subSitemap} is online (status 200)`);
    }

    await page.goto('/sitemap-index.xml', { waitUntil: 'domcontentloaded' }).catch(() => {});
    await ProofHelper.captureProof(page, testInfo, 'sitemap-index-verified', 'Sitemap Index XML Document');
  });

  test('Check that core website pages from sitemap return status 200 @sitemap @coverage @regression', async ({
    request,
  }) => {
    ProofHelper.logStep('Fetching pages from sitemap-page.xml');
    const response = await request.get('/sitemap-page.xml');
    expect(response.status()).toBe(200);
    const xml = await response.text();

    const locs = (xml.match(/<loc>(.*?)<\/loc>/g) || []).map((l) =>
      l.replace(/<\/?loc>/g, '').replace('https://dev.vehicledatabases.com', '')
    );

    expect(locs.length).toBeGreaterThanOrEqual(10);
    ProofHelper.logVerified(`Found ${locs.length} core pages in sitemap-page.xml`);

    for (const path of locs) {
      const pageRes = await request.get(path);
      expect(pageRes.status()).toBe(200);
      ProofHelper.logVerified(`Core page ${path} is online (status 200)`);
    }
  });

  test('Check automotive API and car brand make pages from sitemap are online @sitemap @api @regression', async ({
    request,
  }) => {
    ProofHelper.logStep('Fetching API URLs from sitemap-api.xml');
    const response = await request.get('/sitemap-api.xml');
    expect(response.status()).toBe(200);
    const xml = await response.text();

    const locs = (xml.match(/<loc>(.*?)<\/loc>/g) || []).map((l) =>
      l.replace(/<\/?loc>/g, '').replace('https://dev.vehicledatabases.com', '')
    );

    expect(locs.length).toBeGreaterThanOrEqual(50);
    ProofHelper.logVerified(`Found ${locs.length} API and Brand pages in sitemap-api.xml`);

    // Sample 12 diverse pages (primary APIs + dynamic make pages)
    const sampled = [
      '/api/vin-decoder',
      '/api/ocr',
      '/api/window-sticker',
      '/api/license-plate',
      '/api/vehicle-maintenance',
      '/api/makes/dodge',
      '/api/makes/subaru',
      '/api/makes/mini',
      '/api/makes/toyota',
      '/api/makes/ford',
      '/api/makes/chevrolet',
      '/api/makes/bmw',
    ].filter((p) => locs.includes(p));

    for (const path of sampled) {
      const pageRes = await request.get(path);
      expect(pageRes.status()).toBe(200);
      ProofHelper.logVerified(`API route ${path} is online (status 200)`);
    }
  });

  test('Check industry vertical pages and case studies from sitemap are online @sitemap @industry @regression', async ({
    request,
  }) => {
    ProofHelper.logStep('Fetching industry URLs from sitemap-industry.xml');
    const indResponse = await request.get('/sitemap-industry.xml');
    expect(indResponse.status()).toBe(200);
    const indXml = await indResponse.text();

    const industryUrls = (indXml.match(/<loc>(.*?)<\/loc>/g) || []).map((l) =>
      l.replace(/<\/?loc>/g, '').replace('https://dev.vehicledatabases.com', '')
    );

    expect(industryUrls.length).toBe(8);
    for (const path of industryUrls) {
      const pageRes = await request.get(path);
      expect(pageRes.status()).toBe(200);
      ProofHelper.logVerified(`Industry page ${path} is online (status 200)`);
    }

    ProofHelper.logStep('Checking case study from sitemap-case-studies.xml');
    const csResponse = await request.get('/sitemap-case-studies.xml');
    expect(csResponse.status()).toBe(200);
    const csXml = await csResponse.text();
    const csUrls = (csXml.match(/<loc>(.*?)<\/loc>/g) || []).map((l) =>
      l.replace(/<\/?loc>/g, '').replace('https://dev.vehicledatabases.com', '')
    );

    for (const csPath of csUrls) {
      const csRes = await request.get(csPath);
      expect(csRes.status()).toBe(200);
      ProofHelper.logVerified(`Case study ${csPath} is online (status 200)`);
    }
  });

  test('Check developer documentation pages from sitemap are online @sitemap @docs @regression', async ({
    request,
  }) => {
    ProofHelper.logStep('Fetching documentation URLs from sitemap-docs.xml');
    const response = await request.get('/sitemap-docs.xml');
    expect(response.status()).toBe(200);
    const xml = await response.text();

    const docUrls = (xml.match(/<loc>(.*?)<\/loc>/g) || []).map((l) =>
      l.replace(/<\/?loc>/g, '').replace('https://dev.vehicledatabases.com', '')
    );

    expect(docUrls.length).toBeGreaterThanOrEqual(30);
    ProofHelper.logVerified(`Found ${docUrls.length} documentation pages in sitemap-docs.xml`);

    // Sample 8 documentation guides across architecture and APIs
    const sampledDocs = [
      '/docs/api-architecture',
      '/docs/api-architecture/requests',
      '/docs/api-architecture/responses',
      '/docs/api-documentation/advanced-vin-decode',
      '/docs/api-documentation/auction',
      '/docs/api-documentation/classic-vin-decoder',
      '/docs/api-documentation/license-plate',
      '/docs/api-documentation/ocr',
    ].filter((p) => docUrls.includes(p));

    for (const docPath of sampledDocs) {
      const docRes = await request.get(docPath);
      expect(docRes.status()).toBe(200);
      ProofHelper.logVerified(`Documentation page ${docPath} is online (status 200)`);
    }
  });

  test('Check published automotive blog articles and author profiles from sitemap are online @sitemap @blog @regression', async ({
    request,
  }) => {
    ProofHelper.logStep('Fetching blog URLs from sitemap-blog.xml');
    const response = await request.get('/sitemap-blog.xml');
    expect(response.status()).toBe(200);
    const xml = await response.text();

    const blogUrls = (xml.match(/<loc>(.*?)<\/loc>/g) || []).map((l) =>
      l.replace(/<\/?loc>/g, '').replace('https://dev.vehicledatabases.com', '')
    );

    expect(blogUrls.length).toBeGreaterThanOrEqual(100);
    ProofHelper.logVerified(`Found ${blogUrls.length} blog and author pages in sitemap-blog.xml`);

    // Sample 6 articles and 2 authors
    const articles = blogUrls.filter((u) => u.startsWith('/articles')).slice(0, 6);
    const authors = blogUrls.filter((u) => u.startsWith('/author')).slice(0, 2);

    for (const path of [...articles, ...authors]) {
      const res = await request.get(path);
      expect(res.status()).toBe(200);
      ProofHelper.logVerified(`Published article/author ${path} is online (status 200)`);
    }
  });

});
