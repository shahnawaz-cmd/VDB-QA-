import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class VinDecoderPage extends BasePage {
  readonly vinInput: Locator;
  readonly plateInput: Locator;
  readonly stateDropdown: Locator;
  readonly decodeButton: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly trialSubmitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.vinInput = page.locator('input[placeholder*="VIN" i], input[name="vin"]').first();
    this.plateInput = page.locator('input[placeholder*="Plate" i], input[name="plate"]').first();
    this.stateDropdown = page.locator('select[name="state"], [role="combobox"]').first();
    this.decodeButton = page.locator('button:has-text("Decode"), button:has-text("Search"), button:has-text("Check")').first();
    this.emailInput = page.locator('input[placeholder*="Email" i]').first();
    this.phoneInput = page.locator('input[placeholder*="Phone" i], input[placeholder*="Contact" i]').first();
    this.trialSubmitButton = page.locator('button[type="submit"]').first();
  }
}
