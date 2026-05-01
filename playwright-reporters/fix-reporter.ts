import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import fs from 'fs';
import path from 'path';

function sanitizeFileName(name: string) {
  return name.replace(/[^a-z0-9\-_.]/gi, '_').slice(0, 200);
}

interface ExtractedValues {
  expected?: string | number;
  received?: string | number;
  statusExpected?: number;
  statusReceived?: number;
}

function extractExpectedVsActual(message: string): ExtractedValues {
  const result: ExtractedValues = {};

  // Strip ANSI escape codes for cleaner regex matching
  const cleanMessage = message.replace(/\x1b\[[0-9;]*m/g, '');

  // Try to extract "Expected: X" and "Received: Y" pattern
  const expectedMatch = cleanMessage.match(/Expected:\s*[\[\(]?\s*(\d+|\w+|"[^"]*")/i);
  const receivedMatch = cleanMessage.match(/Received:\s*[\[\(]?\s*(\d+|\w+|"[^"]*")/i);

  if (expectedMatch) {
    const val = expectedMatch[1].replace(/["']/g, '');
    result.expected = isNaN(Number(val)) ? val : Number(val);
  }

  if (receivedMatch) {
    const val = receivedMatch[1].replace(/["']/g, '');
    result.received = isNaN(Number(val)) ? val : Number(val);
  }

  // Special handling for HTTP status codes
  if (typeof result.expected === 'number' && result.expected >= 100 && result.expected < 600) {
    result.statusExpected = result.expected;
  }
  if (typeof result.received === 'number' && result.received >= 100 && result.received < 600) {
    result.statusReceived = result.received;
  }

  return result;
}

function generateSuggestion(message: string, values: ExtractedValues): string {
  const m = message.toLowerCase();

  // HTTP status code mismatch
  if (values.statusExpected && values.statusReceived) {
    const codes = `Expected ${values.statusExpected}, got ${values.statusReceived}`;
    if (values.statusExpected === 400 && values.statusReceived === 422) {
      return `API validation error mismatch — ${codes}. The backend is returning a more specific validation error (422) instead of a generic bad request (400). Update test to expect 422, or adjust the backend validation logic to return 400.`;
    }
    if (values.statusExpected === 404 && values.statusReceived === 200) {
      return `Unexpected success — ${codes}. The endpoint was expected to return 404 but succeeded. Check the test setup or confirm the resource should exist.`;
    }
    if (values.statusExpected === 500) {
      return `Server error — ${codes}. The backend returned a server error. Check backend logs for stack traces and fix the underlying issue.`;
    }
    return `HTTP status code mismatch — ${codes}. Review the API response and adjust either the backend status or the test expectation.`;
  }

  // Visibility / selector issues
  if (m.includes('to be visible') || m.includes('tobevisible') || m.includes('not visible') || m.includes('element is not visible')) {
    return 'Verify the selector is correct, ensure the element is present, or increase the wait timeout. Example: await expect(locator).toBeVisible({ timeout: 20000 })';
  }

  // Timeouts
  if (m.includes('timeout') || m.includes('timed out') || m.includes('exceeded')) {
    return 'A timeout occurred — either the element or navigation was slow, or the selector is wrong. Consider increasing `timeout`, adding `await page.waitForSelector(...)`, or improving mocks for network responses.';
  }

  // Text / content mismatches
  if (m.includes('to have text') || m.includes('tohavetext') || m.includes('text mismatch') || (m.includes('expected') && m.includes('received'))) {
    const diff = values.expected || values.received ? ` (Expected: "${values.expected}", Got: "${values.received}")` : '';
    return `Text mismatch${diff} — confirm the expected text, normalize whitespace/casing, or use a regex matcher: await expect(locator).toHaveText(/expected/i)`;
  }

  // Selector not found
  if (m.includes('failed to find') || m.includes('no node found') || m.includes('no elements found') || m.includes('no element') || m.includes('not found')) {
    return 'Selector did not match any element. Check the selector, wait for dynamic content, or verify that the feature flag / auth state is correct for the test.';
  }

  // Navigation / network errors
  if (m.includes('navigation failed') || m.includes('net::') || m.includes('ecoff_refused') || m.includes('ecxnrefused') || m.includes('econnrefused') || m.includes('failed to navigate') || m.includes('request failed')) {
    return 'Network/navigation error — ensure the test webServer is running, the baseURL is correct, and external services are mocked. Example: increase webServer timeout or start dependency stubs.';
  }

  // HTTP 4xx/5xx errors
  if (m.includes('status 404') || m.includes('404') || m.includes('status 500') || m.includes('500')) {
    return 'Server returned an unexpected HTTP status. Check backend logs, ensure routes exist, or adjust test to expect the status if intentional.';
  }

  // JS runtime errors
  if (m.includes('referenceerror') || m.includes('typeerror') || m.includes('syntaxerror') || m.includes('uncaught')) {
    return 'A JavaScript runtime error occurred in the app. Inspect stack trace, reproduce locally, and fix the underlying JS/TS error. Consider adding a page.on("console") listener in the test to capture logs.';
  }

  // Assertion / matcher failures
  if (m.includes('expect(') || m.includes('matcher') || m.includes('to equal') || m.includes('to.deep') || m.includes('assert')) {
    return 'Assertion failure — verify the test expectations and the fixture data. Use more specific selectors or adjust test setup to produce deterministic output.';
  }

  // Generic fallback
  return 'Inspect the failure details above. Common fixes: verify selectors, increase timeouts, mock network responses, check server readiness, or update expected assertions.';
}

export default class FixReporter implements Reporter {
  onBegin() {}

  onTestEnd(test: TestCase, result: TestResult) {
    if (result.status === 'passed') return;

    const failures = (result.errors || []).map(e => (e && (e.message || e.value || String(e))) || '').join('\n\n---\n\n');
    const values = extractExpectedVsActual(failures);
    const suggestion = generateSuggestion(failures, values);

    const report = [
      `Test: ${test.title}`,
      `Location: ${test.location?.file ?? 'unknown'}:${test.location?.line ?? '?'}`,
      '',
      'Issue:',
      failures || '(no failure message available)',
      '',
      'Suggested fix:',
      suggestion,
    ].join('\n');

    // Print to console so it shows in CI logs
    // Keep output obvious and separated
    // eslint-disable-next-line no-console
    console.log('\n==== [FixReporter] Detailed Failure Report ====\n' + report + '\n==== [End FixReporter] ====\n');

    // Also write a file under test-results/fix-reports for later inspection
    try {
      const outDir = path.join(process.cwd(), 'test-results', 'fix-reports');
      fs.mkdirSync(outDir, { recursive: true });
      const filePath = path.join(outDir, `${sanitizeFileName(test.title)}.txt`);
      fs.writeFileSync(filePath, report, { encoding: 'utf8' });
    } catch (err) {
      // ignore write errors
    }
  }
}
