import type { Page, Locator } from '@playwright/test';

export class TasksPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly statusFilter: Locator;
  readonly priorityFilter: Locator;
  readonly resetButton: Locator;
  readonly viewOptionsButton: Locator;
  readonly table: Locator;
  readonly tableRows: Locator;
  readonly noResultsMessage: Locator;
  readonly pagination: Locator;
  readonly previousPageButton: Locator;
  readonly nextPageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /tasks/i });
    this.searchInput = page.getByPlaceholder(/filter by title or id/i);
    this.statusFilter = page.getByRole('button', { name: /status/i });
    this.priorityFilter = page.getByRole('button', { name: /priority/i });
    this.resetButton = page.getByRole('button', { name: /reset/i });
    this.viewOptionsButton = page.getByRole('button', { name: /view/i });
    this.table = page.getByRole('table');
    this.tableRows = page.locator('tbody tr');
    this.noResultsMessage = page.getByText(/no results/i);
    this.pagination = page.locator('[class*="pagination"]');
    this.previousPageButton = page.getByRole('button', { name: /previous/i });
    this.nextPageButton = page.getByRole('button', { name: /next/i });
  }

  async goto() {
    await this.page.goto('/tasks');
    await this.page.waitForLoadState('networkidle');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
  }

  async filterByStatus(status: string) {
    await this.statusFilter.click();
    await this.page.getByRole('option', { name: new RegExp(status, 'i') }).click();
    await this.page.keyboard.press('Escape');
  }

  async filterByPriority(priority: string) {
    await this.priorityFilter.click();
    await this.page.getByRole('option', { name: new RegExp(priority, 'i') }).click();
    await this.page.keyboard.press('Escape');
  }

  async resetFilters() {
    await this.resetButton.click();
  }

  async goToNextPage() {
    await this.nextPageButton.click();
  }

  async goToPreviousPage() {
    await this.previousPageButton.click();
  }

  async getRowCount(): Promise<number> {
    return await this.tableRows.count();
  }
}
