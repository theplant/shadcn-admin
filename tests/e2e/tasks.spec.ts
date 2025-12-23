import { test, expect } from './utils/test-helpers';
import { createTestTask, testTasks } from './utils/seed-data';
import { seedAndNavigate } from './utils/seed-helpers';

test.describe('Tasks Page', () => {
  test('TSK-R1: User can view tasks list with seeded data', async ({ page }) => {
    const tasks = [
      createTestTask('TASK-1001', 'Implement login feature', 'in progress', 'high', 'feature'),
      createTestTask('TASK-1002', 'Fix navigation bug', 'todo', 'medium', 'bug'),
    ];
    await seedAndNavigate(page, '/tasks', { tasks });
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Tasks" [level=2]
        - paragraph: Here's a list of your tasks for this month!
        - button "Import"
        - button "Create"
        - textbox "Filter by title or ID..."
        - button "Status":
          - img
          - text: ""
        - button "Priority":
          - img
          - text: ""
        - button "View":
          - img
          - text: ""
        - table:
          - rowgroup:
            - row "Select all Task Title Status Priority":
              - columnheader "Select all":
                - checkbox "Select all"
              - columnheader "Task"
              - columnheader "Title":
                - button "Title":
                  - text: ""
                  - img
              - columnheader "Status":
                - button "Status":
                  - text: ""
                  - img
              - columnheader "Priority":
                - button "Priority":
                  - text: ""
                  - img
              - columnheader
          - rowgroup:
            - row /Select row TASK-\\d+ Feature Implement login feature In Progress High Open menu/:
              - cell "Select row":
                - checkbox "Select row"
              - cell /TASK-\\d+/
              - cell "Feature Implement login feature"
              - cell "In Progress"
              - cell "High"
              - cell "Open menu":
                - button "Open menu":
                  - img
                  - text: ""
            - row /Select row TASK-\\d+ Bug Fix navigation bug Todo Medium Open menu/:
              - cell "Select row":
                - checkbox "Select row"
              - cell /TASK-\\d+/
              - cell "Bug Fix navigation bug"
              - cell "Todo"
              - cell "Medium"
              - cell "Open menu":
                - button "Open menu":
                  - img
                  - text: ""
        - combobox: /\\d+/
        - paragraph: Rows per page
        - text: Page 1 of 1
        - button "Go to first page" [disabled]:
          - text: ""
          - img
        - button "Go to previous page" [disabled]:
          - text: ""
          - img
        - button "Go to page 1 1"
        - button "Go to next page" [disabled]:
          - text: ""
          - img
        - button "Go to last page" [disabled]:
          - text: ""
          - img
    `);
  });

  test('TSK-R2: User can view empty state when no tasks', async ({ page }) => {
    await seedAndNavigate(page, '/tasks', { tasks: [] });
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Tasks" [level=2]
        - paragraph: Here's a list of your tasks for this month!
        - button "Import"
        - button "Create"
        - textbox "Filter by title or ID..."
        - button "Status":
          - img
          - text: ""
        - button "Priority":
          - img
          - text: ""
        - button "View":
          - img
          - text: ""
        - table:
          - rowgroup:
            - row "Select all Task Title Status Priority":
              - columnheader "Select all":
                - checkbox "Select all"
              - columnheader "Task"
              - columnheader "Title":
                - button "Title":
                  - text: ""
                  - img
              - columnheader "Status":
                - button "Status":
                  - text: ""
                  - img
              - columnheader "Priority":
                - button "Priority":
                  - text: ""
                  - img
              - columnheader
          - rowgroup:
            - row "No results.":
              - cell "No results."
        - combobox: /\\d+/
        - paragraph: Rows per page
        - text: Page 1 of 0
        - button "Go to first page" [disabled]:
          - text: ""
          - img
        - button "Go to previous page" [disabled]:
          - text: ""
          - img
        - button "Go to next page" [disabled]:
          - text: ""
          - img
        - button "Go to last page" [disabled]:
          - text: ""
          - img
    `);
  });

  test('TSK-R3: User can view tasks with different statuses', async ({ page }) => {
    const tasks = [
      createTestTask('TASK-2001', 'In Progress Task', 'in progress', 'high', 'feature'),
      createTestTask('TASK-2002', 'Done Task', 'done', 'low', 'documentation'),
    ];
    await seedAndNavigate(page, '/tasks', { tasks });
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Tasks" [level=2]
        - paragraph: Here's a list of your tasks for this month!
        - button "Import"
        - button "Create"
        - textbox "Filter by title or ID..."
        - button "Status":
          - img
          - text: ""
        - button "Priority":
          - img
          - text: ""
        - button "View":
          - img
          - text: ""
        - table:
          - rowgroup:
            - row "Select all Task Title Status Priority":
              - columnheader "Select all":
                - checkbox "Select all"
              - columnheader "Task"
              - columnheader "Title":
                - button "Title":
                  - text: ""
                  - img
              - columnheader "Status":
                - button "Status":
                  - text: ""
                  - img
              - columnheader "Priority":
                - button "Priority":
                  - text: ""
                  - img
              - columnheader
          - rowgroup:
            - row /Select row TASK-\\d+ Feature In Progress Task In Progress High Open menu/:
              - cell "Select row":
                - checkbox "Select row"
              - cell /TASK-\\d+/
              - cell "Feature In Progress Task"
              - cell "In Progress"
              - cell "High"
              - cell "Open menu":
                - button "Open menu":
                  - img
                  - text: ""
            - row /Select row TASK-\\d+ Documentation Done Task Done Low Open menu/:
              - cell "Select row":
                - checkbox "Select row"
              - cell /TASK-\\d+/
              - cell "Documentation Done Task"
              - cell "Done"
              - cell "Low"
              - cell "Open menu":
                - button "Open menu":
                  - img
                  - text: ""
        - combobox: /\\d+/
        - paragraph: Rows per page
        - text: Page 1 of 1
        - button "Go to first page" [disabled]:
          - text: ""
          - img
        - button "Go to previous page" [disabled]:
          - text: ""
          - img
        - button "Go to page 1 1"
        - button "Go to next page" [disabled]:
          - text: ""
          - img
        - button "Go to last page" [disabled]:
          - text: ""
          - img
    `);
  });

  test('TSK-R4: User can view tasks with different priorities', async ({ page }) => {
    const tasks = [
      createTestTask('TASK-3001', 'High Priority Task', 'todo', 'high', 'bug'),
      createTestTask('TASK-3002', 'Low Priority Task', 'todo', 'low', 'feature'),
    ];
    await seedAndNavigate(page, '/tasks', { tasks });
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Tasks" [level=2]
        - paragraph: Here's a list of your tasks for this month!
        - button "Import"
        - button "Create"
        - textbox "Filter by title or ID..."
        - button "Status":
          - img
          - text: ""
        - button "Priority":
          - img
          - text: ""
        - button "View":
          - img
          - text: ""
        - table:
          - rowgroup:
            - row "Select all Task Title Status Priority":
              - columnheader "Select all":
                - checkbox "Select all"
              - columnheader "Task"
              - columnheader "Title":
                - button "Title":
                  - text: ""
                  - img
              - columnheader "Status":
                - button "Status":
                  - text: ""
                  - img
              - columnheader "Priority":
                - button "Priority":
                  - text: ""
                  - img
              - columnheader
          - rowgroup:
            - row /Select row TASK-\\d+ Bug High Priority Task Todo High Open menu/:
              - cell "Select row":
                - checkbox "Select row"
              - cell /TASK-\\d+/
              - cell "Bug High Priority Task"
              - cell "Todo"
              - cell "High"
              - cell "Open menu":
                - button "Open menu":
                  - img
                  - text: ""
            - row /Select row TASK-\\d+ Feature Low Priority Task Todo Low Open menu/:
              - cell "Select row":
                - checkbox "Select row"
              - cell /TASK-\\d+/
              - cell "Feature Low Priority Task"
              - cell "Todo"
              - cell "Low"
              - cell "Open menu":
                - button "Open menu":
                  - img
                  - text: ""
        - combobox: /\\d+/
        - paragraph: Rows per page
        - text: Page 1 of 1
        - button "Go to first page" [disabled]:
          - text: ""
          - img
        - button "Go to previous page" [disabled]:
          - text: ""
          - img
        - button "Go to page 1 1"
        - button "Go to next page" [disabled]:
          - text: ""
          - img
        - button "Go to last page" [disabled]:
          - text: ""
          - img
    `);
  });
});

test.describe('Tasks Search and Filter', () => {
  test('TSK-W1: User can filter tasks by search', async ({ page }) => {
    await seedAndNavigate(page, '/tasks', { tasks: testTasks });
    await page.getByPlaceholder(/filter/i).fill('login');
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Tasks" [level=2]
        - paragraph: Here's a list of your tasks for this month!
        - button "Import"
        - button "Create"
        - textbox "Filter by title or ID..."
        - button "Status":
          - img
          - text: ""
        - button "Priority":
          - img
          - text: ""
        - button "Reset":
          - text: ""
          - img
        - button "View":
          - img
          - text: ""
        - table:
          - rowgroup:
            - row "Select all Task Title Status Priority":
              - columnheader "Select all":
                - checkbox "Select all"
              - columnheader "Task"
              - columnheader "Title":
                - button "Title":
                  - text: ""
                  - img
              - columnheader "Status":
                - button "Status":
                  - text: ""
                  - img
              - columnheader "Priority":
                - button "Priority":
                  - text: ""
                  - img
              - columnheader
          - rowgroup:
            - row /Select row TASK-\\d+ Feature Implement login feature In Progress High Open menu/:
              - cell "Select row":
                - checkbox "Select row"
              - cell /TASK-\\d+/
              - cell "Feature Implement login feature"
              - cell "In Progress"
              - cell "High"
              - cell "Open menu":
                - button "Open menu":
                  - img
                  - text: ""
        - combobox: /\\d+/
        - paragraph: Rows per page
        - text: Page 1 of 1
        - button "Go to first page" [disabled]:
          - text: ""
          - img
        - button "Go to previous page" [disabled]:
          - text: ""
          - img
        - button "Go to page 1 1"
        - button "Go to next page" [disabled]:
          - text: ""
          - img
        - button "Go to last page" [disabled]:
          - text: ""
          - img
    `);
  });
});

test.describe('Tasks CRUD Operations', () => {
  test('TSK-W2: User can open create task drawer', async ({ page }) => {
    await seedAndNavigate(page, '/tasks', { tasks: [] });
    await page.getByRole('button', { name: /create/i }).click();
    // Use dialog locator for drawer/modal assertions
    await expect(page.getByRole('dialog')).toMatchAriaSnapshot(`
      - dialog "Create Task":
        - heading "Create Task" [level=2]
        - paragraph: Add a new task by providing necessary info.Click save when you're done.
        - textbox "Title"
        - combobox "Status"
        - radiogroup
        - radiogroup
        - button "Save changes"
    `);
  });

  test('TSK-W3: User can create a new task', async ({ page }) => {
    await seedAndNavigate(page, '/tasks', { tasks: [] });
    await page.getByRole('button', { name: /create/i }).click();
    
    await page.getByPlaceholder(/enter a title/i).fill('New E2E Test Task');
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: 'In Progress' }).click();
    await page.getByRole('radio', { name: /feature/i }).click();
    await page.getByRole('radio', { name: /high/i }).click();
    await page.getByRole('button', { name: /save changes/i }).click();
    
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Tasks" [level=2]
        - paragraph: Here's a list of your tasks for this month!
        - button "Import"
        - button "Create"
        - textbox "Filter by title or ID..."
        - button "Status":
          - img
          - text: ""
        - button "Priority":
          - img
          - text: ""
        - button "View":
          - img
          - text: ""
        - table:
          - rowgroup:
            - row "Select all Task Title Status Priority":
              - columnheader "Select all":
                - checkbox "Select all"
              - columnheader "Task"
              - columnheader "Title":
                - button "Title":
                  - text: ""
                  - img
              - columnheader "Status":
                - button "Status":
                  - text: ""
                  - img
              - columnheader "Priority":
                - button "Priority":
                  - text: ""
                  - img
              - columnheader
          - rowgroup:
            - row /Select row TASK-\\d+ Feature New E2E Test Task In Progress High Open menu/:
              - cell "Select row":
                - checkbox "Select row"
              - cell /TASK-\\d+/
              - cell "Feature New E2E Test Task"
              - cell "In Progress"
              - cell "High"
              - cell "Open menu":
                - button "Open menu":
                  - img
                  - text: ""
        - combobox: /\\d+/
        - paragraph: Rows per page
        - text: Page 1 of 1
        - button "Go to first page" [disabled]:
          - text: ""
          - img
        - button "Go to previous page" [disabled]:
          - text: ""
          - img
        - button "Go to page 1 1"
        - button "Go to next page" [disabled]:
          - text: ""
          - img
        - button "Go to last page" [disabled]:
          - text: ""
          - img
    `);
  });

  test('TSK-W4: User can open edit task drawer', async ({ page }) => {
    const existingTask = createTestTask('TASK-EDIT-001', 'Original Task Title', 'todo', 'medium', 'bug');
    await seedAndNavigate(page, '/tasks', { tasks: [existingTask] });
    await page.getByRole('button', { name: /open menu/i }).click();
    await page.getByRole('menuitem', { name: /edit/i }).click();
    // Use dialog locator for drawer/modal assertions
    await expect(page.getByRole('dialog')).toMatchAriaSnapshot(`
      - dialog "Update Task":
        - heading "Update Task" [level=2]
        - paragraph: Update the task by providing necessary info.Click save when you're done.
        - text: ""
        - textbox "Title":
          - /placeholder: Enter a title
          - text: Original Task Title
        - text: ""
        - combobox "Status"
        - text: ""
        - radiogroup:
          - radio "Documentation"
          - text: Documentation
          - radio "Feature"
          - text: Feature
          - radio "Bug" [checked]
          - text: Bug
        - text: ""
        - radiogroup:
          - radio "High"
          - text: High
          - radio "Medium" [checked]
          - text: Medium
          - radio "Low"
          - text: Low
        - button "Close"
        - button "Save changes"
        - button "Close"
    `);
  });

  test('TSK-W5: User can update an existing task', async ({ page }) => {
    const existingTask = createTestTask('TASK-EDIT-001', 'Original Task Title', 'todo', 'medium', 'bug');
    await seedAndNavigate(page, '/tasks', { tasks: [existingTask] });
    await page.getByRole('button', { name: /open menu/i }).click();
    await page.getByRole('menuitem', { name: /edit/i }).click();
    
    await page.getByPlaceholder(/enter a title/i).clear();
    await page.getByPlaceholder(/enter a title/i).fill('Edited Task Title');
    await page.getByRole('button', { name: /save changes/i }).click();
    
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Tasks" [level=2]
        - paragraph: Here's a list of your tasks for this month!
        - button "Import"
        - button "Create"
        - textbox "Filter by title or ID..."
        - button "Status":
          - img
          - text: ""
        - button "Priority":
          - img
          - text: ""
        - button "View":
          - img
          - text: ""
        - table:
          - rowgroup:
            - row "Select all Task Title Status Priority":
              - columnheader "Select all":
                - checkbox "Select all"
              - columnheader "Task"
              - columnheader "Title":
                - button "Title":
                  - text: ""
                  - img
              - columnheader "Status":
                - button "Status":
                  - text: ""
                  - img
              - columnheader "Priority":
                - button "Priority":
                  - text: ""
                  - img
              - columnheader
          - rowgroup:
            - row /Select row TASK-EDIT-\\d+ Bug Edited Task Title Todo Medium Open menu/:
              - cell "Select row":
                - checkbox "Select row"
              - cell /TASK-EDIT-\\d+/
              - cell "Bug Edited Task Title"
              - cell "Todo"
              - cell "Medium"
              - cell "Open menu":
                - button "Open menu":
                  - img
                  - text: ""
        - combobox: /\\d+/
        - paragraph: Rows per page
        - text: Page 1 of 1
        - button "Go to first page" [disabled]:
          - text: ""
          - img
        - button "Go to previous page" [disabled]:
          - text: ""
          - img
        - button "Go to page 1 1"
        - button "Go to next page" [disabled]:
          - text: ""
          - img
        - button "Go to last page" [disabled]:
          - text: ""
          - img
    `);
  });

  test('TSK-W6: User can open delete confirmation dialog', async ({ page }) => {
    const taskToDelete = createTestTask('TASK-DEL-001', 'Task To Be Deleted', 'todo', 'low', 'documentation');
    await seedAndNavigate(page, '/tasks', { tasks: [taskToDelete] });
    await page.getByRole('button', { name: /open menu/i }).click();
    await page.getByRole('menuitem', { name: /delete/i }).click();
    await expect(page.getByRole('alertdialog')).toMatchAriaSnapshot(`
      - 'alertdialog /Delete this task: TASK-DEL-\\d+ \\?/':
        - 'heading /Delete this task: TASK-DEL-\\d+ \\?/ [level=2]'
        - text: You are about to delete a task with the ID
        - strong: /TASK-DEL-\\d+/
        - text: ""
        - button "Cancel"
        - button "Delete"
    `);
  });

  test('TSK-W7: User can delete a task', async ({ page }) => {
    const taskToDelete = createTestTask('TASK-DEL-001', 'Task To Be Deleted', 'todo', 'low', 'documentation');
    await seedAndNavigate(page, '/tasks', { tasks: [taskToDelete] });
    await page.getByRole('button', { name: /open menu/i }).click();
    await page.getByRole('menuitem', { name: /delete/i }).click();
    await page.getByRole('button', { name: /^delete$/i }).click();
    
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Tasks" [level=2]
        - paragraph: Here's a list of your tasks for this month!
        - button "Import"
        - button "Create"
        - textbox "Filter by title or ID..."
        - button "Status":
          - img
          - text: ""
        - button "Priority":
          - img
          - text: ""
        - button "View":
          - img
          - text: ""
        - table:
          - rowgroup:
            - row "Select all Task Title Status Priority":
              - columnheader "Select all":
                - checkbox "Select all"
              - columnheader "Task"
              - columnheader "Title":
                - button "Title":
                  - text: ""
                  - img
              - columnheader "Status":
                - button "Status":
                  - text: ""
                  - img
              - columnheader "Priority":
                - button "Priority":
                  - text: ""
                  - img
              - columnheader
          - rowgroup:
            - row "No results.":
              - cell "No results."
        - combobox: /\\d+/
        - paragraph: Rows per page
        - text: Page 1 of 0
        - button "Go to first page" [disabled]:
          - text: ""
          - img
        - button "Go to previous page" [disabled]:
          - text: ""
          - img
        - button "Go to next page" [disabled]:
          - text: ""
          - img
        - button "Go to last page" [disabled]:
          - text: ""
          - img
    `);
  });

  test('TSK-W8: Create task form shows validation errors on empty submit', async ({ page }) => {
    await seedAndNavigate(page, '/tasks', { tasks: [] });
    await page.getByRole('button', { name: /create/i }).click();
    await page.getByRole('button', { name: /save changes/i }).click();
    // Use dialog locator for drawer/modal assertions with validation errors
    await expect(page.getByRole('dialog')).toMatchAriaSnapshot(`
      - dialog "Create Task":
        - heading "Create Task" [level=2]
        - paragraph: Add a new task by providing necessary info.Click save when you're done.
        - text: ""
        - textbox "Title":
          - /placeholder: Enter a title
        - paragraph: Title is required.
        - text: ""
        - combobox "Status": Select dropdown
        - paragraph: Please select a status.
        - text: ""
        - radiogroup:
          - radio "Documentation"
          - text: Documentation
          - radio "Feature"
          - text: Feature
          - radio "Bug"
          - text: Bug
        - paragraph: Please select a label.
        - text: ""
        - radiogroup:
          - radio "High"
          - text: High
          - radio "Medium"
          - text: Medium
          - radio "Low"
          - text: Low
        - paragraph: Please choose a priority.
        - button "Close"
        - button "Save changes"
        - button "Close"
    `);
  });
});
