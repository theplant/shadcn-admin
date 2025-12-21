import { test as base, type Page, type TestInfo } from '@playwright/test';

type ConsoleMessage = {
  type: 'log' | 'warn' | 'info' | 'error' | 'pageerror';
  message: string;
  location?: string;
};

type TestFixtures = {
  aiDebugCapture: void;
};

/**
 * Extended Playwright test with AI-friendly debug capture.
 * 
 * Captures ALL console messages (not just errors) and HTML context on failure.
 * The custom AI reporter (ai-reporter.ts) formats this for AI debugging.
 */
export const test = base.extend<TestFixtures>({
  // Auto-fixture: AI Debug Capture
  // Captures all console messages, page errors, and HTML context on failure
  aiDebugCapture: [async ({ page }: { page: Page }, use: () => Promise<void>, testInfo: TestInfo) => {
    const consoleMessages: ConsoleMessage[] = [];
    
    // Capture ALL console message types (log, warn, info, error)
    page.on('console', (msg) => {
      const msgType = msg.type();
      if (['log', 'warn', 'info', 'error'].includes(msgType)) {
        const location = msg.location();
        consoleMessages.push({
          type: msgType as ConsoleMessage['type'],
          message: msg.text(),
          location: location ? `${location.url}:${location.lineNumber}` : undefined,
        });
      }
    });
    
    // Capture uncaught page errors
    page.on('pageerror', (error) => {
      consoleMessages.push({
        type: 'pageerror',
        message: error.message,
        location: error.stack?.split('\n')[1]?.trim(),
      });
    });
    
    await use();
    
    // On test failure, attach debug context
    if (testInfo.status !== 'passed') {
      // Attach all console messages
      if (consoleMessages.length > 0) {
        await testInfo.attach('console-messages', {
          body: JSON.stringify(consoleMessages, null, 2),
          contentType: 'application/json',
        });
      }
      
      // Capture HTML context for debugging
      try {
        const htmlContext: Record<string, string> = {};
        
        // Get form validation messages if any
        const formMessages = await page.locator('[data-slot="form-message"]').allTextContents();
        if (formMessages.length > 0) {
          htmlContext.formValidationMessages = formMessages.join(', ');
        }
        
        // Get available data-testid attributes (useful for selector hints)
        const testIds = await page.locator('[data-testid]').evaluateAll(
          (elements) => elements.map(el => el.getAttribute('data-testid')).filter(Boolean).slice(0, 20)
        );
        if (testIds.length > 0) {
          htmlContext.availableTestIds = testIds.join(', ');
        }
        
        // Get form structure if on a form page
        const formHtml = await page.locator('form').first().innerHTML().catch(() => null);
        if (formHtml) {
          // Truncate to reasonable size for AI context
          htmlContext.formStructure = formHtml.length > 2000 
            ? formHtml.substring(0, 2000) + '... (truncated)'
            : formHtml;
        }
        
        // Get main content area structure
        const mainHtml = await page.locator('main').first().innerHTML().catch(() => null);
        if (mainHtml && !formHtml) {
          htmlContext.mainStructure = mainHtml.length > 2000
            ? mainHtml.substring(0, 2000) + '... (truncated)'
            : mainHtml;
        }
        
        if (Object.keys(htmlContext).length > 0) {
          await testInfo.attach('html-context', {
            body: JSON.stringify(htmlContext, null, 2),
            contentType: 'application/json',
          });
        }
      } catch {
        // Ignore errors when capturing HTML context
      }
    }
  }, { auto: true }],
});

export { expect } from '@playwright/test';
