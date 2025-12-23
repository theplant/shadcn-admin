import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';
import * as path from 'path';

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

type ApiTraffic = {
  requests: ApiRequest[];
  responses: ApiResponse[];
  failed: Array<{ url: string; error: string }>;
};

type HtmlContext = {
  currentUrl?: string;
  pageTitle?: string;
  formValidationMessages?: string;
  availableTestIds?: string;
  visibleButtons?: string;
  visibleInputs?: string;
  visibleLinks?: string;
  visibleHeadings?: string;
  dialogContent?: string;
  ariaSnapshot?: string;
  formStructure?: string;
  mainStructure?: string;
  alertMessages?: string;
  toastMessages?: string;
  loadingStates?: string;
};

/**
 * AI-Friendly Playwright Reporter
 * 
 * This reporter is designed to work ALONGSIDE the built-in 'list' reporter.
 * Configure in playwright.config.ts:
 *   reporter: [['list'], ['./tests/e2e/utils/ai-reporter.ts']]
 * 
 * The list reporter handles real-time test progress output.
 * This reporter adds rich AI debugging context on failures:
 * - Console messages (log, warn, info, error)
 * - API requests/responses for /api endpoints
 * - HTML context (buttons, inputs, forms, alerts)
 * - Actionable debugging tips
 */
class AIReporter implements Reporter {
  private failedTests: Array<{
    title: string;
    file: string;
    line: number;
    error: string;
    consoleMessages: ConsoleMessage[];
    apiTraffic: ApiTraffic | null;
    htmlContext: HtmlContext | null;
  }> = [];
  
  private totalTests = 0;
  private passedTests = 0;
  private skippedTests = 0;

  onBegin(_config: FullConfig, suite: Suite) {
    this.totalTests = suite.allTests().length;
    // Don't print here - let list reporter handle real-time output
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const status = result.status;
    const title = test.title;
    const file = path.relative(process.cwd(), test.location.file);
    const line = test.location.line;

    if (status === 'passed') {
      this.passedTests++;
      // Don't print - list reporter handles this
    } else if (status === 'skipped') {
      this.skippedTests++;
      // Don't print - list reporter handles this
    } else {
      // Collect failure info for detailed output at the end
      const errorMessage = result.error?.message || 'Unknown error';
      let consoleMessages: ConsoleMessage[] = [];
      let apiTraffic: ApiTraffic | null = null;
      let htmlContext: HtmlContext | null = null;
      
      // Extract attachments
      for (const attachment of result.attachments) {
        if (attachment.name === 'console-messages' && attachment.body) {
          try {
            consoleMessages = JSON.parse(attachment.body.toString());
          } catch {
            // Ignore parse errors
          }
        }
        
        if (attachment.name === 'api-traffic' && attachment.body) {
          try {
            apiTraffic = JSON.parse(attachment.body.toString());
          } catch {
            // Ignore parse errors
          }
        }
        
        if (attachment.name === 'html-context' && attachment.body) {
          try {
            htmlContext = JSON.parse(attachment.body.toString());
          } catch {
            // Ignore parse errors
          }
        }
      }

      this.failedTests.push({
        title,
        file,
        line,
        error: errorMessage,
        consoleMessages,
        apiTraffic,
        htmlContext,
      });
    }
  }

  onEnd(_result: FullResult) {
    // Print summary after list reporter finishes
    console.log('\n' + '─'.repeat(60));
    
    if (this.failedTests.length === 0) {
      console.log(`\n✅ All tests passed!\n`);
      return;
    }

    console.log(`\n❌ ${this.failedTests.length} test(s) failed:\n`);

    for (let i = 0; i < this.failedTests.length; i++) {
      const test = this.failedTests[i];
      console.log(`\n${'═'.repeat(60)}`);
      console.log(`FAILURE ${i + 1}: ${test.title}`);
      console.log(`${'═'.repeat(60)}`);
      console.log(`📁 File: ${test.file}:${test.line}`);
      
      // Show current URL if available
      if (test.htmlContext?.currentUrl) {
        console.log(`🌐 URL: ${test.htmlContext.currentUrl}`);
      }
      
      console.log(`\n🔴 Error:`);
      console.log(this.formatError(test.error));

      // Display console messages (all types: log, warn, info, error)
      if (test.consoleMessages.length > 0) {
        console.log(`\n📝 Console Output (${test.consoleMessages.length} messages):`);
        for (const msg of test.consoleMessages.slice(0, 10)) {
          const icon = msg.type === 'error' ? '❌' : msg.type === 'warn' ? '⚠️' : msg.type === 'info' ? 'ℹ️' : msg.type === 'pageerror' ? '💥' : '📋';
          console.log(`   ${icon} [${msg.type}] ${msg.message.substring(0, 300)}`);
        }
        if (test.consoleMessages.length > 10) {
          console.log(`   ... and ${test.consoleMessages.length - 10} more messages`);
        }
      }

      // Display API traffic for debugging - ALWAYS show response bodies for AI context
      if (test.apiTraffic) {
        const { requests, responses, failed } = test.apiTraffic;
        
        if (failed.length > 0) {
          console.log(`\n🚨 Failed API Requests:`);
          for (const req of failed) {
            console.log(`   ❌ ${req.url}`);
            console.log(`      Error: ${req.error}`);
          }
        }
        
        if (requests.length > 0 || responses.length > 0) {
          console.log(`\n🌐 API Traffic (${requests.length} requests, ${responses.length} responses):`);
          
          // Show requests with their responses - ALWAYS include response body for debugging
          for (const req of requests.slice(0, 8)) {
            const urlPath = new URL(req.url).pathname;
            console.log(`   → ${req.method} ${urlPath}`);
            if (req.postData) {
              const truncatedBody = req.postData.length > 500 
                ? req.postData.substring(0, 500) + '...' 
                : req.postData;
              console.log(`     Request Body: ${truncatedBody}`);
            }
            
            // Find matching response - ALWAYS show response body
            const matchingResponse = responses.find(r => r.url === req.url);
            if (matchingResponse) {
              const statusIcon = matchingResponse.status >= 400 ? '❌' : matchingResponse.status >= 300 ? '↪️' : '✅';
              console.log(`   ← ${statusIcon} ${matchingResponse.status} ${matchingResponse.statusText}`);
              // Always show response body - critical for AI debugging
              if (matchingResponse.body) {
                const truncatedBody = matchingResponse.body.length > 800 
                  ? matchingResponse.body.substring(0, 800) + '...' 
                  : matchingResponse.body;
                console.log(`     Response Body: ${truncatedBody}`);
              }
            }
          }
          
          if (requests.length > 8) {
            console.log(`   ... and ${requests.length - 8} more requests`);
          }
        }
        
        // Also show any responses without matching requests (e.g., preflight, redirects)
        const unmatchedResponses = responses.filter(r => 
          !requests.some(req => req.url === r.url) && r.status >= 400
        );
        if (unmatchedResponses.length > 0) {
          console.log(`\n⚠️  Additional Error Responses:`);
          for (const resp of unmatchedResponses.slice(0, 3)) {
            const urlPath = new URL(resp.url).pathname;
            console.log(`   ← ❌ ${resp.status} ${resp.statusText} ${urlPath}`);
            if (resp.body) {
              console.log(`     Response: ${resp.body.substring(0, 300)}`);
            }
          }
        }
      }

      // Display HTML context for debugging
      if (test.htmlContext) {
        console.log(`\n🔍 Page State & HTML Context:`);
        
        // Show loading states first - critical for debugging timing issues
        if (test.htmlContext.loadingStates) {
          console.log(`   ⏳ Loading States: ${test.htmlContext.loadingStates}`);
        }
        
        // Show toast/notification messages - often contain success/error feedback
        if (test.htmlContext.toastMessages) {
          console.log(`   🔔 Toast Messages: ${test.htmlContext.toastMessages}`);
        }
        
        if (test.htmlContext.alertMessages) {
          console.log(`   ⚠️  Alert Messages: ${test.htmlContext.alertMessages}`);
        }
        
        if (test.htmlContext.formValidationMessages) {
          console.log(`   📋 Form Validation: ${test.htmlContext.formValidationMessages}`);
        }
        
        // Show dialog content if present - critical for modal testing
        if (test.htmlContext.dialogContent) {
          console.log(`   💬 Dialog Content: ${test.htmlContext.dialogContent.substring(0, 300)}`);
        }
        
        // Show visible headings - helps understand page structure
        if (test.htmlContext.visibleHeadings) {
          try {
            const headings = JSON.parse(test.htmlContext.visibleHeadings);
            if (headings.length > 0) {
              console.log(`   📑 Page Headings: ${headings.slice(0, 5).join(' > ')}`);
            }
          } catch {
            console.log(`   📑 Page Headings: ${test.htmlContext.visibleHeadings}`);
          }
        }
        
        if (test.htmlContext.visibleButtons) {
          try {
            const buttons = JSON.parse(test.htmlContext.visibleButtons);
            const buttonTexts = buttons.map((b: { text?: string; ariaLabel?: string; disabled?: boolean }) => 
              (b.disabled ? '[disabled] ' : '') + (b.text || b.ariaLabel)
            ).filter(Boolean).slice(0, 10);
            if (buttonTexts.length > 0) {
              console.log(`   🔘 Visible Buttons: ${buttonTexts.join(', ')}`);
            }
          } catch {
            // Ignore parse errors
          }
        }
        
        if (test.htmlContext.visibleInputs) {
          try {
            const inputs = JSON.parse(test.htmlContext.visibleInputs);
            const inputDescs = inputs.map((i: { name?: string; placeholder?: string; ariaLabel?: string; type?: string; value?: string }) => {
              const label = i.ariaLabel || i.placeholder || i.name || i.type;
              const val = i.value ? `="${i.value}"` : '';
              return label + val;
            }).filter(Boolean).slice(0, 10);
            if (inputDescs.length > 0) {
              console.log(`   📝 Visible Inputs: ${inputDescs.join(', ')}`);
            }
          } catch {
            // Ignore parse errors
          }
        }
        
        // Show visible links - helpful for navigation testing
        if (test.htmlContext.visibleLinks) {
          try {
            const links = JSON.parse(test.htmlContext.visibleLinks);
            if (links.length > 0) {
              console.log(`   🔗 Visible Links: ${links.slice(0, 8).join(', ')}`);
            }
          } catch {
            console.log(`   🔗 Visible Links: ${test.htmlContext.visibleLinks}`);
          }
        }
        
        if (test.htmlContext.availableTestIds) {
          console.log(`   🏷️  data-testid: ${test.htmlContext.availableTestIds}`);
        }
        
        // Show ARIA snapshot if available - most useful for toMatchAriaSnapshot debugging
        if (test.htmlContext.ariaSnapshot) {
          console.log(`   ♿ ARIA Snapshot (actual):`);
          console.log(this.formatAriaSnapshot(test.htmlContext.ariaSnapshot));
        }
        
        if (test.htmlContext.formStructure) {
          console.log(`   📄 Form Structure:`);
          console.log(this.formatHtmlSnippet(test.htmlContext.formStructure));
        } else if (test.htmlContext.mainStructure) {
          console.log(`   📄 Main Content Structure:`);
          console.log(this.formatHtmlSnippet(test.htmlContext.mainStructure));
        }
      }
    }
 }

  /**
   * Tell Playwright we print to stdio so it doesn't add another reporter
   */
  printsToStdio(): boolean {
    return true;
  }

  private formatError(error: string): string {
    // Extract the most relevant part of the error
    const lines = error.split('\n');
    const relevantLines: string[] = [];
    
    for (const line of lines) {
      // Skip stack trace lines
      if (line.trim().startsWith('at ')) continue;
      // Skip empty lines
      if (!line.trim()) continue;
      // Include up to 10 relevant lines
      if (relevantLines.length < 10) {
        relevantLines.push(`   ${line}`);
      }
    }
    
    return relevantLines.join('\n');
  }

  private formatHtmlSnippet(html: string): string {
    // Format HTML for readable output, showing structure without overwhelming
    const lines = html.split('\n');
    const output: string[] = [];
    let lineCount = 0;
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      
      // Truncate very long lines
      const displayLine = trimmed.length > 120 ? trimmed.substring(0, 120) + '...' : trimmed;
      output.push(`      ${displayLine}`);
      lineCount++;
      
      // Limit to 15 lines for readability
      if (lineCount >= 15) {
        output.push('      ... (truncated)');
        break;
      }
    }
    
    return output.join('\n') || '      (no HTML captured)';
  }

  private formatAriaSnapshot(snapshot: string): string {
    // Format ARIA snapshot for readable output - preserve indentation structure
    const lines = snapshot.split('\n');
    const output: string[] = [];
    let lineCount = 0;
    
    for (const line of lines) {
      if (!line.trim()) continue;
      
      // Preserve the ARIA tree indentation but add our prefix
      const displayLine = line.length > 100 ? line.substring(0, 100) + '...' : line;
      output.push(`      ${displayLine}`);
      lineCount++;

    }
    
    return output.join('\n') || '      (no ARIA snapshot captured)';
  }
}

export default AIReporter;
