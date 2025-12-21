import type { Page, Locator } from '@playwright/test';

export class ChatsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly newChatButton: Locator;
  readonly chatList: Locator;
  readonly chatItems: Locator;
  readonly messagePanel: Locator;
  readonly messageInput: Locator;
  readonly sendButton: Locator;
  readonly emptyStateMessage: Locator;
  readonly sendMessageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /inbox/i });
    this.searchInput = page.getByPlaceholder(/search chat/i);
    this.newChatButton = page.getByRole('button').filter({ has: page.locator('svg') }).first();
    this.chatList = page.locator('button').filter({ has: page.locator('img, span[class*="avatar"]') });
    this.chatItems = page.locator('button').filter({ has: page.locator('img') });
    this.messagePanel = page.locator('section').locator('div').filter({ has: page.locator('form') });
    this.messageInput = page.getByPlaceholder(/type your messages/i);
    this.sendButton = page.getByRole('button', { name: /send/i });
    this.emptyStateMessage = page.getByText(/send a message to start a chat/i);
    this.sendMessageButton = page.getByRole('button', { name: /send message/i });
  }

  async goto() {
    await this.page.goto('/chats');
    await this.page.waitForLoadState('networkidle');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
  }

  async selectChat(index: number) {
    await this.chatItems.nth(index).click();
  }

  async selectChatByName(name: string) {
    await this.page.locator('button').filter({ hasText: name }).first().click();
  }

  async typeMessage(message: string) {
    await this.messageInput.fill(message);
  }

  async sendMessage() {
    await this.sendButton.click();
  }

  async getChatCount(): Promise<number> {
    return await this.chatItems.count();
  }
}
