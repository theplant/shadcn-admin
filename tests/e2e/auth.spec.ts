import { test, expect } from './utils/test-helpers';

test.describe('Authentication', () => {
  test('AUTH-R1: User can view sign-in form', async ({ page }) => {
    await page.goto('/sign-in');
    await expect(page.locator('body')).toMatchAriaSnapshot(`
      - img "Shadcn-Admin"
      - heading "Shadcn Admin" [level=1]
      - text: Sign in Enter your email and password below to log into your account Email
      - textbox "Email":
        - /placeholder: name@example.com
      - text: Password
      - textbox "Password":
        - /placeholder: "********"
      - button
      - link "Forgot password?":
        - /url: /forgot-password
      - button "Sign in"
      - text: Or continue with
      - button "GitHub GitHub":
        - img "GitHub"
        - text: ""
      - button "Facebook Facebook":
        - img "Facebook"
        - text: ""
      - paragraph:
        - text: By clicking sign in, you agree to our
        - link "Terms of Service":
          - /url: /terms
        - text: and
        - link "Privacy Policy":
          - /url: /privacy
        - text: .
      - region "Notifications alt+T"
      - button "Open Tanstack query devtools":
        - img
      - contentinfo:
        - button "Open TanStack Router Devtools":
          - img
          - img
          - text: ""
    `);
  });

  test('AUTH-R2: User can view sign-up form', async ({ page }) => {
    await page.goto('/sign-up');
    await expect(page.locator('body')).toMatchAriaSnapshot(`
      - img "Shadcn-Admin"
      - heading "Shadcn Admin" [level=1]
      - text: Create an account Enter your email and password to create an account. Already have an account?
      - link "Sign In":
        - /url: /sign-in
      - text: Email
      - textbox "Email":
        - /placeholder: name@example.com
      - text: Password
      - textbox "Password":
        - /placeholder: "********"
      - button
      - text: Confirm Password
      - textbox "Confirm Password":
        - /placeholder: "********"
      - button
      - button "Create Account"
      - text: Or continue with
      - button "GitHub GitHub":
        - img "GitHub"
        - text: ""
      - button "Facebook Facebook":
        - img "Facebook"
        - text: ""
      - paragraph:
        - text: By creating an account, you agree to our
        - link "Terms of Service":
          - /url: /terms
        - text: and
        - link "Privacy Policy":
          - /url: /privacy
        - text: .
      - region "Notifications alt+T"
      - button "Open Tanstack query devtools":
        - img
      - contentinfo:
        - button "Open TanStack Router Devtools":
          - img
          - img
          - text: ""
    `);
  });

  test('AUTH-R3: User can view forgot password form', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.locator('body')).toMatchAriaSnapshot(`
      - img "Shadcn-Admin"
      - heading "Shadcn Admin" [level=1]
      - text: Forgot Password Enter your registered email and we will send you a link to reset your password. Email
      - textbox "Email":
        - /placeholder: name@example.com
      - button "Continue"
      - paragraph:
        - text: Don't have an account?
        - link "Sign up":
          - /url: /sign-up
        - text: .
      - region "Notifications alt+T"
      - button "Open Tanstack query devtools":
        - img
      - contentinfo:
        - button "Open TanStack Router Devtools":
          - img
          - img
          - text: ""
    `);
  });

  test('AUTH-R4: User can view OTP verification form', async ({ page }) => {
    await page.goto('/otp');
    await expect(page.locator('body')).toMatchAriaSnapshot(`
      - img "Shadcn-Admin"
      - heading "Shadcn Admin" [level=1]
      - text: Two-factor Authentication Please enter the authentication code. We have sent the authentication code to your email. One-Time Password
      - separator
      - separator
      - textbox "One-Time Password"
      - button "Verify" [disabled]
      - paragraph:
        - text: Haven't received it?
        - link "Resend a new code.":
          - /url: /sign-in
        - text: .
      - region "Notifications alt+T"
      - button "Open Tanstack query devtools":
        - img
      - contentinfo:
        - button "Open TanStack Router Devtools":
          - img
          - img
          - text: ""
    `);
  });

  test('AUTH-W1: Sign-in shows validation errors for empty form', async ({ page }) => {
    await page.goto('/sign-in');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.locator('body')).toMatchAriaSnapshot(`
      - img "Shadcn-Admin"
      - heading "Shadcn Admin" [level=1]
      - text: Sign in Enter your email and password below to log into your account Email
      - textbox "Email":
        - /placeholder: name@example.com
      - paragraph: Please enter your email
      - text: Password
      - textbox "Password":
        - /placeholder: "********"
      - button
      - paragraph: Please enter your password
      - link "Forgot password?":
        - /url: /forgot-password
      - button "Sign in"
      - text: Or continue with
      - button "GitHub GitHub":
        - img "GitHub"
        - text: ""
      - button "Facebook Facebook":
        - img "Facebook"
        - text: ""
      - paragraph:
        - text: By clicking sign in, you agree to our
        - link "Terms of Service":
          - /url: /terms
        - text: and
        - link "Privacy Policy":
          - /url: /privacy
        - text: .
      - region "Notifications alt+T"
      - button "Open Tanstack query devtools":
        - img
      - contentinfo:
        - button "Open TanStack Router Devtools":
          - img
          - img
          - text: ""
    `);
  });

  test('AUTH-W2: Sign-in shows validation error for short password', async ({ page }) => {
    await page.goto('/sign-in');
    await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
    await page.getByRole('textbox', { name: /password/i }).fill('123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.locator('body')).toMatchAriaSnapshot(`
      - img "Shadcn-Admin"
      - heading "Shadcn Admin" [level=1]
      - text: Sign in Enter your email and password below to log into your account Email
      - textbox "Email":
        - /placeholder: name@example.com
        - text: test@example.com
      - text: Password
      - textbox "Password":
        - /placeholder: "********"
        - text: ""
      - button
      - paragraph: Password must be at least 7 characters long
      - link "Forgot password?":
        - /url: /forgot-password
      - button "Sign in"
      - text: Or continue with
      - button "GitHub GitHub":
        - img "GitHub"
        - text: ""
      - button "Facebook Facebook":
        - img "Facebook"
        - text: ""
      - paragraph:
        - text: By clicking sign in, you agree to our
        - link "Terms of Service":
          - /url: /terms
        - text: and
        - link "Privacy Policy":
          - /url: /privacy
        - text: .
      - region "Notifications alt+T"
      - button "Open Tanstack query devtools":
        - img
      - contentinfo:
        - button "Open TanStack Router Devtools":
          - img
          - img
          - text: ""
    `);
  });

  test('AUTH-W3: Sign-in shows validation for invalid email format', async ({ page }) => {
    await page.goto('/sign-in');
    await page.getByRole('textbox', { name: /email/i }).fill('invalid-email');
    await page.getByRole('textbox', { name: /password/i }).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.locator('body')).toMatchAriaSnapshot(`
      - img "Shadcn-Admin"
      - heading "Shadcn Admin" [level=1]
      - text: Sign in Enter your email and password below to log into your account Email
      - textbox "Email":
        - /placeholder: name@example.com
        - text: invalid-email
      - paragraph: Invalid email address
      - text: Password
      - textbox "Password":
        - /placeholder: "********"
        - text: password123
      - button
      - link "Forgot password?":
        - /url: /forgot-password
      - button "Sign in"
      - text: Or continue with
      - button "GitHub GitHub":
        - img "GitHub"
        - text: ""
      - button "Facebook Facebook":
        - img "Facebook"
        - text: ""
      - paragraph:
        - text: By clicking sign in, you agree to our
        - link "Terms of Service":
          - /url: /terms
        - text: and
        - link "Privacy Policy":
          - /url: /privacy
        - text: .
      - region "Notifications alt+T"
      - button "Open Tanstack query devtools":
        - img
      - contentinfo:
        - button "Open TanStack Router Devtools":
          - img
          - img
          - text: ""
    `);
  });

  test('AUTH-W4: User can navigate from sign-in to forgot password', async ({ page }) => {
    await page.goto('/sign-in');
    await page.getByRole('link', { name: /forgot password/i }).click();
    await expect(page.locator('body')).toMatchAriaSnapshot(`
      - img "Shadcn-Admin"
      - heading "Shadcn Admin" [level=1]
      - text: Forgot Password Enter your registered email and we will send you a link to reset your password. Email
      - textbox "Email":
        - /placeholder: name@example.com
      - button "Continue"
      - paragraph:
        - text: Don't have an account?
        - link "Sign up":
          - /url: /sign-up
        - text: .
      - region "Notifications alt+T"
      - button "Open Tanstack query devtools":
        - img
      - contentinfo:
        - button "Open TanStack Router Devtools":
          - img
          - img
          - text: ""
    `);
  });

  test('AUTH-W5: User can successfully sign in and redirect to dashboard', async ({ page }) => {
    await page.goto('/sign-in');
    await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
    await page.getByRole('textbox', { name: /password/i }).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    // Wait for redirect to dashboard
    await page.waitForURL('/');
    await expect(page.locator('body')).toMatchAriaSnapshot(`
      - link "Skip to Main":
        - /url: "#content"
      - list:
        - listitem:
          - button "Shadcn Admin Vite + ShadcnUI"
      - text: General
      - list:
        - listitem:
          - link "Dashboard":
            - /url: /
        - listitem:
          - link "Tasks":
            - /url: /tasks
        - listitem:
          - link "Apps":
            - /url: /apps
        - listitem:
          - link "Chats 3":
            - /url: /chats
        - listitem:
          - link "Users":
            - /url: /users
        - listitem:
          - button "Clerk Secured by Clerk":
            - img "Clerk"
            - text: ""
      - text: Pages
      - list:
        - listitem:
          - button "Auth"
        - listitem:
          - button "Errors"
      - text: Other
      - list:
        - listitem:
          - button "Settings"
        - listitem:
          - link "Help Center":
            - /url: /help-center
      - list:
        - listitem:
          - button "SN satnaing satnaingdev@gmail.com"
      - button "Toggle Sidebar"
      - banner:
        - button "Toggle Sidebar"
        - navigation:
          - link "Overview":
            - /url: /dashboard/overview
          - link "Customers" [disabled]
          - link "Products" [disabled]
          - link "Settings" [disabled]
        - button "Search ⌘ K"
        - button "Toggle theme"
        - button "Open theme settings"
        - button "SN"
      - main:
        - heading "Dashboard" [level=1]
        - button "Download"
        - tablist:
          - tab "Overview" [selected]
          - tab "Analytics"
          - tab "Reports" [disabled]
          - tab "Notifications" [disabled]
        - tabpanel "Overview":
          - text: Total Revenue
          - img
          - text: /\\$\\d+,\\d+\\.\\d+/
          - paragraph: /\\+\\d+\\.\\d+% from last month/
          - text: Subscriptions
          - img
          - text: ""
          - paragraph: /\\+\\d+\\.\\d+% from last month/
          - text: ""
          - img
          - text: ""
          - paragraph: /\\+\\d+% from last month/
          - text: Active Now
          - img
          - text: ""
          - paragraph: /\\+\\d+ since last hour/
          - text: ""
          - application: /Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec \\$0 \\$\\d+ \\$\\d+ \\$\\d+ \\$\\d+/
          - text: /Recent Sales You made \\d+ sales this month\\. OM/
          - paragraph: Olivia Martin
          - paragraph: olivia.martin@email.com
          - text: /\\+\\$\\d+,\\d+\\.\\d+ JL/
          - paragraph: Jackson Lee
          - paragraph: jackson.lee@email.com
          - text: /\\+\\$\\d+\\.\\d+ IN/
          - paragraph: Isabella Nguyen
          - paragraph: isabella.nguyen@email.com
          - text: /\\+\\$\\d+\\.\\d+ WK/
          - paragraph: William Kim
          - paragraph: will@email.com
          - text: /\\+\\$\\d+\\.\\d+ SD/
          - paragraph: Sofia Davis
          - paragraph: sofia.davis@email.com
          - text: ""
      - heading "Command Palette" [level=2]
      - paragraph: Search for a command to run...
      - region "Notifications alt+T":
        - list:
          - listitem:
            - img
            - text: Welcome back, test@example.com!
      - button "Open Tanstack query devtools":
        - img
      - contentinfo:
        - button "Open TanStack Router Devtools":
          - img
          - img
          - text: ""
    `);
  });
});
