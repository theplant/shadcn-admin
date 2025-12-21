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

type HtmlContext = {
  formValidationMessages?: string;
  availableTestIds?: string;
  formStructure?: string;
  mainStructure?: string;
};

/**
 * AI-Friendly Playwright Reporter
 * 
 * Designed to provide rich context for AI debugging.
 * Captures console messages, HTML context, and actionable debugging hints.
 */
class AIReporter implements Reporter {
  private failedTests: Array<{
    title: string;
    file: string;
    line: number;
    error: string;
    consoleMessages: ConsoleMessage[];
    htmlContext: HtmlContext | null;
  }> = [];

  onBegin(config: FullConfig, suite: Suite) {
    const totalTests = suite.allTests().length;
    console.log(`\n🧪 Running ${totalTests} tests...\n`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const status = result.status;
    const duration = result.duration;
    const title = test.title;
    const file = path.relative(process.cwd(), test.location.file);
    const line = test.location.line;

    if (status === 'passed') {
      console.log(`  ✓ ${title} (${duration}ms)`);
    } else if (status === 'skipped') {
      console.log(`  ⊘ ${title} (skipped)`);
    } else {
      console.log(`  ✘ ${title} (${duration}ms)`);
      
      // Collect failure info
      const errorMessage = result.error?.message || 'Unknown error';
      let consoleMessages: ConsoleMessage[] = [];
      let htmlContext: HtmlContext | null = null;
      
      // Extract console messages from attachments
      for (const attachment of result.attachments) {
        if (attachment.name === 'console-messages' && attachment.body) {
          try {
            consoleMessages = JSON.parse(attachment.body.toString());
          } catch {
            // Ignore parse errors
          }
        }
        
        // Extract HTML context from attachments
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
        htmlContext,
      });
    }
  }

  onEnd(result: FullResult) {
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
      console.log(`\n🔴 Error:`);
      console.log(this.formatError(test.error));

      // Display console messages (all types: log, warn, info, error)
      if (test.consoleMessages.length > 0) {
        console.log(`\n📝 Console Output (${test.consoleMessages.length} messages):`);
        for (const msg of test.consoleMessages.slice(0, 10)) {
          const icon = msg.type === 'error' ? '❌' : msg.type === 'warn' ? '⚠️' : msg.type === 'info' ? 'ℹ️' : '📋';
          console.log(`   ${icon} [${msg.type}] ${msg.message.substring(0, 300)}`);
        }
        if (test.consoleMessages.length > 10) {
          console.log(`   ... and ${test.consoleMessages.length - 10} more messages`);
        }
      }

      // Display HTML context for debugging
      if (test.htmlContext) {
        console.log(`\n🔍 HTML Context:`);
        if (test.htmlContext.formValidationMessages) {
          console.log(`   📋 Form Validation Messages: ${test.htmlContext.formValidationMessages}`);
        }
        if (test.htmlContext.availableTestIds) {
          console.log(`   🏷️  Available data-testid: ${test.htmlContext.availableTestIds}`);
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

    console.log(`\n${'─'.repeat(60)}`);
    console.log(`\n💡 AI Debugging Tips:`);
    console.log(`   1. Check if the selector matches the actual DOM`);
    console.log(`   2. Verify the page has fully loaded before assertions`);
    console.log(`   3. Look for console errors that might indicate app crashes`);
    console.log(`   4. Use { exact: true } for text that appears in multiple elements\n`);
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
}

export default AIReporter;
