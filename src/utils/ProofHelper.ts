import { Page, TestInfo } from '@playwright/test';
import * as path from 'path';

export class ProofHelper {
  static logStep(stepName: string) {
    console.log(`  ▶ [STEP] ${stepName}`);
  }

  static logVerified(detail: string) {
    console.log(`  ✔ [VERIFIED] ${detail}`);
  }

  static async captureProof(
    page: Page,
    testInfo: TestInfo,
    fileName: string,
    description: string
  ): Promise<Buffer> {
    const screenshotPath = path.join(
      process.cwd(),
      'visual-proofs',
      `${fileName}.png`
    );

    const buffer = await page.screenshot({
      path: screenshotPath,
      fullPage: false,
    });

    await testInfo.attach(`📸 Visual Proof: ${description}`, {
      body: buffer,
      contentType: 'image/png',
    });

    console.log(`  📸 [VISUAL PROOF] Saved & Attached: ${fileName}.png`);
    return buffer;
  }
}
