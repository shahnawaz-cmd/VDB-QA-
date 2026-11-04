# Vehicle Databases (dev.vehicledatabases.com) - E2E Playwright Automation Framework

Enterprise Playwright automation framework designed following the **Page Object Model (POM)** and **8-layer architecture** for `https://dev.vehicledatabases.com/`.

## 📁 Repository Structure

```
vdb-playwright-e2e/
├── src/
│   ├── pages/                   # Page Object Model locators & UI interactions
│   │   ├── BasePage.ts          # Base page with common navigations & waits
│   │   ├── HeaderFooterPage.ts  # Global navigation, mobile drawer & footer
│   │   ├── ContactDemoPage.ts   # Lead gen & contact forms
│   │   ├── PortalAuthPage.ts    # Portal Login & Signup UI
│   │   ├── DocsPage.ts          # API Documentation & search
│   │   ├── VinDecoderPage.ts    # Interactive trial widgets
│   │   └── index.ts             # Barrel exports
│   ├── fixtures/
│   │   └── test.fixture.ts      # Custom Playwright fixtures (pages & error listeners)
│   └── tests/
│       ├── bvt.spec.ts          # Build Verification Testing (BVT / Sanity)
│       ├── smoke.spec.ts        # Smoke Testing suite (Critical golden paths)
│       ├── boundary-forms.spec.ts # Out-of-Boundary & BVA validations
│       └── e2e-flows.spec.ts    # Full End-to-End user journeys
├── playwright.config.ts         # Multi-browser & viewport configurations
├── package.json                 # Scripts and dependencies
└── tsconfig.json                # TypeScript aliases and options
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
npx playwright install chromium
```

### 2. Run Tests

| Command | Description |
| :--- | :--- |
| `npm run test` | Run all test suites in headless mode |
| `npm run test:bvt` | Run Build Verification Testing (Health, SSL, Assets) |
| `npm run test:smoke` | Run Smoke Testing (Header, Footer, Auth, Docs) |
| `npm run test:boundary`| Run Out-of-Boundary / BVA form tests |
| `npm run test:e2e` | Run End-to-End user conversion & exploration flows |
| `npm run test:headed` | Run tests with browser window visible |
| `npm run report` | Open interactive HTML report with step traces |
