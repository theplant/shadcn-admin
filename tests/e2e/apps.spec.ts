import { test, expect } from './utils/test-helpers';
import { createTestApp, testApps } from './utils/seed-data';
import { seedAndNavigate } from './utils/seed-helpers';

test.describe('Apps Page', () => {
  test('APP-R1: User can view apps list with seeded data', async ({ page }) => {
    const apps = [
      createTestApp('app-001', 'Slack', 'Team communication platform', true),
      createTestApp('app-002', 'GitHub', 'Code repository and collaboration', false),
    ];
    await seedAndNavigate(page, '/apps', { apps });
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "App Integrations" [level=1]
        - paragraph: Here's a list of your apps for the integration!
        - textbox "Filter apps..."
        - combobox: All Apps
        - combobox
        - list:
          - listitem:
            - img "GitHub"
            - button "Connect"
            - heading "GitHub" [level=2]
            - paragraph: Code repository and collaboration
          - listitem:
            - img "Slack"
            - button "Connected"
            - heading "Slack" [level=2]
            - paragraph: Team communication platform
    `);
  });

  test('APP-R2: User can view empty apps list', async ({ page }) => {
    await seedAndNavigate(page, '/apps', { apps: [] });
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "App Integrations" [level=1]
        - paragraph: Here's a list of your apps for the integration!
        - textbox "Filter apps..."
        - combobox: All Apps
        - combobox
        - list
    `);
  });

  test('APP-R3: User can view apps with connection status', async ({ page }) => {
    const apps = [
      createTestApp('app-001', 'Connected App', 'This app is connected', true),
      createTestApp('app-002', 'Disconnected App', 'This app is not connected', false),
    ];
    await seedAndNavigate(page, '/apps', { apps });
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "App Integrations" [level=1]
        - paragraph: Here's a list of your apps for the integration!
        - textbox "Filter apps..."
        - combobox: All Apps
        - combobox
        - list:
          - listitem:
            - button "Connected"
            - heading "Connected App" [level=2]
            - paragraph: This app is connected
          - listitem:
            - button "Connect"
            - heading "Disconnected App" [level=2]
            - paragraph: This app is not connected
    `);
  });
});

test.describe('Apps Filtering', () => {
  test('APP-W1: User can filter apps by name', async ({ page }) => {
    await seedAndNavigate(page, '/apps', { apps: testApps });
    await page.getByPlaceholder(/filter apps/i).fill('Slack');
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "App Integrations" [level=1]
        - paragraph: Here's a list of your apps for the integration!
        - textbox "Filter apps..."
        - combobox: All Apps
        - combobox
        - list:
          - listitem:
            - img "Slack"
            - button "Connected"
            - heading "Slack" [level=2]
            - paragraph: Team communication platform
    `);
  });

  test('APP-W2: User can filter to show only connected apps', async ({ page }) => {
    const apps = [
      createTestApp('app-001', 'Slack', 'Connected app', true),
      createTestApp('app-002', 'Figma', 'Not connected app', false),
    ];
    await seedAndNavigate(page, '/apps', { apps });
    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: 'Connected', exact: true }).click();
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "App Integrations" [level=1]
        - paragraph: Here's a list of your apps for the integration!
        - textbox "Filter apps..."
        - combobox: Connected
        - combobox
        - list:
          - listitem:
            - img "Slack"
            - button "Connected"
            - heading "Slack" [level=2]
            - paragraph: Connected app
    `);
  });

  test('APP-W3: User can filter to show only not connected apps', async ({ page }) => {
    const apps = [
      createTestApp('app-001', 'Slack', 'Connected app', true),
      createTestApp('app-002', 'Figma', 'Not connected app', false),
    ];
    await seedAndNavigate(page, '/apps', { apps });
    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: 'Not Connected' }).click();
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "App Integrations" [level=1]
        - paragraph: Here's a list of your apps for the integration!
        - textbox "Filter apps..."
        - combobox: Not Connected
        - combobox
        - list:
          - listitem:
            - img "Figma"
            - button "Connect"
            - heading "Figma" [level=2]
            - paragraph: Not connected app
    `);
  });
});

test.describe('Apps Sorting', () => {
  test('APP-W4: User can sort apps in ascending order', async ({ page }) => {
    const apps = [
      createTestApp('app-001', 'Zoom', 'Video conferencing', true),
      createTestApp('app-002', 'Asana', 'Project management', false),
      createTestApp('app-003', 'Notion', 'All-in-one workspace', true),
    ];
    await seedAndNavigate(page, '/apps', { apps });
    // Click the sort combobox (second one on the page)
    await page.getByRole('combobox').nth(1).click();
    await page.getByRole('option', { name: /ascending/i }).click();
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "App Integrations" [level=1]
        - paragraph: Here's a list of your apps for the integration!
        - textbox "Filter apps..."
        - combobox: All Apps
        - combobox
        - list:
          - listitem:
            - button "Connect"
            - heading "Asana" [level=2]
            - paragraph: Project management
          - listitem:
            - img "Notion"
            - button "Connected"
            - heading "Notion" [level=2]
            - paragraph: All-in-one workspace
          - listitem:
            - img "Zoom"
            - button "Connected"
            - heading "Zoom" [level=2]
            - paragraph: Video conferencing
    `);
  });

  test('APP-W5: User can sort apps in descending order', async ({ page }) => {
    const apps = [
      createTestApp('app-001', 'Zoom', 'Video conferencing', true),
      createTestApp('app-002', 'Asana', 'Project management', false),
      createTestApp('app-003', 'Notion', 'All-in-one workspace', true),
    ];
    await seedAndNavigate(page, '/apps', { apps });
    // Click the sort combobox (second one on the page)
    await page.getByRole('combobox').nth(1).click();
    await page.getByRole('option', { name: /descending/i }).click();
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "App Integrations" [level=1]
        - paragraph: Here's a list of your apps for the integration!
        - textbox "Filter apps..."
        - combobox: All Apps
        - combobox
        - list:
          - listitem:
            - img "Zoom"
            - button "Connected"
            - heading "Zoom" [level=2]
            - paragraph: Video conferencing
          - listitem:
            - img "Notion"
            - button "Connected"
            - heading "Notion" [level=2]
            - paragraph: All-in-one workspace
          - listitem:
            - button "Connect"
            - heading "Asana" [level=2]
            - paragraph: Project management
    `);
  });
});
