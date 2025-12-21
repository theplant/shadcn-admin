import type { Page } from '@playwright/test';
import type { Task, User, App, ChatConversation } from '../../../src/api/generated/models';
import { STORAGE_KEYS } from './seed-data';

export interface SeedData {
  tasks?: Task[];
  users?: User[];
  apps?: App[];
  chats?: ChatConversation[];
}

export async function seedAndNavigate(
  page: Page,
  targetRoute: string,
  data: SeedData
): Promise<void> {
  // 1. Navigate to app first (initialize MSW, access localStorage)
  await page.goto('/');

  // 2. Seed test data
  await page.evaluate(({ data, keys }) => {
    if (data.tasks !== undefined) {
      localStorage.setItem(keys.TASKS, JSON.stringify(data.tasks));
    }
    if (data.users !== undefined) {
      localStorage.setItem(keys.USERS, JSON.stringify(data.users));
    }
    if (data.apps !== undefined) {
      localStorage.setItem(keys.APPS, JSON.stringify(data.apps));
    }
    if (data.chats !== undefined) {
      localStorage.setItem(keys.CHATS, JSON.stringify(data.chats));
    }
  }, { data, keys: STORAGE_KEYS });

  // 3. CRITICAL: Reload to force re-hydration
  await page.reload();

  // 4. Navigate to target route
  if (targetRoute !== '/') {
    await page.goto(targetRoute);
  }
}

export async function clearTestData(page: Page): Promise<void> {
  await page.evaluate((keys) => {
    Object.values(keys).forEach(key => {
      localStorage.removeItem(key);
    });
  }, STORAGE_KEYS);
}

export async function seedTasks(page: Page, tasks: Task[]): Promise<void> {
  await page.evaluate(({ tasks, key }) => {
    localStorage.setItem(key, JSON.stringify(tasks));
  }, { tasks, key: STORAGE_KEYS.TASKS });
}

export async function seedUsers(page: Page, users: User[]): Promise<void> {
  await page.evaluate(({ users, key }) => {
    localStorage.setItem(key, JSON.stringify(users));
  }, { users, key: STORAGE_KEYS.USERS });
}

export async function seedApps(page: Page, apps: App[]): Promise<void> {
  await page.evaluate(({ apps, key }) => {
    localStorage.setItem(key, JSON.stringify(apps));
  }, { apps, key: STORAGE_KEYS.APPS });
}

export async function seedChats(page: Page, chats: ChatConversation[]): Promise<void> {
  await page.evaluate(({ chats, key }) => {
    localStorage.setItem(key, JSON.stringify(chats));
  }, { chats, key: STORAGE_KEYS.CHATS });
}
