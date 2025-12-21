import { test, expect } from './utils/test-helpers';
import { createTestChat, createTestMessage, testChats } from './utils/seed-data';
import { seedAndNavigate } from './utils/seed-helpers';
import { ChatsPage } from './utils/page-objects';

test.describe('Chats Page', () => {
  test('READ-DISPLAY: should display chats with seeded data', async ({ page }) => {
    const chats = [
      createTestChat('chat-001', 'john_doe', 'John Doe', [
        createTestMessage('John Doe', 'Hello there!'),
        createTestMessage('You', 'Hi John!'),
      ]),
      createTestChat('chat-002', 'jane_smith', 'Jane Smith', [
        createTestMessage('Jane Smith', 'Meeting at 3pm?'),
      ]),
    ];

    await seedAndNavigate(page, '/chats', { chats });

    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('Jane Smith')).toBeVisible();
  });

  test('READ-HEADING: should display Inbox heading', async ({ page }) => {
    await seedAndNavigate(page, '/chats', { chats: testChats });

    await expect(page.getByRole('heading', { name: /inbox/i })).toBeVisible();
  });

  test('READ-EMPTY-STATE: should show empty state when no chat selected', async ({ page }) => {
    await seedAndNavigate(page, '/chats', { chats: testChats });

    const chatsPage = new ChatsPage(page);
    await expect(chatsPage.emptyStateMessage).toBeVisible();
    await expect(chatsPage.sendMessageButton).toBeVisible();
  });

  test('READ-LAST-MESSAGE: should display last message preview in chat list', async ({ page }) => {
    const chats = [
      createTestChat('chat-001', 'john_doe', 'John Doe', [
        createTestMessage('John Doe', 'This is the last message'),
      ]),
    ];

    await seedAndNavigate(page, '/chats', { chats });

    await expect(page.getByText('This is the last message')).toBeVisible();
  });

  test('READ-YOUR-MESSAGE-PREFIX: should prefix your messages with "You:"', async ({ page }) => {
    const chats = [
      createTestChat('chat-001', 'john_doe', 'John Doe', [
        createTestMessage('You', 'My last message'),
      ]),
    ];

    await seedAndNavigate(page, '/chats', { chats });

    await expect(page.getByText('You: My last message')).toBeVisible();
  });
});

test.describe('Chats Search', () => {
  test('WRITE-SEARCH: should filter chats by name', async ({ page }) => {
    const chats = [
      createTestChat('chat-001', 'john_doe', 'John Doe', [
        createTestMessage('John Doe', 'Hello'),
      ]),
      createTestChat('chat-002', 'jane_smith', 'Jane Smith', [
        createTestMessage('Jane Smith', 'Hi'),
      ]),
    ];

    await seedAndNavigate(page, '/chats', { chats });

    const chatsPage = new ChatsPage(page);
    await chatsPage.search('John');

    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('Jane Smith')).not.toBeVisible();
  });

  test('WRITE-SEARCH-CLEAR: should show all chats when search is cleared', async ({ page }) => {
    const chats = [
      createTestChat('chat-001', 'john_doe', 'John Doe', [
        createTestMessage('John Doe', 'Hello'),
      ]),
      createTestChat('chat-002', 'jane_smith', 'Jane Smith', [
        createTestMessage('Jane Smith', 'Hi'),
      ]),
    ];

    await seedAndNavigate(page, '/chats', { chats });

    const chatsPage = new ChatsPage(page);
    
    // Search for John
    await chatsPage.search('John');
    await expect(page.getByText('Jane Smith')).not.toBeVisible();
    
    // Clear search
    await chatsPage.search('');
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('Jane Smith')).toBeVisible();
  });

  test('WRITE-SEARCH-NO-RESULTS: should show no chats when search has no matches', async ({ page }) => {
    const chats = [
      createTestChat('chat-001', 'john_doe', 'John Doe', [
        createTestMessage('John Doe', 'Hello'),
      ]),
    ];

    await seedAndNavigate(page, '/chats', { chats });

    const chatsPage = new ChatsPage(page);
    await chatsPage.search('NonExistentUser');

    await expect(page.getByText('John Doe')).not.toBeVisible();
  });
});

test.describe('Chats Conversation View', () => {
  test('WRITE-SELECT-CHAT: should display conversation when chat is selected', async ({ page }) => {
    const chats = [
      createTestChat('chat-001', 'john_doe', 'John Doe', [
        createTestMessage('John Doe', 'Hello there!'),
        createTestMessage('You', 'Hi John, how are you?'),
      ]),
    ];

    await seedAndNavigate(page, '/chats', { chats });

    const chatsPage = new ChatsPage(page);
    await chatsPage.selectChatByName('John Doe');

    // Verify conversation panel shows user info
    await expect(page.locator('span').filter({ hasText: 'John Doe' }).first()).toBeVisible();
    
    // Verify messages are displayed in the chat box area
    await expect(page.locator('.chat-box').filter({ hasText: 'Hello there!' })).toBeVisible();
    await expect(page.locator('.chat-box').filter({ hasText: 'Hi John, how are you?' })).toBeVisible();
  });

  test('WRITE-MESSAGE-INPUT: should display message input when chat is selected', async ({ page }) => {
    const chats = [
      createTestChat('chat-001', 'john_doe', 'John Doe', [
        createTestMessage('John Doe', 'Hello'),
      ]),
    ];

    await seedAndNavigate(page, '/chats', { chats });

    const chatsPage = new ChatsPage(page);
    await chatsPage.selectChatByName('John Doe');

    await expect(chatsPage.messageInput).toBeVisible();
  });

  test('WRITE-TYPE-MESSAGE: should allow typing in message input', async ({ page }) => {
    const chats = [
      createTestChat('chat-001', 'john_doe', 'John Doe', [
        createTestMessage('John Doe', 'Hello'),
      ]),
    ];

    await seedAndNavigate(page, '/chats', { chats });

    const chatsPage = new ChatsPage(page);
    await chatsPage.selectChatByName('John Doe');
    await chatsPage.typeMessage('Test message');

    await expect(chatsPage.messageInput).toHaveValue('Test message');
  });
});

test.describe('Chats New Conversation', () => {
  test('WRITE-NEW-CHAT-DIALOG: should open new chat dialog', async ({ page }) => {
    await seedAndNavigate(page, '/chats', { chats: testChats });

    // Click the Send message button in empty state
    const chatsPage = new ChatsPage(page);
    await chatsPage.sendMessageButton.click();

    // Verify dialog opens
    await expect(page.getByRole('dialog')).toBeVisible();
  });
});
