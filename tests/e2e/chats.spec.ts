import { test, expect } from './utils/test-helpers';
import { createTestChat, createTestMessage, testChats } from './utils/seed-data';
import { seedAndNavigate } from './utils/seed-helpers';

test.describe('Chats Page', () => {
  test('CHT-R1: User can view chats list with seeded data', async ({ page }) => {
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
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Inbox" [level=1]
        - button
        - text: Search
        - textbox "Search":
          - /placeholder: Search chat...
        - button "john_doe John Doe Hello there!"
        - button /jane_smith Jane Smith Meeting at \\d+[hmsp]+\\?/
        - heading "Your messages" [level=1]
        - paragraph: Send a message to start a chat.
        - button "Send message"
    `);
  });

  test('CHT-R2: User can view empty state when no chat selected', async ({ page }) => {
    await seedAndNavigate(page, '/chats', { chats: testChats });
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Inbox" [level=1]
        - button
        - text: Search
        - textbox "Search":
          - /placeholder: Search chat...
        - button "john_doe John Doe Hey, how are you?"
        - button /jane_smith Jane Smith Meeting at \\d+[hmsp]+\\?/
        - heading "Your messages" [level=1]
        - paragraph: Send a message to start a chat.
        - button "Send message"
    `);
  });

  test('CHT-R3: User can view last message preview with You prefix', async ({ page }) => {
    const chats = [
      createTestChat('chat-001', 'john_doe', 'John Doe', [
        createTestMessage('You', 'My last message'),
      ]),
    ];
    await seedAndNavigate(page, '/chats', { chats });
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Inbox" [level=1]
        - button
        - text: Search
        - textbox "Search":
          - /placeholder: Search chat...
        - 'button "john_doe John Doe You: My last message"'
        - heading "Your messages" [level=1]
        - paragraph: Send a message to start a chat.
        - button "Send message"
    `);
  });
});

test.describe('Chats Search', () => {
  test('CHT-W1: User can filter chats by name', async ({ page }) => {
    const chats = [
      createTestChat('chat-001', 'john_doe', 'John Doe', [
        createTestMessage('John Doe', 'Hello'),
      ]),
      createTestChat('chat-002', 'jane_smith', 'Jane Smith', [
        createTestMessage('Jane Smith', 'Hi'),
      ]),
    ];
    await seedAndNavigate(page, '/chats', { chats });
    await page.getByPlaceholder(/search/i).fill('John');
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Inbox" [level=1]
        - button
        - text: Search
        - textbox "Search":
          - /placeholder: Search chat...
          - text: ""
        - button "john_doe John Doe Hello"
        - heading "Your messages" [level=1]
        - paragraph: Send a message to start a chat.
        - button "Send message"
    `);
  });

  test('CHT-W2: User can clear search to show all chats', async ({ page }) => {
    const chats = [
      createTestChat('chat-001', 'john_doe', 'John Doe', [
        createTestMessage('John Doe', 'Hello'),
      ]),
      createTestChat('chat-002', 'jane_smith', 'Jane Smith', [
        createTestMessage('Jane Smith', 'Hi'),
      ]),
    ];
    await seedAndNavigate(page, '/chats', { chats });
    await page.getByPlaceholder(/search/i).fill('John');
    await page.getByPlaceholder(/search/i).clear();
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Inbox" [level=1]
        - button
        - text: Search
        - textbox "Search":
          - /placeholder: Search chat...
        - button "john_doe John Doe Hello"
        - button "jane_smith Jane Smith Hi"
        - heading "Your messages" [level=1]
        - paragraph: Send a message to start a chat.
        - button "Send message"
    `);
  });
});

test.describe('Chats Conversation View', () => {
  test('CHT-W3: User can select a chat to view conversation', async ({ page }) => {
    const chats = [
      createTestChat('chat-001', 'john_doe', 'John Doe', [
        createTestMessage('John Doe', 'Hello there!'),
        createTestMessage('You', 'Hi John, how are you?'),
      ]),
    ];
    await seedAndNavigate(page, '/chats', { chats });
    await page.getByRole('button', { name: /john doe/i }).click();
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Inbox" [level=1]
        - button
        - text: Search
        - textbox "Search":
          - /placeholder: Search chat...
        - button "john_doe John Doe Hello there!"
        - text: john_doe John Doe Test User
        - button
        - button
        - button
        - text: /Hello there! 2:\\d+ PM Hi John, how are you\\? 2:\\d+ PM \\d+ Dec, \\d+/
        - button
        - button
        - button
        - text: Chat Text Box
        - textbox "Chat Text Box":
          - /placeholder: Type your messages...
        - button
    `);
  });

  test('CHT-W4: User can type a message in the input', async ({ page }) => {
    const chats = [
      createTestChat('chat-001', 'john_doe', 'John Doe', [
        createTestMessage('John Doe', 'Hello'),
      ]),
    ];
    await seedAndNavigate(page, '/chats', { chats });
    await page.getByRole('button', { name: /john doe/i }).click();
    await page.getByPlaceholder(/type your messages/i).fill('Test message');
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Inbox" [level=1]
        - button
        - text: Search
        - textbox "Search":
          - /placeholder: Search chat...
        - button "john_doe John Doe Hello"
        - text: john_doe John Doe Test User
        - button
        - button
        - button
        - text: /Hello 2:\\d+ PM \\d+ Dec, \\d+/
        - button
        - button
        - button
        - text: Chat Text Box
        - textbox "Chat Text Box":
          - /placeholder: Type your messages...
          - text: ""
        - button
    `);
  });
});

test.describe('Chats New Conversation', () => {
  test('CHT-W5: User can open new chat dialog', async ({ page }) => {
    await seedAndNavigate(page, '/chats', { chats: testChats });
    await page.getByRole('button', { name: /send message/i }).click();
    await expect(page.getByRole('dialog')).toMatchAriaSnapshot(`
      - dialog "New message":
        - heading "New message" [level=2]
        - text: ""
        - combobox [expanded]
        - listbox "Suggestions":
          - group:
            - option "John Doe John Doe john_doe" [selected]:
              - img "John Doe"
              - text: ""
            - option "Jane Smith Jane Smith jane_smith":
              - img "Jane Smith"
              - text: ""
        - button "Chat" [disabled]
        - button "Close"
    `);
  });
});
