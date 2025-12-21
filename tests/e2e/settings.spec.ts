import { test, expect } from './utils/test-helpers';

test.describe('Settings Page', () => {
  test('READ-DISPLAY: should display settings page with heading', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: /settings/i })).toBeVisible();
    await expect(page.getByText(/manage your account settings/i)).toBeVisible();
  });

  test('READ-SIDEBAR: should display sidebar navigation items', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('navigation').getByRole('link', { name: /profile/i })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: /account/i })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: /appearance/i })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: /notifications/i })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: /display/i })).toBeVisible();
  });

  test('READ-PROFILE-DEFAULT: should show Profile section by default', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: 'Profile', exact: true })).toBeVisible();
    await expect(page.getByText(/this is how others will see you/i)).toBeVisible();
  });
});

test.describe('Settings Navigation', () => {
  test('WRITE-NAV-ACCOUNT: should navigate to Account settings', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');

    await page.getByRole('navigation').getByRole('link', { name: /account/i }).click();

    await expect(page).toHaveURL('/settings/account');
    await expect(page.getByRole('heading', { name: 'Account', exact: true })).toBeVisible();
  });

  test('WRITE-NAV-APPEARANCE: should navigate to Appearance settings', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');

    await page.getByRole('navigation').getByRole('link', { name: /appearance/i }).click();

    await expect(page).toHaveURL('/settings/appearance');
    await expect(page.getByRole('heading', { name: 'Appearance', exact: true })).toBeVisible();
  });

  test('WRITE-NAV-NOTIFICATIONS: should navigate to Notifications settings', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');

    await page.getByRole('navigation').getByRole('link', { name: /notifications/i }).click();

    await expect(page).toHaveURL('/settings/notifications');
    await expect(page.getByRole('heading', { name: 'Notifications', exact: true })).toBeVisible();
  });

  test('WRITE-NAV-DISPLAY: should navigate to Display settings', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');

    await page.getByRole('navigation').getByRole('link', { name: /display/i }).click();

    await expect(page).toHaveURL('/settings/display');
    await expect(page.getByRole('heading', { name: 'Display', exact: true })).toBeVisible();
  });

  test('WRITE-NAV-BACK-PROFILE: should navigate back to Profile from other sections', async ({ page }) => {
    await page.goto('/settings/account');
    await page.waitForLoadState('networkidle');

    await page.getByRole('navigation').getByRole('link', { name: /profile/i }).click();

    await expect(page).toHaveURL('/settings');
    await expect(page.getByRole('heading', { name: 'Profile', exact: true })).toBeVisible();
  });
});

test.describe('Settings Profile Form', () => {
  test('READ-PROFILE-FORM: should display profile form fields', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');

    // Check for all form fields
    await expect(page.getByLabel(/username/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/bio/i)).toBeVisible();
  });

  test('WRITE-PROFILE-VALIDATION-USERNAME-EMPTY: should show validation on empty username', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');

    // Clear username and submit
    await page.getByLabel(/username/i).clear();
    await page.getByRole('button', { name: /update profile/i }).click();

    // Verify validation error - empty field shows "Please enter your username." (from z.string() message)
    await expect(page.getByText(/please enter your username/i)).toBeVisible();
  });

  test('WRITE-PROFILE-VALIDATION-USERNAME-SHORT: should show validation on short username', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');

    // Enter single character username
    await page.getByLabel(/username/i).fill('a');
    await page.getByRole('button', { name: /update profile/i }).click();

    // Verify validation error for min length
    await expect(page.getByText(/at least 2 characters/i)).toBeVisible();
  });

  test('WRITE-PROFILE-VALIDATION-EMAIL: should show validation when no email selected', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');

    // Fill valid username but don't select email, submit
    await page.getByLabel(/username/i).fill('validuser');
    await page.getByRole('button', { name: /update profile/i }).click();

    // Verify validation error for email
    await expect(page.getByText(/please select an email/i)).toBeVisible();
  });

  test('WRITE-PROFILE-VALIDATION-BIO-SHORT: should show validation on short bio', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');

    // Clear bio and enter short text (less than 4 chars)
    await page.getByLabel(/bio/i).clear();
    await page.getByLabel(/bio/i).fill('Hi');
    await page.getByRole('button', { name: /update profile/i }).click();

    // Verify validation error for bio min length (4 chars)
    // Zod default message: "Too small: expected string to have >=4 characters"
    await expect(page.getByText(/too small.*>=4 characters/i)).toBeVisible();
  });
});

test.describe('Settings Account Form', () => {
  test('READ-ACCOUNT-FORM: should display account form fields', async ({ page }) => {
    await page.goto('/settings/account');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: 'Account', exact: true })).toBeVisible();
    await expect(page.getByLabel(/name/i).first()).toBeVisible();
    await expect(page.getByText('Date of birth', { exact: true })).toBeVisible();
    await expect(page.getByText('Language', { exact: true })).toBeVisible();
  });

  test('WRITE-ACCOUNT-VALIDATION-NAME-EMPTY: should show validation on empty name', async ({ page }) => {
    await page.goto('/settings/account');
    await page.waitForLoadState('networkidle');

    // Ensure name field is empty and submit
    await page.getByLabel(/name/i).first().clear();
    await page.getByRole('button', { name: /update account/i }).click();

    // Verify validation error for name
    await expect(page.getByText(/please enter your name/i)).toBeVisible();
  });

  test('WRITE-ACCOUNT-VALIDATION-NAME-SHORT: should show validation on short name', async ({ page }) => {
    await page.goto('/settings/account');
    await page.waitForLoadState('networkidle');

    // Enter single character name
    await page.getByLabel(/name/i).first().fill('a');
    await page.getByRole('button', { name: /update account/i }).click();

    // Verify validation error for min length
    await expect(page.getByText(/at least 2 characters/i)).toBeVisible();
  });
});

test.describe('Settings Appearance', () => {
  test('READ-APPEARANCE-OPTIONS: should display theme options', async ({ page }) => {
    await page.goto('/settings/appearance');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: 'Appearance', exact: true })).toBeVisible();
    await expect(page.getByText(/customize the appearance/i)).toBeVisible();
  });
});

test.describe('Settings Notifications', () => {
  test('READ-NOTIFICATIONS-OPTIONS: should display notification options', async ({ page }) => {
    await page.goto('/settings/notifications');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: 'Notifications', exact: true })).toBeVisible();
  });
});

test.describe('Settings Display', () => {
  test('READ-DISPLAY-OPTIONS: should display display options', async ({ page }) => {
    await page.goto('/settings/display');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: 'Display', exact: true })).toBeVisible();
  });
});
