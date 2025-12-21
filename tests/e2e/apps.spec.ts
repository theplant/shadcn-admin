import { test, expect } from './utils/test-helpers';
import { createTestApp, testApps } from './utils/seed-data';
import { seedAndNavigate } from './utils/seed-helpers';
import { AppsPage } from './utils/page-objects';

test.describe('Apps Page', () => {
  test('READ-DISPLAY: should display apps with seeded data', async ({ page }) => {
    const apps = [
      createTestApp('app-001', 'Slack', 'Team communication platform', true),
      createTestApp('app-002', 'GitHub', 'Code repository and collaboration', false),
    ];

    await seedAndNavigate(page, '/apps', { apps });

    await expect(page.getByRole('heading', { name: 'Slack' })).toBeVisible();
    await expect(page.getByText('Team communication platform')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'GitHub' })).toBeVisible();
    await expect(page.getByText('Code repository and collaboration')).toBeVisible();
  });

  test('READ-EMPTY: should show no apps when list is empty', async ({ page }) => {
    await seedAndNavigate(page, '/apps', { apps: [] });
    
    // Verify the page loads but no app cards are visible
    await expect(page.getByRole('heading', { name: /app integrations/i })).toBeVisible();
    // With empty apps, the list should be empty
    const appCards = page.locator('li').filter({ has: page.locator('h2') });
    await expect(appCards).toHaveCount(0);
  });

  test('READ-HEADING: should display page heading and description', async ({ page }) => {
    await seedAndNavigate(page, '/apps', { apps: testApps });

    await expect(page.getByRole('heading', { name: /app integrations/i })).toBeVisible();
    await expect(page.getByText(/here's a list of your apps/i)).toBeVisible();
  });

  test('READ-CONNECTION-STATUS: should display connected and not connected apps', async ({ page }) => {
    const apps = [
      createTestApp('app-001', 'Connected App', 'This app is connected', true),
      createTestApp('app-002', 'Disconnected App', 'This app is not connected', false),
    ];

    await seedAndNavigate(page, '/apps', { apps });

    // Verify Connected button for connected app
    await expect(page.getByRole('button', { name: 'Connected', exact: true })).toBeVisible();
    // Verify Connect button for disconnected app
    await expect(page.getByRole('button', { name: 'Connect', exact: true })).toBeVisible();
  });
});

test.describe('Apps Filtering', () => {
  test('WRITE-SEARCH: should filter apps by name', async ({ page }) => {
    await seedAndNavigate(page, '/apps', { apps: testApps });

    const appsPage = new AppsPage(page);
    await appsPage.search('Slack');

    await expect(page.getByRole('heading', { name: 'Slack' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'GitHub' })).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'Figma' })).not.toBeVisible();
  });

  test('WRITE-FILTER-CONNECTED: should filter to show only connected apps', async ({ page }) => {
    const apps = [
      createTestApp('app-001', 'Slack', 'Connected app', true),
      createTestApp('app-002', 'Figma', 'Not connected app', false),
    ];

    await seedAndNavigate(page, '/apps', { apps });

    const appsPage = new AppsPage(page);
    await appsPage.filterByType('connected');

    await expect(page.getByRole('heading', { name: 'Slack' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Figma' })).not.toBeVisible();
  });

  test('WRITE-FILTER-NOT-CONNECTED: should filter to show only not connected apps', async ({ page }) => {
    const apps = [
      createTestApp('app-001', 'Slack', 'Connected app', true),
      createTestApp('app-002', 'Figma', 'Not connected app', false),
    ];

    await seedAndNavigate(page, '/apps', { apps });

    const appsPage = new AppsPage(page);
    await appsPage.filterByType('notConnected');

    await expect(page.getByRole('heading', { name: 'Figma' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Slack' })).not.toBeVisible();
  });

  test('WRITE-FILTER-ALL: should show all apps when filter is reset', async ({ page }) => {
    const apps = [
      createTestApp('app-001', 'Slack', 'Connected app', true),
      createTestApp('app-002', 'Figma', 'Not connected app', false),
    ];

    await seedAndNavigate(page, '/apps', { apps });

    const appsPage = new AppsPage(page);
    
    // First filter to connected only
    await appsPage.filterByType('connected');
    await expect(page.getByRole('heading', { name: 'Figma' })).not.toBeVisible();
    
    // Then reset to all
    await appsPage.filterByType('all');
    await expect(page.getByRole('heading', { name: 'Slack' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Figma' })).toBeVisible();
  });
});

test.describe('Apps Sorting', () => {
  test('WRITE-SORT-ASC: should sort apps in ascending order', async ({ page }) => {
    const apps = [
      createTestApp('app-001', 'Zoom', 'Video conferencing', true),
      createTestApp('app-002', 'Asana', 'Project management', false),
      createTestApp('app-003', 'Notion', 'All-in-one workspace', true),
    ];

    await seedAndNavigate(page, '/apps', { apps });

    const appsPage = new AppsPage(page);
    await appsPage.sortAscending();

    // Get app names and verify order
    const appNames = await appsPage.getAppNames();
    expect(appNames).toEqual(['Asana', 'Notion', 'Zoom']);
  });

  test('WRITE-SORT-DESC: should sort apps in descending order', async ({ page }) => {
    const apps = [
      createTestApp('app-001', 'Zoom', 'Video conferencing', true),
      createTestApp('app-002', 'Asana', 'Project management', false),
      createTestApp('app-003', 'Notion', 'All-in-one workspace', true),
    ];

    await seedAndNavigate(page, '/apps', { apps });

    const appsPage = new AppsPage(page);
    await appsPage.sortDescending();

    // Get app names and verify order
    const appNames = await appsPage.getAppNames();
    expect(appNames).toEqual(['Zoom', 'Notion', 'Asana']);
  });
});

test.describe('Apps URL State', () => {
  test('WRITE-URL-SEARCH: should persist search filter in URL', async ({ page }) => {
    await seedAndNavigate(page, '/apps', { apps: testApps });

    const appsPage = new AppsPage(page);
    await appsPage.search('Slack');

    // Verify URL contains filter parameter
    await expect(page).toHaveURL(/filter=Slack/);
  });

  test('WRITE-URL-TYPE: should persist type filter in URL', async ({ page }) => {
    await seedAndNavigate(page, '/apps', { apps: testApps });

    const appsPage = new AppsPage(page);
    await appsPage.filterByType('connected');

    // Verify URL contains type parameter
    await expect(page).toHaveURL(/type=connected/);
  });
});
