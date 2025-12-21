import type { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly downloadButton: Locator;
  readonly overviewTab: Locator;
  readonly analyticsTab: Locator;
  readonly reportsTab: Locator;
  readonly notificationsTab: Locator;
  readonly totalRevenueCard: Locator;
  readonly subscriptionsCard: Locator;
  readonly salesCard: Locator;
  readonly activeNowCard: Locator;
  readonly overviewChart: Locator;
  readonly recentSalesCard: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /dashboard/i });
    this.downloadButton = page.getByRole('button', { name: /download/i });
    this.overviewTab = page.getByRole('tab', { name: /overview/i });
    this.analyticsTab = page.getByRole('tab', { name: /analytics/i });
    this.reportsTab = page.getByRole('tab', { name: /reports/i });
    this.notificationsTab = page.getByRole('tab', { name: /notifications/i });
    this.totalRevenueCard = page.locator('text=Total Revenue').locator('..');
    this.subscriptionsCard = page.locator('text=Subscriptions').locator('..');
    this.salesCard = page.locator('text=Sales').locator('..');
    this.activeNowCard = page.locator('text=Active Now').locator('..');
    this.overviewChart = page.getByRole('heading', { name: /^overview$/i }).locator('..');
    this.recentSalesCard = page.getByRole('heading', { name: /recent sales/i }).locator('..');
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async switchToAnalytics() {
    await this.analyticsTab.click();
  }

  async switchToOverview() {
    await this.overviewTab.click();
  }
}
