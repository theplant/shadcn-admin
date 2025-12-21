import { test, expect } from './utils/test-helpers';
import { createTestUser, testUsers } from './utils/seed-data';
import { seedAndNavigate } from './utils/seed-helpers';
import { UsersPage } from './utils/page-objects';

// Test data for WRITE path tests
const newUserData = {
  firstName: 'Test',
  lastName: 'NewUser',
  username: 'test_newuser',
  email: 'testnewuser@example.com',
  phoneNumber: '+1987654321',
  role: 'Manager',
  password: 'SecurePass123',
};

const editedUserData = {
  firstName: 'Edited',
  lastName: 'UserName',
};

test.describe('Users Page', () => {
  test('should display users with seeded data', async ({ page }) => {
    const users = [
      createTestUser('user-001', 'john@example.com', 'John', 'Doe', 'active', 'admin'),
      createTestUser('user-002', 'jane@example.com', 'Jane', 'Smith', 'active', 'manager'),
    ];

    await seedAndNavigate(page, '/users', { users });

    await expect(page.getByText('john_doe')).toBeVisible();
    await expect(page.getByText('jane_smith')).toBeVisible();
  });

  test('should show empty state when no users', async ({ page }) => {
    await seedAndNavigate(page, '/users', { users: [] });
    await expect(page.getByText(/no results/i)).toBeVisible();
  });

  test('should filter users by username', async ({ page }) => {
    await seedAndNavigate(page, '/users', { users: testUsers });

    const usersPage = new UsersPage(page);
    await usersPage.search('john');

    await expect(page.getByText('john_doe')).toBeVisible();
    await expect(page.getByText('jane_smith')).not.toBeVisible();
  });

  test('should display user status correctly', async ({ page }) => {
    const users = [
      createTestUser('user-101', 'active@example.com', 'Active', 'User', 'active', 'admin'),
      createTestUser('user-102', 'inactive@example.com', 'Inactive', 'User', 'inactive', 'manager'),
    ];

    await seedAndNavigate(page, '/users', { users });

    await expect(page.getByText('active', { exact: true })).toBeVisible();
    await expect(page.getByText('inactive', { exact: true })).toBeVisible();
  });

  test('should display user roles correctly', async ({ page }) => {
    const users = [
      createTestUser('user-201', 'admin@example.com', 'Admin', 'User', 'active', 'admin'),
      createTestUser('user-202', 'manager@example.com', 'Manager', 'User', 'active', 'manager'),
    ];

    await seedAndNavigate(page, '/users', { users });

    await expect(page.getByText('admin', { exact: true })).toBeVisible();
    await expect(page.getByText('manager', { exact: true })).toBeVisible();
  });
});

test.describe('Users CRUD Operations', () => {
  test('CRUD-CREATE: should create a new user via dialog', async ({ page }) => {
    await seedAndNavigate(page, '/users', { users: [] });

    // Click Add User button
    await page.getByRole('button', { name: /add user/i }).click();

    // Verify dialog opens with correct title
    await expect(page.getByRole('heading', { name: /add new user/i })).toBeVisible();

    // Fill in user form using role-based selectors for specificity
    await page.getByRole('textbox', { name: 'First Name' }).fill(newUserData.firstName);
    await page.getByRole('textbox', { name: 'Last Name' }).fill(newUserData.lastName);
    await page.getByRole('textbox', { name: 'Username' }).fill(newUserData.username);
    await page.getByRole('textbox', { name: 'Email' }).fill(newUserData.email);
    await page.getByRole('textbox', { name: 'Phone Number' }).fill(newUserData.phoneNumber);
    
    // Select role from dropdown
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: newUserData.role }).click();
    
    // Fill password fields
    await page.getByPlaceholder('e.g., S3cur3P@ssw0rd').first().fill(newUserData.password);
    await page.getByPlaceholder('e.g., S3cur3P@ssw0rd').last().fill(newUserData.password);

    // Submit form
    await page.getByRole('button', { name: /save changes/i }).click();

    // Verify success toast
    await expect(page.getByText(/user created successfully/i)).toBeVisible();

    // Verify new user appears in list
    await expect(page.getByText(newUserData.username)).toBeVisible();
  });

  test('CRUD-UPDATE: should edit an existing user via row actions', async ({ page }) => {
    const existingUser = createTestUser('user-edit-001', 'original@example.com', 'Original', 'User', 'active', 'admin');
    await seedAndNavigate(page, '/users', { users: [existingUser] });

    // Verify original user is visible
    await expect(page.getByText('original_user')).toBeVisible();

    // Open row actions menu
    await page.getByRole('button', { name: /open menu/i }).click();

    // Click Edit
    await page.getByRole('menuitem', { name: /edit/i }).click();

    // Verify dialog opens with Edit title
    await expect(page.getByRole('heading', { name: /edit user/i })).toBeVisible();

    // Update first name and last name using role-based selectors
    await page.getByRole('textbox', { name: 'First Name' }).clear();
    await page.getByRole('textbox', { name: 'First Name' }).fill(editedUserData.firstName);
    await page.getByRole('textbox', { name: 'Last Name' }).clear();
    await page.getByRole('textbox', { name: 'Last Name' }).fill(editedUserData.lastName);

    // Submit form
    await page.getByRole('button', { name: /save changes/i }).click();

    // Verify success toast
    await expect(page.getByText(/user updated successfully/i)).toBeVisible();
  });

  test('CRUD-DELETE: should delete a user via row actions with confirmation', async ({ page }) => {
    const userToDelete = createTestUser('user-del-001', 'delete@example.com', 'Delete', 'Me', 'active', 'cashier');
    await seedAndNavigate(page, '/users', { users: [userToDelete] });

    // Verify user is visible
    await expect(page.getByText('delete_me')).toBeVisible();

    // Open row actions menu
    await page.getByRole('button', { name: /open menu/i }).click();

    // Click Delete
    await page.getByRole('menuitem', { name: /delete/i }).click();

    // Verify confirmation dialog appears
    await expect(page.getByText(/delete user/i)).toBeVisible();
    await expect(page.getByText(/are you sure you want to delete/i)).toBeVisible();

    // Type username to confirm deletion
    await page.getByPlaceholder(/enter username to confirm/i).fill('delete_me');

    // Confirm deletion
    await page.getByRole('button', { name: /^delete$/i }).click();

    // Verify success toast
    await expect(page.getByText(/user deleted successfully/i)).toBeVisible();

    // Verify user is removed from list
    await expect(page.getByText('delete_me')).not.toBeVisible();
  });

  test('CRUD-VALIDATION: should show validation errors on empty form submit', async ({ page }) => {
    await seedAndNavigate(page, '/users', { users: [] });

    // Click Add User button
    await page.getByRole('button', { name: /add user/i }).click();

    // Submit empty form
    await page.getByRole('button', { name: /save changes/i }).click();

    // Verify validation errors
    await expect(page.getByText(/first name is required/i)).toBeVisible();
    await expect(page.getByText(/last name is required/i)).toBeVisible();
    await expect(page.getByText(/email is required/i)).toBeVisible();
  });
});
