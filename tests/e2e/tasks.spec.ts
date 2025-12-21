import { test, expect } from './utils/test-helpers';
import { createTestTask, testTasks } from './utils/seed-data';
import { seedAndNavigate } from './utils/seed-helpers';
import { TasksPage } from './utils/page-objects';

// Test data for WRITE path tests
const newTaskData = {
  title: 'New E2E Test Task',
  status: 'In Progress',
  label: 'feature',
  priority: 'high',
};

const editedTaskData = {
  title: 'Edited Task Title',
};

test.describe('Tasks Page', () => {
  test('should display tasks with seeded data', async ({ page }) => {
    const tasks = [
      createTestTask('TASK-1001', 'Implement login feature', 'in progress', 'high', 'feature'),
      createTestTask('TASK-1002', 'Fix navigation bug', 'todo', 'medium', 'bug'),
    ];

    await seedAndNavigate(page, '/tasks', { tasks });

    await expect(page.getByText('TASK-1001')).toBeVisible();
    await expect(page.getByText('Implement login feature')).toBeVisible();
    await expect(page.getByText('TASK-1002')).toBeVisible();
  });

  test('should show empty state when no tasks', async ({ page }) => {
    await seedAndNavigate(page, '/tasks', { tasks: [] });
    await expect(page.getByText(/no results/i)).toBeVisible();
  });

  test('should filter tasks by search', async ({ page }) => {
    await seedAndNavigate(page, '/tasks', { tasks: testTasks });

    const tasksPage = new TasksPage(page);
    await tasksPage.search('login');

    await expect(page.getByText('Implement login feature')).toBeVisible();
    await expect(page.getByText('Fix navigation bug')).not.toBeVisible();
  });

  test('should display task status correctly', async ({ page }) => {
    const tasks = [
      createTestTask('TASK-2001', 'In Progress Task', 'in progress', 'high', 'feature'),
      createTestTask('TASK-2002', 'Done Task', 'done', 'low', 'documentation'),
    ];

    await seedAndNavigate(page, '/tasks', { tasks });

    await expect(page.getByText('In Progress', { exact: true })).toBeVisible();
    await expect(page.getByText('Done', { exact: true })).toBeVisible();
  });

  test('should display task priority correctly', async ({ page }) => {
    const tasks = [
      createTestTask('TASK-3001', 'High Priority Task', 'todo', 'high', 'bug'),
      createTestTask('TASK-3002', 'Low Priority Task', 'todo', 'low', 'feature'),
    ];

    await seedAndNavigate(page, '/tasks', { tasks });

    await expect(page.getByText('High', { exact: true })).toBeVisible();
    await expect(page.getByText('Low', { exact: true })).toBeVisible();
  });
});

test.describe('Tasks CRUD Operations', () => {
  test('CRUD-CREATE: should create a new task via drawer', async ({ page }) => {
    await seedAndNavigate(page, '/tasks', { tasks: [] });

    // Click Create button
    await page.getByRole('button', { name: /create/i }).click();

    // Verify drawer opens with correct title
    await expect(page.getByRole('heading', { name: /create task/i })).toBeVisible();

    // Fill in task form
    await page.getByPlaceholder(/enter a title/i).fill(newTaskData.title);
    
    // Select status from dropdown
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: newTaskData.status }).click();
    
    // Select label (radio button)
    await page.getByRole('radio', { name: /feature/i }).click();
    
    // Select priority (radio button)
    await page.getByRole('radio', { name: /high/i }).click();

    // Submit form
    await page.getByRole('button', { name: /save changes/i }).click();

    // Verify success toast
    await expect(page.getByText(/task created successfully/i)).toBeVisible();

    // Verify new task appears in list
    await expect(page.getByText(newTaskData.title)).toBeVisible();
  });

  test('CRUD-UPDATE: should edit an existing task via row actions', async ({ page }) => {
    const existingTask = createTestTask('TASK-EDIT-001', 'Original Task Title', 'todo', 'medium', 'bug');
    await seedAndNavigate(page, '/tasks', { tasks: [existingTask] });

    // Verify original task is visible
    await expect(page.getByText('Original Task Title')).toBeVisible();

    // Open row actions menu (click the dots button in the row)
    await page.getByRole('button', { name: /open menu/i }).click();

    // Click Edit
    await page.getByRole('menuitem', { name: /edit/i }).click();

    // Verify drawer opens with Update title
    await expect(page.getByRole('heading', { name: /update task/i })).toBeVisible();

    // Clear and update title
    await page.getByPlaceholder(/enter a title/i).clear();
    await page.getByPlaceholder(/enter a title/i).fill(editedTaskData.title);

    // Submit form
    await page.getByRole('button', { name: /save changes/i }).click();

    // Verify success toast
    await expect(page.getByText(/task updated successfully/i)).toBeVisible();

    // Verify updated task appears in list
    await expect(page.getByText(editedTaskData.title)).toBeVisible();
    await expect(page.getByText('Original Task Title')).not.toBeVisible();
  });

  test('CRUD-DELETE: should delete a task via row actions', async ({ page }) => {
    const taskToDelete = createTestTask('TASK-DEL-001', 'Task To Be Deleted', 'todo', 'low', 'documentation');
    await seedAndNavigate(page, '/tasks', { tasks: [taskToDelete] });

    // Verify task is visible
    await expect(page.getByText('Task To Be Deleted')).toBeVisible();

    // Open row actions menu
    await page.getByRole('button', { name: /open menu/i }).click();

    // Click Delete
    await page.getByRole('menuitem', { name: /delete/i }).click();

    // Verify confirmation dialog appears
    await expect(page.getByText(/delete this task/i)).toBeVisible();

    // Confirm deletion
    await page.getByRole('button', { name: /^delete$/i }).click();

    // Verify success toast
    await expect(page.getByText(/task deleted successfully/i)).toBeVisible();

    // Verify task is removed from list
    await expect(page.getByText('Task To Be Deleted')).not.toBeVisible();
  });

  test('CRUD-VALIDATION: should show validation errors on empty form submit', async ({ page }) => {
    await seedAndNavigate(page, '/tasks', { tasks: [] });

    // Click Create button
    await page.getByRole('button', { name: /create/i }).click();

    // Submit empty form
    await page.getByRole('button', { name: /save changes/i }).click();

    // Verify validation errors
    await expect(page.getByText(/title is required/i)).toBeVisible();
  });
});

test.describe('BUG: Duplicate API Requests', () => {
  test('BUG-DUPLICATE-REQUESTS: should only make ONE API request when navigating to tasks page', async ({ page }) => {
    // Bug: Every menu click triggers duplicate API requests
    // Expected: Only ONE request per navigation
    
    await seedAndNavigate(page, '/', { tasks: testTasks });
    
    // Wait for initial page load
    await page.waitForLoadState('networkidle');
    
    // Track API requests to /api/tasks
    const apiRequests: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/api/tasks') && request.method() === 'GET') {
        apiRequests.push(request.url());
      }
    });
    
    // Navigate to Tasks page via sidebar menu
    await page.getByRole('link', { name: 'Tasks' }).click();
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Tasks' })).toBeVisible();
    
    // Verify only ONE request was made
    expect(apiRequests.length).toBe(1);
  });
});
