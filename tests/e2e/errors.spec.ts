import { test, expect } from './utils/test-helpers';

test.describe('Error Pages', () => {
  test('ERR-R1: User can view 401 unauthorized error page', async ({ page }) => {
    await page.goto('/401');
    await expect(page.locator('body')).toMatchAriaSnapshot(`
      - heading /\\d+/ [level=1]
      - text: Unauthorized Access
      - paragraph: Please log in with the appropriate credentials to access this resource.
      - button "Go Back"
      - button "Back to Home"
      - region "Notifications alt+T"
      - button "Open Tanstack query devtools":
        - img
      - contentinfo:
        - button "Open TanStack Router Devtools":
          - img
          - img
          - text: ""
    `);
  });

  test('ERR-R2: User can view 403 forbidden error page', async ({ page }) => {
    await page.goto('/403');
    await expect(page.locator('body')).toMatchAriaSnapshot(`
      - heading /\\d+/ [level=1]
      - text: Access Forbidden
      - paragraph: You don't have necessary permission to view this resource.
      - button "Go Back"
      - button "Back to Home"
      - region "Notifications alt+T"
      - button "Open Tanstack query devtools":
        - img
      - contentinfo:
        - button "Open TanStack Router Devtools":
          - img
          - img
          - text: ""
    `);
  });

  test('ERR-R3: User can view 404 not found error page', async ({ page }) => {
    await page.goto('/404');
    await expect(page.locator('body')).toMatchAriaSnapshot(`
      - heading /\\d+/ [level=1]
      - text: Oops! Page Not Found!
      - paragraph: It seems like the page you're looking for does not exist or might have been removed.
      - button "Go Back"
      - button "Back to Home"
      - region "Notifications alt+T"
      - button "Open Tanstack query devtools":
        - img
      - contentinfo:
        - button "Open TanStack Router Devtools":
          - img
          - img
          - text: ""
    `);
  });

  test('ERR-R4: User can view 500 server error page', async ({ page }) => {
    await page.goto('/500');
    await expect(page.locator('body')).toMatchAriaSnapshot(`
      - heading /\\d+/ [level=1]
      - text: Oops! Something went wrong :')
      - paragraph: We apologize for the inconvenience. Please try again later.
      - button "Go Back"
      - button "Back to Home"
      - region "Notifications alt+T"
      - button "Open Tanstack query devtools":
        - img
      - contentinfo:
        - button "Open TanStack Router Devtools":
          - img
          - img
          - text: ""
    `);
  });

  test('ERR-R5: User can view 503 service unavailable page', async ({ page }) => {
    await page.goto('/503');
    await expect(page.locator('body')).toMatchAriaSnapshot(`
      - heading /\\d+/ [level=1]
      - text: Website is under maintenance!
      - paragraph: The site is not available at the moment. We'll be back online shortly.
      - button "Learn more"
      - region "Notifications alt+T"
      - button "Open Tanstack query devtools":
        - img
      - contentinfo:
        - button "Open TanStack Router Devtools":
          - img
          - img
          - text: ""
    `);
  });
});
