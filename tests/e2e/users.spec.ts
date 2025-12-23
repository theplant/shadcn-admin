import { test, expect } from './utils/test-helpers';
import { createTestUser, testUsers } from './utils/seed-data';
import { seedAndNavigate } from './utils/seed-helpers';

test.describe('Users Page', () => {
  test('USR-R1: User can view users list with seeded data', async ({ page }) => {
    const users = [
      createTestUser('user-001', 'john@example.com', 'John', 'Doe', 'active', 'admin'),
      createTestUser('user-002', 'jane@example.com', 'Jane', 'Smith', 'active', 'manager'),
    ];
    await seedAndNavigate(page, '/users', { users });
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "User List" [level=2]
        - paragraph: Manage your users and their roles here.
        - button "Invite User"
        - button "Add User"
        - textbox "Filter users..."
        - button "Status":
          - img
          - text: ""
        - button "Role":
          - img
          - text: ""
        - button "View":
          - img
          - text: ""
        - table:
          - rowgroup:
            - row "Select all Username Name Email Phone Number Status Role":
              - columnheader "Select all":
                - checkbox "Select all"
              - columnheader "Username":
                - button "Username":
                  - text: ""
                  - img
              - columnheader "Name"
              - columnheader "Email":
                - button "Email":
                  - text: ""
                  - img
              - columnheader "Phone Number"
              - columnheader "Status"
              - columnheader "Role"
              - columnheader
          - rowgroup:
            - row /Select row john_doe John Doe john@example\\.com \\+\\d+ active admin Open menu/:
              - cell "Select row":
                - checkbox "Select row"
              - cell "john_doe"
              - cell "John Doe"
              - cell "john@example.com"
              - cell /\\+\\d+/
              - cell "active"
              - cell "admin"
              - cell "Open menu":
                - button "Open menu":
                  - img
                  - text: ""
            - row /Select row jane_smith Jane Smith jane@example\\.com \\+\\d+ active manager Open menu/:
              - cell "Select row":
                - checkbox "Select row"
              - cell "jane_smith"
              - cell "Jane Smith"
              - cell "jane@example.com"
              - cell /\\+\\d+/
              - cell "active"
              - cell "manager"
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

  test('USR-R2: User can view empty state when no users', async ({ page }) => {
    await seedAndNavigate(page, '/users', { users: [] });
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "User List" [level=2]
        - paragraph: Manage your users and their roles here.
        - button "Invite User"
        - button "Add User"
        - textbox "Filter users..."
        - button "Status":
          - img
          - text: ""
        - button "Role":
          - img
          - text: ""
        - button "View":
          - img
          - text: ""
        - table:
          - rowgroup:
            - row "Select all Username Name Email Phone Number Status Role":
              - columnheader "Select all":
                - checkbox "Select all"
              - columnheader "Username":
                - button "Username":
                  - text: ""
                  - img
              - columnheader "Name"
              - columnheader "Email":
                - button "Email":
                  - text: ""
                  - img
              - columnheader "Phone Number"
              - columnheader "Status"
              - columnheader "Role"
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

  test('USR-R3: User can view users with different statuses', async ({ page }) => {
    const users = [
      createTestUser('user-101', 'active@example.com', 'Active', 'User', 'active', 'admin'),
      createTestUser('user-102', 'inactive@example.com', 'Inactive', 'User', 'inactive', 'manager'),
    ];
    await seedAndNavigate(page, '/users', { users });
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "User List" [level=2]
        - paragraph: Manage your users and their roles here.
        - button "Invite User"
        - button "Add User"
        - textbox "Filter users..."
        - button "Status":
          - img
          - text: ""
        - button "Role":
          - img
          - text: ""
        - button "View":
          - img
          - text: ""
        - table:
          - rowgroup:
            - row "Select all Username Name Email Phone Number Status Role":
              - columnheader "Select all":
                - checkbox "Select all"
              - columnheader "Username":
                - button "Username":
                  - text: ""
                  - img
              - columnheader "Name"
              - columnheader "Email":
                - button "Email":
                  - text: ""
                  - img
              - columnheader "Phone Number"
              - columnheader "Status"
              - columnheader "Role"
              - columnheader
          - rowgroup:
            - row /Select row active_user Active User active@example\\.com \\+\\d+ active admin Open menu/:
              - cell "Select row":
                - checkbox "Select row"
              - cell "active_user"
              - cell "Active User"
              - cell "active@example.com"
              - cell /\\+\\d+/
              - cell "active"
              - cell "admin"
              - cell "Open menu":
                - button "Open menu":
                  - img
                  - text: ""
            - row /Select row inactive_user Inactive User inactive@example\\.com \\+\\d+ inactive manager Open menu/:
              - cell "Select row":
                - checkbox "Select row"
              - cell "inactive_user"
              - cell "Inactive User"
              - cell "inactive@example.com"
              - cell /\\+\\d+/
              - cell "inactive"
              - cell "manager"
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

test.describe('Users Search and Filter', () => {
  test('USR-W1: User can filter users by username', async ({ page }) => {
    await seedAndNavigate(page, '/users', { users: testUsers });
    await page.getByPlaceholder(/filter/i).fill('john');
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "User List" [level=2]
        - paragraph: Manage your users and their roles here.
        - button "Invite User"
        - button "Add User"
        - textbox "Filter users..."
        - button "Status":
          - img
          - text: ""
        - button "Role":
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
            - row "Select all Username Name Email Phone Number Status Role":
              - columnheader "Select all":
                - checkbox "Select all"
              - columnheader "Username":
                - button "Username":
                  - text: ""
                  - img
              - columnheader "Name"
              - columnheader "Email":
                - button "Email":
                  - text: ""
                  - img
              - columnheader "Phone Number"
              - columnheader "Status"
              - columnheader "Role"
              - columnheader
          - rowgroup:
            - row /Select row john_doe John Doe john@example\\.com \\+\\d+ active admin Open menu/:
              - cell "Select row":
                - checkbox "Select row"
              - cell "john_doe"
              - cell "John Doe"
              - cell "john@example.com"
              - cell /\\+\\d+/
              - cell "active"
              - cell "admin"
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

test.describe('Users CRUD Operations', () => {
  test('USR-W2: User can open add user dialog', async ({ page }) => {
    await seedAndNavigate(page, '/users', { users: [] });
    await page.getByRole('button', { name: /add user/i }).click();
    await expect(page.getByRole('dialog')).toMatchAriaSnapshot(`
      - dialog "Add New User":
        - heading "Add New User" [level=2]
        - paragraph: Create new user here. Click save when you're done.
        - text: ""
        - textbox "First Name":
          - /placeholder: John
        - text: ""
        - textbox "Last Name":
          - /placeholder: Doe
        - text: ""
        - textbox "Username":
          - /placeholder: john_doe
        - text: ""
        - textbox "Email":
          - /placeholder: john.doe@gmail.com
        - text: Phone Number
        - textbox "Phone Number":
          - /placeholder: "+123456789"
        - text: ""
        - combobox "Role": Select a role
        - text: ""
        - textbox "Password":
          - /placeholder: e.g., S3cur3P@ssw0rd
        - button
        - text: Confirm Password
        - textbox "Confirm Password" [disabled]:
          - /placeholder: e.g., S3cur3P@ssw0rd
        - button [disabled]
        - button "Save changes"
        - button "Close"
    `);
  });

  test('USR-W3: User can create a new user', async ({ page }) => {
    await seedAndNavigate(page, '/users', { users: [] });
    await page.getByRole('button', { name: /add user/i }).click();
    
    await page.getByRole('textbox', { name: 'First Name' }).fill('Test');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('NewUser');
    await page.getByRole('textbox', { name: 'Username' }).fill('test_newuser');
    await page.getByRole('textbox', { name: 'Email' }).fill('testnewuser@example.com');
    await page.getByRole('textbox', { name: 'Phone Number' }).fill('+1987654321');
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: 'Manager' }).click();
    await page.getByPlaceholder('e.g., S3cur3P@ssw0rd').first().fill('SecurePass123');
    await page.getByPlaceholder('e.g., S3cur3P@ssw0rd').last().fill('SecurePass123');
    await page.getByRole('button', { name: /save changes/i }).click();
    
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "User List" [level=2]
        - paragraph: Manage your users and their roles here.
        - button "Invite User"
        - button "Add User"
        - textbox "Filter users..."
        - button "Status":
          - img
          - text: ""
        - button "Role":
          - img
          - text: ""
        - button "View":
          - img
          - text: ""
        - table:
          - rowgroup:
            - row "Select all Username Name Email Phone Number Status Role":
              - columnheader "Select all":
                - checkbox "Select all"
              - columnheader "Username":
                - button "Username":
                  - text: ""
                  - img
              - columnheader "Name"
              - columnheader "Email":
                - button "Email":
                  - text: ""
                  - img
              - columnheader "Phone Number"
              - columnheader "Status"
              - columnheader "Role"
              - columnheader
          - rowgroup:
            - row /Select row test_newuser Test NewUser testnewuser@example\\.com \\+\\d+ active manager Open menu/:
              - cell "Select row":
                - checkbox "Select row"
              - cell "test_newuser"
              - cell "Test NewUser"
              - cell "testnewuser@example.com"
              - cell /\\+\\d+/
              - cell "active"
              - cell "manager"
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

  test('USR-W4: User can open edit user dialog', async ({ page }) => {
    const existingUser = createTestUser('user-edit-001', 'original@example.com', 'Original', 'User', 'active', 'admin');
    await seedAndNavigate(page, '/users', { users: [existingUser] });
    await page.getByRole('button', { name: /open menu/i }).click();
    await page.getByRole('menuitem', { name: /edit/i }).click();
    await expect(page.getByRole('dialog')).toMatchAriaSnapshot(`
      - dialog "Edit User":
        - heading "Edit User" [level=2]
        - paragraph: Update the user here. Click save when you're done.
        - text: First Name
        - textbox "First Name":
          - /placeholder: John
          - text: ""
        - text: Last Name
        - textbox "Last Name":
          - /placeholder: Doe
          - text: ""
        - text: ""
        - textbox "Username":
          - /placeholder: john_doe
          - text: original_user
        - text: ""
        - textbox "Email":
          - /placeholder: john.doe@gmail.com
          - text: original@example.com
        - text: Phone Number
        - textbox "Phone Number":
          - /placeholder: "+123456789"
          - text: ""
        - text: ""
        - combobox "Role": Admin
        - text: ""
        - textbox "Password":
          - /placeholder: e.g., S3cur3P@ssw0rd
        - button
        - text: Confirm Password
        - textbox "Confirm Password" [disabled]:
          - /placeholder: e.g., S3cur3P@ssw0rd
        - button [disabled]
        - button "Save changes"
        - button "Close"
    `);
  });

  test('USR-W5: User can update an existing user', async ({ page }) => {
    const existingUser = createTestUser('user-edit-001', 'original@example.com', 'Original', 'User', 'active', 'admin');
    await seedAndNavigate(page, '/users', { users: [existingUser] });
    await page.getByRole('button', { name: /open menu/i }).click();
    await page.getByRole('menuitem', { name: /edit/i }).click();
    
    await page.getByRole('textbox', { name: 'First Name' }).clear();
    await page.getByRole('textbox', { name: 'First Name' }).fill('Edited');
    await page.getByRole('textbox', { name: 'Last Name' }).clear();
    await page.getByRole('textbox', { name: 'Last Name' }).fill('UserName');
    await page.getByRole('button', { name: /save changes/i }).click();
    
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "User List" [level=2]
        - paragraph: Manage your users and their roles here.
        - button "Invite User"
        - button "Add User"
        - textbox "Filter users..."
        - button "Status":
          - img
          - text: ""
        - button "Role":
          - img
          - text: ""
        - button "View":
          - img
          - text: ""
        - table:
          - rowgroup:
            - row "Select all Username Name Email Phone Number Status Role":
              - columnheader "Select all":
                - checkbox "Select all"
              - columnheader "Username":
                - button "Username":
                  - text: ""
                  - img
              - columnheader "Name"
              - columnheader "Email":
                - button "Email":
                  - text: ""
                  - img
              - columnheader "Phone Number"
              - columnheader "Status"
              - columnheader "Role"
              - columnheader
          - rowgroup:
            - row /Select row original_user Edited UserName original@example\\.com \\+\\d+ active admin Open menu/:
              - cell "Select row":
                - checkbox "Select row"
              - cell "original_user"
              - cell "Edited UserName"
              - cell "original@example.com"
              - cell /\\+\\d+/
              - cell "active"
              - cell "admin"
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

  test('USR-W6: User can open delete confirmation dialog', async ({ page }) => {
    const userToDelete = createTestUser('user-del-001', 'delete@example.com', 'Delete', 'Me', 'active', 'cashier');
    await seedAndNavigate(page, '/users', { users: [userToDelete] });
    await page.getByRole('button', { name: /open menu/i }).click();
    await page.getByRole('menuitem', { name: /delete/i }).click();
    await expect(page.getByRole('alertdialog')).toMatchAriaSnapshot(`
      - alertdialog "Delete User":
        - heading "Delete User" [level=2]
        - paragraph: Are you sure you want to delete delete_me? This action will permanently remove the user with the role of CASHIER from the system. This cannot be undone.
        - text: ""
        - textbox "Username:":
          - /placeholder: Enter username to confirm deletion.
        - alert: Warning! Please be careful, this operation can not be rolled back.
        - button "Cancel"
        - button "Delete" [disabled]
    `);
  });

  test('USR-W7: User can delete a user', async ({ page }) => {
    const userToDelete = createTestUser('user-del-001', 'delete@example.com', 'Delete', 'Me', 'active', 'cashier');
    await seedAndNavigate(page, '/users', { users: [userToDelete] });
    await page.getByRole('button', { name: /open menu/i }).click();
    await page.getByRole('menuitem', { name: /delete/i }).click();
    await page.getByPlaceholder(/enter username to confirm/i).fill('delete_me');
    await page.getByRole('button', { name: /^delete$/i }).click();
    
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "User List" [level=2]
        - paragraph: Manage your users and their roles here.
        - button "Invite User"
        - button "Add User"
        - textbox "Filter users..."
        - button "Status":
          - img
          - text: ""
        - button "Role":
          - img
          - text: ""
        - button "View":
          - img
          - text: ""
        - table:
          - rowgroup:
            - row "Select all Username Name Email Phone Number Status Role":
              - columnheader "Select all":
                - checkbox "Select all"
              - columnheader "Username":
                - button "Username":
                  - text: ""
                  - img
              - columnheader "Name"
              - columnheader "Email":
                - button "Email":
                  - text: ""
                  - img
              - columnheader "Phone Number"
              - columnheader "Status"
              - columnheader "Role"
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

  test('USR-W8: Add user form shows validation errors on empty submit', async ({ page }) => {
    await seedAndNavigate(page, '/users', { users: [] });
    await page.getByRole('button', { name: /add user/i }).click();
    await page.getByRole('button', { name: /save changes/i }).click();
    await expect(page.getByRole('dialog')).toMatchAriaSnapshot(`
      - dialog "Add New User":
        - heading "Add New User" [level=2]
        - paragraph: Create new user here. Click save when you're done.
        - text: ""
        - textbox "First Name":
          - /placeholder: John
        - paragraph: First Name is required.
        - text: ""
        - textbox "Last Name":
          - /placeholder: Doe
        - paragraph: Last Name is required.
        - text: ""
        - textbox "Username":
          - /placeholder: john_doe
        - paragraph: Username is required.
        - text: ""
        - textbox "Email":
          - /placeholder: john.doe@gmail.com
        - paragraph: Email is required.
        - text: Phone Number
        - textbox "Phone Number":
          - /placeholder: "+123456789"
        - paragraph: Phone number is required.
        - text: ""
        - combobox "Role": Select a role
        - paragraph: Role is required.
        - text: ""
        - textbox "Password":
          - /placeholder: e.g., S3cur3P@ssw0rd
        - button
        - paragraph: Password is required.
        - text: Confirm Password
        - textbox "Confirm Password" [disabled]:
          - /placeholder: e.g., S3cur3P@ssw0rd
        - button [disabled]
        - button "Save changes"
        - button "Close"
    `);
  });
});
