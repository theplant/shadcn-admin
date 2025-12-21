import { test, expect } from './utils/test-helpers';
import { SignInPage } from './utils/page-objects';

test.describe('Authentication', () => {
  test('sign-in: should display sign-in form', async ({ page }) => {
    await page.goto('/sign-in');
    await page.waitForLoadState('networkidle');
    const signInPage = new SignInPage(page);
    
    await expect(signInPage.title).toBeVisible();
    await expect(signInPage.emailInput).toBeVisible();
    await expect(signInPage.passwordInput).toBeVisible();
    await expect(signInPage.signInButton).toBeVisible();
  });

  test('sign-in: should show validation errors for empty form', async ({ page }) => {
    await page.goto('/sign-in');
    const signInPage = new SignInPage(page);
    
    await signInPage.submit();
    
    await expect(page.getByText(/please enter your email/i)).toBeVisible();
    await expect(page.getByText(/please enter your password/i)).toBeVisible();
  });

  test('sign-in: should show validation error for short password', async ({ page }) => {
    await page.goto('/sign-in');
    const signInPage = new SignInPage(page);
    
    await signInPage.fillEmail('test@example.com');
    await signInPage.fillPassword('123');
    await signInPage.submit();
    
    await expect(page.getByText(/at least 7 characters/i)).toBeVisible();
  });

  test('sign-up: should display sign-up form', async ({ page }) => {
    await page.goto('/sign-up');
    await page.waitForLoadState('networkidle');
    
    await expect(page.getByText('Create an account', { exact: true })).toBeVisible();
    await expect(page.getByPlaceholder(/name@example.com/i)).toBeVisible();
  });

  test('forgot-password: should display forgot password form', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.waitForLoadState('networkidle');
    
    await expect(page.getByText(/forgot password/i).first()).toBeVisible();
    await expect(page.getByPlaceholder(/name@example.com/i)).toBeVisible();
  });

  test('otp: should display OTP verification form', async ({ page }) => {
    await page.goto('/otp');
    await page.waitForLoadState('networkidle');
    
    await expect(page.getByText(/two-factor authentication/i)).toBeVisible();
  });
});

test.describe('Authentication WRITE Paths', () => {
  test('WRITE-SIGNIN: should successfully sign in and redirect to dashboard', async ({ page }) => {
    await page.goto('/sign-in');
    const signInPage = new SignInPage(page);
    
    // Fill in valid credentials
    await signInPage.fillEmail('test@example.com');
    await signInPage.fillPassword('password123');
    await signInPage.submit();
    
    // Verify loading state appears
    await expect(page.getByText(/signing in/i)).toBeVisible();
    
    // Wait for success toast and redirect (mock auth takes 2 seconds)
    await expect(page.getByText(/welcome back/i)).toBeVisible({ timeout: 5000 });
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL('/');
  });

  test('WRITE-SIGNIN-VALIDATION: should show validation for invalid email format', async ({ page }) => {
    await page.goto('/sign-in');
    const signInPage = new SignInPage(page);
    
    // Fill in invalid email
    await signInPage.fillEmail('invalid-email');
    await signInPage.fillPassword('password123');
    await signInPage.submit();
    
    // Verify email validation error
    await expect(page.getByText(/invalid email/i)).toBeVisible();
  });

  test('WRITE-NAVIGATION: should navigate from sign-in to forgot password', async ({ page }) => {
    await page.goto('/sign-in');
    
    // Click the forgot password link
    await page.getByRole('link', { name: /forgot password/i }).click();
    
    // Verify navigation to forgot password page
    await expect(page).toHaveURL('/forgot-password');
    await expect(page.getByText(/forgot password/i).first()).toBeVisible();
  });
});
