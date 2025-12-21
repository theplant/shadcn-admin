import type { 
  Task, 
  User, 
  App, 
  ChatConversation,
  ChatMessage,
  TaskStatus,
  TaskLabel,
  TaskPriority,
  UserStatus,
  UserRole,
} from '../../../../src/api/generated/models';

// Storage keys (must match src/lib/storage.ts)
export const STORAGE_KEYS = {
  TASKS: 'shadcn_admin_tasks',
  USERS: 'shadcn_admin_users',
  APPS: 'shadcn_admin_apps',
  CHATS: 'shadcn_admin_chats',
  DASHBOARD_STATS: 'shadcn_admin_dashboard_stats',
  AUTH: 'shadcn_admin_auth',
} as const;

// Typed test data factory for Tasks
export const createTestTask = (
  id: string,
  title: string,
  status: TaskStatus = 'todo',
  priority: TaskPriority = 'medium',
  label: TaskLabel = 'feature'
): Task => ({
  id,
  title,
  status,
  priority,
  label,
  assignee: 'Test User',
  description: `Description for ${title}`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
});

// Typed test data factory for Users
export const createTestUser = (
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  status: UserStatus = 'active',
  role: UserRole = 'admin'
): User => ({
  id,
  firstName,
  lastName,
  username: `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
  email,
  phoneNumber: '+1234567890',
  status,
  role,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Typed test data factory for Apps
export const createTestApp = (
  id: string,
  name: string,
  desc: string,
  connected: boolean = false
): App => ({
  id,
  name,
  desc,
  connected,
});

// Typed test data factory for Chat Messages
export const createTestMessage = (
  sender: string,
  message: string,
  timestamp?: string
): ChatMessage => ({
  sender,
  message,
  timestamp: timestamp || new Date().toISOString(),
});

// Typed test data factory for Chat Conversations
export const createTestChat = (
  id: string,
  username: string,
  fullName: string,
  messages: ChatMessage[] = []
): ChatConversation => ({
  id,
  username,
  fullName,
  title: 'Test User',
  profile: '',
  messages,
});

// Helper to seed localStorage with test data
export const seedLocalStorage = (key: string, data: unknown): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

// Helper to clear localStorage
export const clearLocalStorage = (): void => {
  if (typeof window !== 'undefined') {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};

// Pre-built test data sets
export const testTasks: Task[] = [
  createTestTask('TASK-1001', 'Implement login feature', 'in progress', 'high', 'feature'),
  createTestTask('TASK-1002', 'Fix navigation bug', 'todo', 'medium', 'bug'),
  createTestTask('TASK-1003', 'Update documentation', 'done', 'low', 'documentation'),
  createTestTask('TASK-1004', 'Add unit tests', 'backlog', 'medium', 'feature'),
  createTestTask('TASK-1005', 'Refactor API layer', 'canceled', 'high', 'feature'),
];

export const testUsers: User[] = [
  createTestUser('user-001', 'john@example.com', 'John', 'Doe', 'active', 'admin'),
  createTestUser('user-002', 'jane@example.com', 'Jane', 'Smith', 'active', 'manager'),
  createTestUser('user-003', 'bob@example.com', 'Bob', 'Wilson', 'inactive', 'cashier'),
  createTestUser('user-004', 'alice@example.com', 'Alice', 'Brown', 'invited', 'admin'),
  createTestUser('user-005', 'charlie@example.com', 'Charlie', 'Davis', 'suspended', 'superadmin'),
];

export const testApps: App[] = [
  createTestApp('app-001', 'Slack', 'Team communication platform', true),
  createTestApp('app-002', 'GitHub', 'Code repository and collaboration', true),
  createTestApp('app-003', 'Figma', 'Design collaboration tool', false),
  createTestApp('app-004', 'Notion', 'All-in-one workspace', false),
  createTestApp('app-005', 'Zoom', 'Video conferencing', true),
];

export const testChats: ChatConversation[] = [
  createTestChat('chat-001', 'john_doe', 'John Doe', [
    createTestMessage('John Doe', 'Hey, how are you?'),
    createTestMessage('You', 'I am good, thanks!'),
  ]),
  createTestChat('chat-002', 'jane_smith', 'Jane Smith', [
    createTestMessage('Jane Smith', 'Meeting at 3pm?'),
    createTestMessage('You', 'Sure, see you then!'),
  ]),
];
