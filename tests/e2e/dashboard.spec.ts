import { test, expect } from './utils/test-helpers';
import { DashboardPage } from './utils/page-objects';

test.describe('Dashboard Page', () => {
  test('READ-DISPLAY: should display dashboard with all stat cards', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const dashboardPage = new DashboardPage(page);
    
    // Verify heading
    await expect(dashboardPage.heading).toBeVisible();
    
    // Verify all stat cards are visible
    await expect(page.getByText('Total Revenue', { exact: true })).toBeVisible();
    await expect(page.getByText('$45,231.89')).toBeVisible();
    
    await expect(page.getByText('Subscriptions', { exact: true })).toBeVisible();
    await expect(page.getByText('+2350')).toBeVisible();
    
    await expect(page.getByText('Sales', { exact: true })).toBeVisible();
    await expect(page.getByText('+12,234')).toBeVisible();
    
    await expect(page.getByText('Active Now', { exact: true })).toBeVisible();
    await expect(page.getByText('+573')).toBeVisible();
  });

  test('READ-TABS: should display tabs and default to Overview', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const dashboardPage = new DashboardPage(page);
    
    // Verify tabs are visible
    await expect(dashboardPage.overviewTab).toBeVisible();
    await expect(dashboardPage.analyticsTab).toBeVisible();
    await expect(dashboardPage.reportsTab).toBeVisible();
    await expect(dashboardPage.notificationsTab).toBeVisible();
    
    // Verify Overview tab is selected by default
    await expect(dashboardPage.overviewTab).toHaveAttribute('data-state', 'active');
  });

  test('READ-OVERVIEW: should display Overview chart and Recent Sales', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Verify Overview section content - use CardTitle selector
    await expect(page.locator('[data-slot="card-title"]').filter({ hasText: 'Overview' })).toBeVisible();
    await expect(page.locator('[data-slot="card-title"]').filter({ hasText: 'Recent Sales' })).toBeVisible();
    await expect(page.getByText('You made 265 sales this month.')).toBeVisible();
  });

  test('READ-DOWNLOAD: should display download button', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const dashboardPage = new DashboardPage(page);
    await expect(dashboardPage.downloadButton).toBeVisible();
  });
});

test.describe('Dashboard Tab Navigation', () => {
  test('WRITE-TAB-SWITCH: should switch to Analytics tab', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const dashboardPage = new DashboardPage(page);
    
    // Click Analytics tab
    await dashboardPage.switchToAnalytics();
    
    // Verify Analytics tab is now active
    await expect(dashboardPage.analyticsTab).toHaveAttribute('data-state', 'active');
    await expect(dashboardPage.overviewTab).toHaveAttribute('data-state', 'inactive');
  });

  test('WRITE-TAB-DISABLED: should not allow clicking disabled tabs', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const dashboardPage = new DashboardPage(page);
    
    // Verify Reports and Notifications tabs are disabled
    await expect(dashboardPage.reportsTab).toBeDisabled();
    await expect(dashboardPage.notificationsTab).toBeDisabled();
  });

  test('WRITE-TAB-RETURN: should return to Overview from Analytics', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const dashboardPage = new DashboardPage(page);
    
    // Switch to Analytics
    await dashboardPage.switchToAnalytics();
    await expect(dashboardPage.analyticsTab).toHaveAttribute('data-state', 'active');
    
    // Switch back to Overview
    await dashboardPage.switchToOverview();
    await expect(dashboardPage.overviewTab).toHaveAttribute('data-state', 'active');
    
    // Verify Overview content is visible again
    await expect(page.locator('[data-slot="card-title"]').filter({ hasText: 'Overview' })).toBeVisible();
  });
});
