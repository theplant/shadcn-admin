import type { Page, Locator } from '@playwright/test';

export class SignInPage {
  readonly page: Page;
  readonly title: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly githubButton: Locator;
  readonly facebookButton: Locator;
  readonly termsLink: Locator;
  readonly privacyLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText(/sign in/i).first();
    this.emailInput = page.getByPlaceholder(/name@example.com/i);
    this.passwordInput = page.getByPlaceholder(/\*{4,}/);
    this.signInButton = page.getByRole('button', { name: /sign in/i });
    this.forgotPasswordLink = page.getByRole('link', { name: /forgot password/i });
    this.githubButton = page.getByRole('button', { name: /github/i });
    this.facebookButton = page.getByRole('button', { name: /facebook/i });
    this.termsLink = page.getByRole('link', { name: /terms of service/i });
    this.privacyLink = page.getByRole('link', { name: /privacy policy/i });
  }

  async goto() {
    await this.page.goto('/sign-in');
    await this.page.waitForLoadState('networkidle');
  }

  async signIn(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.signInButton.click();
  }
}
