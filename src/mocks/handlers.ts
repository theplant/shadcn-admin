import { http, HttpResponse } from 'msw';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import type { 
  Task, 
  User, 
  App, 
  ChatConversation,
  CreateTaskRequest,
  UpdateTaskRequest,
  CreateUserRequest,
  UpdateUserRequest,
  LoginRequest,
} from '@/api/generated/models';

// ==================== AUTH HANDLERS ====================
const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as LoginRequest;
    const user = {
      accountNo: 'ACC001',
      email: body.email,
      role: ['user'],
      exp: Date.now() + 24 * 60 * 60 * 1000,
    };
    return HttpResponse.json({
      user,
      accessToken: 'mock-access-token-' + crypto.randomUUID(),
    });
  }),

  http.post('/api/auth/logout', () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.get('/api/auth/me', () => {
    const auth = storage.get<{ user: unknown }>(STORAGE_KEYS.AUTH);
    if (!auth?.user) {
      return HttpResponse.json(
        { code: 'UNAUTHORIZED', message: 'Not authenticated' },
        { status: 401 }
      );
    }
    return HttpResponse.json(auth.user);
  }),
];

// ==================== TASKS HANDLERS ====================
const tasksHandlers = [
  http.get('/api/tasks', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const statusFilter = url.searchParams.getAll('status');
    const priorityFilter = url.searchParams.getAll('priority');
    const filter = url.searchParams.get('filter') || '';

    let tasks = storage.get<Task[]>(STORAGE_KEYS.TASKS) || [];

    // Apply filters
    if (statusFilter.length > 0) {
      tasks = tasks.filter(t => statusFilter.includes(t.status));
    }
    if (priorityFilter.length > 0) {
      tasks = tasks.filter(t => priorityFilter.includes(t.priority));
    }
    if (filter) {
      const lowerFilter = filter.toLowerCase();
      tasks = tasks.filter(t => 
        t.id.toLowerCase().includes(lowerFilter) || 
        t.title.toLowerCase().includes(lowerFilter)
      );
    }

    const total = tasks.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const paginatedTasks = tasks.slice(start, start + pageSize);

    return HttpResponse.json({
      data: paginatedTasks,
      meta: { page, pageSize, total, totalPages },
    });
  }),

  http.get('/api/tasks/:taskId', ({ params }) => {
    const tasks = storage.get<Task[]>(STORAGE_KEYS.TASKS) || [];
    const task = tasks.find(t => t.id === params.taskId);
    if (!task) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: 'Task not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json(task);
  }),

  http.post('/api/tasks', async ({ request }) => {
    const body = await request.json() as CreateTaskRequest;
    const tasks = storage.get<Task[]>(STORAGE_KEYS.TASKS) || [];
    const newTask: Task = {
      ...body,
      id: `TASK-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.unshift(newTask);
    storage.set(STORAGE_KEYS.TASKS, tasks);
    return HttpResponse.json(newTask, { status: 201 });
  }),

  http.put('/api/tasks/:taskId', async ({ params, request }) => {
    const body = await request.json() as UpdateTaskRequest;
    const tasks = storage.get<Task[]>(STORAGE_KEYS.TASKS) || [];
    const index = tasks.findIndex(t => t.id === params.taskId);
    if (index === -1) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: 'Task not found' },
        { status: 404 }
      );
    }
    tasks[index] = {
      ...tasks[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    storage.set(STORAGE_KEYS.TASKS, tasks);
    return HttpResponse.json(tasks[index]);
  }),

  http.delete('/api/tasks/:taskId', ({ params }) => {
    const tasks = storage.get<Task[]>(STORAGE_KEYS.TASKS) || [];
    const filtered = tasks.filter(t => t.id !== params.taskId);
    storage.set(STORAGE_KEYS.TASKS, filtered);
    return new HttpResponse(null, { status: 204 });
  }),
];

// ==================== USERS HANDLERS ====================
const usersHandlers = [
  http.get('/api/users', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const statusFilter = url.searchParams.getAll('status');
    const roleFilter = url.searchParams.getAll('role');
    const usernameFilter = url.searchParams.get('username') || '';

    let users = storage.get<User[]>(STORAGE_KEYS.USERS) || [];

    // Apply filters
    if (statusFilter.length > 0) {
      users = users.filter(u => statusFilter.includes(u.status));
    }
    if (roleFilter.length > 0) {
      users = users.filter(u => roleFilter.includes(u.role));
    }
    if (usernameFilter) {
      const lowerFilter = usernameFilter.toLowerCase();
      users = users.filter(u => u.username.toLowerCase().includes(lowerFilter));
    }

    const total = users.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const paginatedUsers = users.slice(start, start + pageSize);

    return HttpResponse.json({
      data: paginatedUsers,
      meta: { page, pageSize, total, totalPages },
    });
  }),

  http.get('/api/users/:userId', ({ params }) => {
    const users = storage.get<User[]>(STORAGE_KEYS.USERS) || [];
    const user = users.find(u => u.id === params.userId);
    if (!user) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: 'User not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json(user);
  }),

  http.post('/api/users', async ({ request }) => {
    const body = await request.json() as CreateUserRequest;
    const users = storage.get<User[]>(STORAGE_KEYS.USERS) || [];
    const newUser: User = {
      id: crypto.randomUUID(),
      firstName: body.firstName,
      lastName: body.lastName,
      username: `${body.firstName.toLowerCase()}_${body.lastName.toLowerCase()}`,
      email: body.email,
      phoneNumber: body.phoneNumber,
      status: 'active',
      role: body.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    users.unshift(newUser);
    storage.set(STORAGE_KEYS.USERS, users);
    return HttpResponse.json(newUser, { status: 201 });
  }),

  http.put('/api/users/:userId', async ({ params, request }) => {
    const body = await request.json() as UpdateUserRequest;
    const users = storage.get<User[]>(STORAGE_KEYS.USERS) || [];
    const index = users.findIndex(u => u.id === params.userId);
    if (index === -1) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: 'User not found' },
        { status: 404 }
      );
    }
    users[index] = {
      ...users[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    storage.set(STORAGE_KEYS.USERS, users);
    return HttpResponse.json(users[index]);
  }),

  http.delete('/api/users/:userId', ({ params }) => {
    const users = storage.get<User[]>(STORAGE_KEYS.USERS) || [];
    const filtered = users.filter(u => u.id !== params.userId);
    storage.set(STORAGE_KEYS.USERS, filtered);
    return new HttpResponse(null, { status: 204 });
  }),

  http.post('/api/users/invite', async ({ request }) => {
    const body = await request.json() as { email: string; role: string };
    const users = storage.get<User[]>(STORAGE_KEYS.USERS) || [];
    const newUser: User = {
      id: crypto.randomUUID(),
      firstName: 'Invited',
      lastName: 'User',
      username: body.email.split('@')[0],
      email: body.email,
      status: 'invited',
      role: body.role as User['role'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    users.unshift(newUser);
    storage.set(STORAGE_KEYS.USERS, users);
    return HttpResponse.json(newUser, { status: 201 });
  }),
];

// ==================== APPS HANDLERS ====================
const appsHandlers = [
  http.get('/api/apps', ({ request }) => {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const filter = url.searchParams.get('filter') || '';
    const sort = url.searchParams.get('sort') || 'asc';

    let apps = storage.get<App[]>(STORAGE_KEYS.APPS) || [];

    // Apply filters
    if (type === 'connected') {
      apps = apps.filter(a => a.connected);
    } else if (type === 'notConnected') {
      apps = apps.filter(a => !a.connected);
    }

    if (filter) {
      const lowerFilter = filter.toLowerCase();
      apps = apps.filter(a => a.name.toLowerCase().includes(lowerFilter));
    }

    // Sort
    apps.sort((a, b) => 
      sort === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name)
    );

    return HttpResponse.json({ data: apps });
  }),

  http.post('/api/apps/:appId/connect', ({ params }) => {
    const apps = storage.get<App[]>(STORAGE_KEYS.APPS) || [];
    const index = apps.findIndex(a => a.id === params.appId);
    if (index === -1) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: 'App not found' },
        { status: 404 }
      );
    }
    apps[index].connected = true;
    storage.set(STORAGE_KEYS.APPS, apps);
    return HttpResponse.json(apps[index]);
  }),

  http.post('/api/apps/:appId/disconnect', ({ params }) => {
    const apps = storage.get<App[]>(STORAGE_KEYS.APPS) || [];
    const index = apps.findIndex(a => a.id === params.appId);
    if (index === -1) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: 'App not found' },
        { status: 404 }
      );
    }
    apps[index].connected = false;
    storage.set(STORAGE_KEYS.APPS, apps);
    return HttpResponse.json(apps[index]);
  }),
];

// ==================== CHATS HANDLERS ====================
const chatsHandlers = [
  http.get('/api/chats', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';

    let chats = storage.get<ChatConversation[]>(STORAGE_KEYS.CHATS) || [];

    if (search) {
      const lowerSearch = search.toLowerCase();
      chats = chats.filter(c => c.fullName.toLowerCase().includes(lowerSearch));
    }

    return HttpResponse.json({ data: chats });
  }),

  http.get('/api/chats/:chatId', ({ params }) => {
    const chats = storage.get<ChatConversation[]>(STORAGE_KEYS.CHATS) || [];
    const chat = chats.find(c => c.id === params.chatId);
    if (!chat) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: 'Chat not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json(chat);
  }),

  http.post('/api/chats/:chatId/messages', async ({ params, request }) => {
    const body = await request.json() as { message: string };
    const chats = storage.get<ChatConversation[]>(STORAGE_KEYS.CHATS) || [];
    const index = chats.findIndex(c => c.id === params.chatId);
    if (index === -1) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: 'Chat not found' },
        { status: 404 }
      );
    }
    const newMessage = {
      sender: 'You',
      message: body.message,
      timestamp: new Date().toISOString(),
    };
    chats[index].messages.unshift(newMessage);
    storage.set(STORAGE_KEYS.CHATS, chats);
    return HttpResponse.json(newMessage, { status: 201 });
  }),
];

// ==================== DASHBOARD HANDLERS ====================
const dashboardHandlers = [
  http.get('/api/dashboard/stats', () => {
    return HttpResponse.json({
      totalRevenue: { value: 45231.89, change: '+20.1% from last month' },
      subscriptions: { value: 2350, change: '+180.1% from last month' },
      sales: { value: 12234, change: '+19% from last month' },
      activeNow: { value: 573, change: '+201 since last hour' },
    });
  }),

  http.get('/api/dashboard/overview', () => {
    return HttpResponse.json({
      data: [
        { name: 'Jan', total: 1500 },
        { name: 'Feb', total: 2300 },
        { name: 'Mar', total: 3200 },
        { name: 'Apr', total: 4500 },
        { name: 'May', total: 3800 },
        { name: 'Jun', total: 5000 },
        { name: 'Jul', total: 4200 },
        { name: 'Aug', total: 4800 },
        { name: 'Sep', total: 5500 },
        { name: 'Oct', total: 4900 },
        { name: 'Nov', total: 5800 },
        { name: 'Dec', total: 6200 },
      ],
    });
  }),

  http.get('/api/dashboard/recent-sales', () => {
    return HttpResponse.json({
      data: [
        { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: 1999.00 },
        { name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: 39.00 },
        { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: 299.00 },
        { name: 'William Kim', email: 'will@email.com', amount: 99.00 },
        { name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: 39.00 },
      ],
      totalSales: 265,
    });
  }),
];

export const handlers = [
  ...authHandlers,
  ...tasksHandlers,
  ...usersHandlers,
  ...appsHandlers,
  ...chatsHandlers,
  ...dashboardHandlers,
];
