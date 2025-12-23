import { test, expect } from './utils/test-helpers';

test.describe('Dashboard Page', () => {
  test('DASH-R1: User can view dashboard with stat cards and overview', async ({ page }) => {
    await page.goto('/');
    // Use main locator for app pages - cleaner snapshots without sidebar/header
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Dashboard" [level=1]
        - button "Download"
        - tablist:
          - tab "Overview" [selected]
          - tab "Analytics"
          - tab "Reports" [disabled]
          - tab "Notifications" [disabled]
        - tabpanel "Overview":
          - text: Total Revenue
          - img
          - text: /\\$\\d+,\\d+\\.\\d+/
          - paragraph: /\\+\\d+\\.\\d+% from last month/
          - text: Subscriptions
          - img
          - text: ""
          - paragraph: /\\+\\d+\\.\\d+% from last month/
          - text: ""
          - img
          - text: ""
          - paragraph: /\\+\\d+% from last month/
          - text: Active Now
          - img
          - text: ""
          - paragraph: /\\+\\d+ since last hour/
          - text: ""
          - application: /Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec \\$0 \\$\\d+ \\$\\d+ \\$\\d+ \\$\\d+/
          - text: /Recent Sales You made \\d+ sales this month\\. OM/
          - paragraph: Olivia Martin
          - paragraph: olivia.martin@email.com
          - text: /\\+\\$\\d+,\\d+\\.\\d+ JL/
          - paragraph: Jackson Lee
          - paragraph: jackson.lee@email.com
          - text: /\\+\\$\\d+\\.\\d+ IN/
          - paragraph: Isabella Nguyen
          - paragraph: isabella.nguyen@email.com
          - text: /\\+\\$\\d+\\.\\d+ WK/
          - paragraph: William Kim
          - paragraph: will@email.com
          - text: /\\+\\$\\d+\\.\\d+ SD/
          - paragraph: Sofia Davis
          - paragraph: sofia.davis@email.com
          - text: ""
    `);
  });
});

test.describe('Dashboard Tab Navigation', () => {
  test('DASH-W1: User can switch to Analytics tab', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: /analytics/i }).click();
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Dashboard" [level=1]
        - button "Download"
        - tablist:
          - tab "Overview"
          - tab "Analytics" [selected]
          - tab "Reports" [disabled]
          - tab "Notifications" [disabled]
        - tabpanel "Analytics":
          - text: Traffic Overview Weekly clicks and unique visitors
          - application: /Mon Tue Wed Thu Fri Sat Sun 0 \\d+ \\d+ \\d+ \\d+/
          - text: Total Clicks
          - img
          - text: ""
          - paragraph: /\\+\\d+\\.\\d+% vs last week/
          - text: Unique Visitors
          - img
          - text: ""
          - paragraph: +5.8% vs last week
          - text: Bounce Rate
          - img
          - text: ""
          - paragraph: "-3.2% vs last week"
          - text: Avg. Session
          - img
          - text: ""
          - paragraph: /\\+\\d+[hmsp]+ vs last week/
          - text: Referrers Top sources driving traffic
          - list:
            - listitem: /Direct \\d+/
            - listitem: /Product Hunt \\d+/
            - listitem: /Twitter \\d+/
            - listitem: /Blog \\d+/
          - text: Devices How users access your app
          - list:
            - listitem: /Desktop \\d+%/
            - listitem: /Mobile \\d+%/
            - listitem: Tablet 4%
    `);
  });

  test('DASH-W2: User can return to Overview from Analytics', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: /analytics/i }).click();
    await page.getByRole('tab', { name: /overview/i }).click();
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Dashboard" [level=1]
        - button "Download"
        - tablist:
          - tab "Overview" [selected]
          - tab "Analytics"
          - tab "Reports" [disabled]
          - tab "Notifications" [disabled]
        - tabpanel "Overview":
          - text: Total Revenue
          - img
          - text: /\\$\\d+,\\d+\\.\\d+/
          - paragraph: /\\+\\d+\\.\\d+% from last month/
          - text: Subscriptions
          - img
          - text: ""
          - paragraph: /\\+\\d+\\.\\d+% from last month/
          - text: ""
          - img
          - text: ""
          - paragraph: /\\+\\d+% from last month/
          - text: Active Now
          - img
          - text: ""
          - paragraph: /\\+\\d+ since last hour/
          - text: ""
          - application: /Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec \\$0 \\$\\d+ \\$\\d+ \\$\\d+ \\$\\d+/
          - text: /Recent Sales You made \\d+ sales this month\\. OM/
          - paragraph: Olivia Martin
          - paragraph: olivia.martin@email.com
          - text: /\\+\\$\\d+,\\d+\\.\\d+ JL/
          - paragraph: Jackson Lee
          - paragraph: jackson.lee@email.com
          - text: /\\+\\$\\d+\\.\\d+ IN/
          - paragraph: Isabella Nguyen
          - paragraph: isabella.nguyen@email.com
          - text: /\\+\\$\\d+\\.\\d+ WK/
          - paragraph: William Kim
          - paragraph: will@email.com
          - text: /\\+\\$\\d+\\.\\d+ SD/
          - paragraph: Sofia Davis
          - paragraph: sofia.davis@email.com
          - text: ""
    `);
  });
});
