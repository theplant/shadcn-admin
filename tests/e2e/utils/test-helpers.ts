import { test as base, type Page, type TestInfo, type Request, type Response } from '@playwright/test';

type ConsoleMessage = {
  type: 'log' | 'warn' | 'info' | 'error' | 'pageerror';
  message: string;
  location?: string;
};

type ApiRequest = {
  method: string;
  url: string;
  postData?: string;
  timestamp: number;
};

type ApiResponse = {
  url: string;
  status: number;
  statusText: string;
  body?: string;
  timing: number;
};

type TestFixtures = {
  aiDebugCapture: void;
};

/**
 * Extended Playwright test with AI-friendly debug capture.
 * 
 * Captures:
 * - ALL console messages (not just errors)
 * - HTTP requests/responses for /api endpoints (excludes /src for dev assets)
 * - HTML context on failure
 * - Page errors and network failures
 * 
 * The custom AI reporter (ai-reporter.ts) formats this for AI debugging.
 */
export const test = base.extend<TestFixtures>({
  // Auto-fixture: AI Debug Capture
  // Captures all console messages, page errors, API requests/responses, and HTML context on failure
  aiDebugCapture: [async ({ page }: { page: Page }, use: () => Promise<void>, testInfo: TestInfo) => {
    const consoleMessages: ConsoleMessage[] = [];
    const apiRequests: ApiRequest[] = [];
    const apiResponses: ApiResponse[] = [];
    const failedRequests: Array<{ url: string; error: string }> = [];
    
    // Helper to check if URL is an API endpoint (not dev assets)
    const isApiUrl = (url: string): boolean => {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      // Include /api paths, exclude /src (dev assets), node_modules, and static files
      return pathname.startsWith('/api') && 
             !pathname.startsWith('/src') && 
             !pathname.includes('node_modules') &&
             !pathname.match(/\.(js|css|png|jpg|svg|ico|woff|woff2)$/);
    };
    
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
    
    // Capture API requests (only /api endpoints)
    page.on('request', (request: Request) => {
      const url = request.url();
      if (isApiUrl(url)) {
        apiRequests.push({
          method: request.method(),
          url: url,
          postData: request.postData() || undefined,
          timestamp: Date.now(),
        });
      }
    });
    
    // Capture API responses (only /api endpoints)
    page.on('response', async (response: Response) => {
      const url = response.url();
      if (isApiUrl(url)) {
        let body: string | undefined;
        try {
          const contentType = response.headers()['content-type'] || '';
          if (contentType.includes('application/json')) {
            body = await response.text();
            // Truncate large responses
            if (body.length > 2000) {
              body = body.substring(0, 2000) + '... (truncated)';
            }
          }
        } catch {
          // Response body may not be available
        }
        
        apiResponses.push({
          url: url,
          status: response.status(),
          statusText: response.statusText(),
          body,
          timing: Date.now(),
        });
      }
    });
    
    // Capture failed requests (network errors, timeouts)
    page.on('requestfailed', (request: Request) => {
      const url = request.url();
      if (isApiUrl(url)) {
        failedRequests.push({
          url: url,
          error: request.failure()?.errorText || 'Unknown error',
        });
      }
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
      
      // Attach API requests/responses for debugging
      if (apiRequests.length > 0 || apiResponses.length > 0 || failedRequests.length > 0) {
        await testInfo.attach('api-traffic', {
          body: JSON.stringify({
            requests: apiRequests,
            responses: apiResponses,
            failed: failedRequests,
          }, null, 2),
          contentType: 'application/json',
        });
      }
      
      // Capture HTML context for debugging
      try {
        const htmlContext: Record<string, string> = {};
        
        // Get current URL for context
        htmlContext.currentUrl = page.url();
        
        // Get page title
        const title = await page.title().catch(() => '');
        if (title) {
          htmlContext.pageTitle = title;
        }
        
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
        
        // Get visible buttons and their text (helpful for finding correct selectors)
        const buttons = await page.locator('button:visible').evaluateAll(
          (elements) => elements.map(el => ({
            text: el.textContent?.trim().substring(0, 50),
            ariaLabel: el.getAttribute('aria-label'),
            disabled: el.hasAttribute('disabled'),
          })).filter(b => b.text || b.ariaLabel).slice(0, 15)
        );
        if (buttons.length > 0) {
          htmlContext.visibleButtons = JSON.stringify(buttons);
        }
        
        // Get visible inputs and their labels
        const inputs = await page.locator('input:visible, textarea:visible, select:visible').evaluateAll(
          (elements) => elements.map(el => ({
            type: el.getAttribute('type') || el.tagName.toLowerCase(),
            name: el.getAttribute('name'),
            placeholder: el.getAttribute('placeholder'),
            ariaLabel: el.getAttribute('aria-label'),
            value: (el as HTMLInputElement).value?.substring(0, 50),
          })).slice(0, 15)
        );
        if (inputs.length > 0) {
          htmlContext.visibleInputs = JSON.stringify(inputs);
        }
        
        // Get visible links - helpful for navigation testing
        const links = await page.locator('a:visible').evaluateAll(
          (elements) => elements.map(el => {
            const text = el.textContent?.trim().substring(0, 30);
            const href = el.getAttribute('href');
            return text ? `${text} (${href})` : href;
          }).filter(Boolean).slice(0, 10)
        );
        if (links.length > 0) {
          htmlContext.visibleLinks = JSON.stringify(links);
        }
        
        // Get visible headings - helps understand page structure
        const headings = await page.locator('h1:visible, h2:visible, h3:visible').evaluateAll(
          (elements) => elements.map(el => el.textContent?.trim().substring(0, 50)).filter(Boolean).slice(0, 8)
        );
        if (headings.length > 0) {
          htmlContext.visibleHeadings = JSON.stringify(headings);
        }
        
        // Get dialog content if a dialog is open - critical for modal testing
        const dialogContent = await page.locator('[role="dialog"]:visible, [role="alertdialog"]:visible').first().textContent().catch(() => null);
        if (dialogContent) {
          htmlContext.dialogContent = dialogContent.substring(0, 500);
        }
        
        // Get toast/notification messages - often contain success/error feedback
        const toasts = await page.locator('[data-sonner-toast], [role="status"], .toast, .notification').allTextContents();
        if (toasts.length > 0) {
          htmlContext.toastMessages = toasts.join(', ').substring(0, 300);
        }
        
        // Get loading states - critical for debugging timing issues
        const loadingElements = await page.locator('[aria-busy="true"], .loading, .spinner, [data-loading]').count();
        if (loadingElements > 0) {
          htmlContext.loadingStates = `${loadingElements} loading element(s) detected`;
        }
        
        // Get ARIA snapshot of body - most useful for toMatchAriaSnapshot debugging
        try {
          const ariaSnapshot = await page.locator('body').ariaSnapshot({ timeout: 500 });
          if (ariaSnapshot) {
            // Truncate to reasonable size
            htmlContext.ariaSnapshot = ariaSnapshot.length > 3000 
              ? ariaSnapshot.substring(0, 3000) + '\n... (truncated)'
              : ariaSnapshot;
          }
        } catch {
          // ARIA snapshot may not be available
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
        
        // Get any visible error messages or alerts
        const alerts = await page.locator('[role="alert"], .error, .alert').allTextContents();
        if (alerts.length > 0) {
          htmlContext.alertMessages = alerts.join(', ').substring(0, 500);
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
