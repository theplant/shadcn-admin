import { test, expect } from './utils/test-helpers';

test.describe('Error Pages', () => {
  test('401: should display unauthorized error page', async ({ page }) => {
    await page.goto('/401');
    await expect(page.getByText(/unauthorized/i)).toBeVisible();
  });

  test('403: should display forbidden error page', async ({ page }) => {
    await page.goto('/403');
    await expect(page.getByText(/forbidden/i)).toBeVisible();
  });

  test('404: should display not found error page', async ({ page }) => {
    await page.goto('/404');
    await expect(page.getByText(/not found/i)).toBeVisible();
  });

  test('500: should display server error page', async ({ page }) => {
    await page.goto('/500');
    await expect(page.getByText(/something went wrong/i)).toBeVisible();
  });

  test('503: should display service unavailable page', async ({ page }) => {
    await page.goto('/503');
    await expect(page.getByText(/maintenance/i)).toBeVisible();
  });
});
