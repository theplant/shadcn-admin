import type { Page, Locator } from '@playwright/test';

export class AppsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly typeFilter: Locator;
  readonly sortButton: Locator;
  readonly appCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /app integrations/i });
    this.searchInput = page.getByPlaceholder(/filter apps/i);
    this.typeFilter = page.getByRole('combobox').first();
    this.sortButton = page.getByRole('combobox').last();
    this.appCards = page.locator('li').filter({ has: page.locator('h2') });
  }

  async goto() {
    await this.page.goto('/apps');
    await this.page.waitForLoadState('networkidle');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
  }

  async filterByType(type: 'all' | 'connected' | 'notConnected') {
    await this.typeFilter.click();
    const optionText = type === 'all' ? 'All Apps' : type === 'connected' ? 'Connected' : 'Not Connected';
    await this.page.getByRole('option', { name: optionText, exact: true }).click();
  }

  async sortAscending() {
    await this.sortButton.click();
    await this.page.getByRole('option', { name: /ascending/i }).click();
  }

  async sortDescending() {
    await this.sortButton.click();
    await this.page.getByRole('option', { name: /descending/i }).click();
  }

  async getAppCount(): Promise<number> {
    return await this.appCards.count();
  }

  async getAppNames(): Promise<string[]> {
    const names: string[] = [];
    const count = await this.appCards.count();
    for (let i = 0; i < count; i++) {
      const name = await this.appCards.nth(i).locator('h2').textContent();
      if (name) names.push(name);
    }
    return names;
  }
}
