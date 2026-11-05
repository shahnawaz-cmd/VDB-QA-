import { Page } from '@playwright/test';
import { ProofHelper } from './ProofHelper';

export interface OverflowResult {
  hasOverflow: boolean;
  docWidth: number;
  scrollWidth: number;
  scrolledX: number;
  culprits: Array<{
    tag: string;
    cls: string;
    id: string;
    text: string;
    width: number;
    right: number;
    overflow: number;
  }>;
}

export class OverflowHelper {
  /**
   * Evaluates the current page for horizontal scrollbar / overflow defects.
   * @param page Playwright Page instance
   * @param maxAllowedScrollX Optional pixel threshold (default 1px for subpixel rendering)
   */
  static async checkHorizontalOverflow(page: Page, maxAllowedScrollX = 1): Promise<OverflowResult> {
    return await page.evaluate((allowedScroll) => {
      const docWidth = document.documentElement.clientWidth;
      const scrollWidth = Math.max(
        document.documentElement.scrollWidth,
        document.body ? document.body.scrollWidth : 0
      );

      // Attempt horizontal scroll
      window.scrollTo(500, 0);
      const scrolledX = window.scrollX || document.documentElement.scrollLeft || 0;
      window.scrollTo(0, 0);

      const hasOverflow = scrollWidth > docWidth + allowedScroll || scrolledX > allowedScroll;

      const culprits: Array<{
        tag: string;
        cls: string;
        id: string;
        text: string;
        width: number;
        right: number;
        overflow: number;
      }> = [];

      if (hasOverflow) {
        document.querySelectorAll('*').forEach((el) => {
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          if (
            rect.right > docWidth + allowedScroll &&
            rect.width > 0 &&
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            style.opacity !== '0'
          ) {
            culprits.push({
              tag: el.tagName.toLowerCase(),
              cls: (el.className || '').toString().slice(0, 60),
              id: el.id,
              text: (el.textContent || '').trim().slice(0, 40).replace(/\s+/g, ' '),
              width: Math.round(rect.width),
              right: Math.round(rect.right),
              overflow: Math.round(rect.right - docWidth)
            });
          }
        });
      }

      return {
        hasOverflow,
        docWidth,
        scrollWidth,
        scrolledX,
        culprits: culprits.sort((a, b) => b.overflow - a.overflow).slice(0, 8)
      };
    }, maxAllowedScrollX);
  }

  /**
   * Asserts that no horizontal scrolling or viewport blowout occurs on the page.
   */
  static async assertNoHorizontalScroll(page: Page, pageName: string, maxAllowedScrollX = 1): Promise<void> {
    const result = await this.checkHorizontalOverflow(page, maxAllowedScrollX);
    if (result.hasOverflow) {
      const details = result.culprits
        .map((c) => `  - <${c.tag}> [class: "${c.cls}"] right=${c.right}px (+${c.overflow}px overflow) text="${c.text}"`)
        .join('\n');
      throw new Error(
        `Mobile horizontal overflow detected on ${pageName}!\n` +
        `Screen width: ${result.docWidth}px, Page scroll width: ${result.scrollWidth}px, Horizontal scroll: ${result.scrolledX}px.\n` +
        `Overflowing elements:\n${details}`
      );
    }
    ProofHelper.logVerified(`${pageName} fits phone screen perfectly: width ${result.docWidth}px, scrollWidth ${result.scrollWidth}px, scrollX 0px`);
  }
}
