import { test, expect } from './utils/test-helpers';

test.describe('Settings Page', () => {
  test('SET-R1: User can view settings page with profile section', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Settings" [level=1]
        - paragraph: Manage your account settings and set e-mail preferences.
        - complementary:
          - navigation:
            - link "Profile":
              - /url: /settings
            - link "Account":
              - /url: /settings/account
            - link "Appearance":
              - /url: /settings/appearance
            - link "Notifications":
              - /url: /settings/notifications
            - link "Display":
              - /url: /settings/display
        - heading "Profile" [level=3]
        - paragraph: This is how others will see you on the site.
        - text: Username
        - textbox "Username":
          - /placeholder: shadcn
        - paragraph: /This is your public display name\\. It can be your real name or a pseudonym\\. You can only change this once every \\d+ days\\./
        - text: Email
        - combobox "Email": Select a verified email to display
        - paragraph:
          - text: You can manage verified email addresses in your
          - link "email settings":
            - /url: /
          - text: .
        - text: Bio
        - textbox "Bio":
          - /placeholder: Tell us a little bit about yourself
          - text: I own a computer.
        - paragraph: You can @mention other users and organizations to link to them.
        - text: URLs
        - paragraph: Add links to your website, blog, or social media profiles.
        - textbox "URLs": https://shadcn.com
        - text: URLs
        - paragraph: Add links to your website, blog, or social media profiles.
        - textbox "URLs": http://twitter.com/shadcn
        - button "Add URL"
        - button "Update profile"
    `);
  });

  test('SET-R2: User can view account settings page', async ({ page }) => {
    await page.goto('/settings/account');
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Settings" [level=1]
        - paragraph: Manage your account settings and set e-mail preferences.
        - complementary:
          - navigation:
            - link "Profile":
              - /url: /settings
            - link "Account":
              - /url: /settings/account
            - link "Appearance":
              - /url: /settings/appearance
            - link "Notifications":
              - /url: /settings/notifications
            - link "Display":
              - /url: /settings/display
        - heading "Account" [level=3]
        - paragraph: Update your account settings. Set your preferred language and timezone.
        - text: Name
        - textbox "Name":
          - /placeholder: Your name
        - paragraph: This is the name that will be displayed on your profile and in emails.
        - text: Date of birth
        - button "Pick a date"
        - paragraph: Your date of birth is used to calculate your age.
        - text: Language
        - combobox "Language":
          - text: Select language
          - img
        - paragraph: This is the language that will be used in the dashboard.
        - button "Update account"
    `);
  });

  test('SET-R3: User can view appearance settings page', async ({ page }) => {
    await page.goto('/settings/appearance');
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Settings" [level=1]
        - paragraph: Manage your account settings and set e-mail preferences.
        - complementary:
          - navigation:
            - link "Profile":
              - /url: /settings
            - link "Account":
              - /url: /settings/account
            - link "Appearance":
              - /url: /settings/appearance
            - link "Notifications":
              - /url: /settings/notifications
            - link "Display":
              - /url: /settings/display
        - heading "Appearance" [level=3]
        - paragraph: Customize the appearance of the app. Automatically switch between day and night themes.
        - text: Font
        - combobox "Font":
          - option "inter" [selected]
          - option "manrope"
          - option "system"
        - img
        - paragraph: Set the font you want to use in the dashboard.
        - text: Theme
        - paragraph: Select the theme for the dashboard.
        - radiogroup:
          - radio "Light"
          - text: Light
          - radio "Dark"
          - text: Dark
        - button "Update preferences"
    `);
  });

  test('SET-R4: User can view notifications settings page', async ({ page }) => {
    await page.goto('/settings/notifications');
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Settings" [level=1]
        - paragraph: Manage your account settings and set e-mail preferences.
        - complementary:
          - navigation:
            - link "Profile":
              - /url: /settings
            - link "Account":
              - /url: /settings/account
            - link "Appearance":
              - /url: /settings/appearance
            - link "Notifications":
              - /url: /settings/notifications
            - link "Display":
              - /url: /settings/display
        - heading "Notifications" [level=3]
        - paragraph: Configure how you receive notifications.
        - text: Notify me about...
        - radiogroup:
          - radio "All new messages"
          - text: All new messages
          - radio "Direct messages and mentions"
          - text: Direct messages and mentions
          - radio "Nothing"
          - text: Nothing
        - heading "Email Notifications" [level=3]
        - text: Communication emails
        - paragraph: Receive emails about your account activity.
        - switch "Communication emails"
        - text: Marketing emails
        - paragraph: Receive emails about new products, features, and more.
        - switch "Marketing emails"
        - text: Social emails
        - paragraph: Receive emails for friend requests, follows, and more.
        - switch "Social emails" [checked]
        - text: Security emails
        - paragraph: Receive emails about your account activity and security.
        - switch "Security emails" [checked] [disabled]
        - checkbox "Use different settings for my mobile devices"
        - text: Use different settings for my mobile devices
        - paragraph:
          - text: You can manage your mobile notifications in the
          - link "mobile settings":
            - /url: /settings
          - text: page.
        - button "Update notifications"
    `);
  });

  test('SET-R5: User can view display settings page', async ({ page }) => {
    await page.goto('/settings/display');
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Settings" [level=1]
        - paragraph: Manage your account settings and set e-mail preferences.
        - complementary:
          - navigation:
            - link "Profile":
              - /url: /settings
            - link "Account":
              - /url: /settings/account
            - link "Appearance":
              - /url: /settings/appearance
            - link "Notifications":
              - /url: /settings/notifications
            - link "Display":
              - /url: /settings/display
        - heading "Display" [level=3]
        - paragraph: Turn items on or off to control what's displayed in the app.
        - text: Sidebar
        - paragraph: Select the items you want to display in the sidebar.
        - checkbox "Recents" [checked]
        - text: Recents
        - checkbox "Home" [checked]
        - text: Home
        - checkbox "Applications"
        - text: Applications
        - checkbox "Desktop"
        - text: Desktop
        - checkbox "Downloads"
        - text: Downloads
        - checkbox "Documents"
        - text: Documents
        - button "Update display"
    `);
  });
});

test.describe('Settings Navigation', () => {
  test('SET-W1: User can navigate to Account settings', async ({ page }) => {
    await page.goto('/settings');
    await page.getByRole('navigation').getByRole('link', { name: /account/i }).click();
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Settings" [level=1]
        - paragraph: Manage your account settings and set e-mail preferences.
        - complementary:
          - navigation:
            - link "Profile":
              - /url: /settings
            - link "Account":
              - /url: /settings/account
            - link "Appearance":
              - /url: /settings/appearance
            - link "Notifications":
              - /url: /settings/notifications
            - link "Display":
              - /url: /settings/display
        - heading "Account" [level=3]
        - paragraph: Update your account settings. Set your preferred language and timezone.
        - text: Name
        - textbox "Name":
          - /placeholder: Your name
        - paragraph: This is the name that will be displayed on your profile and in emails.
        - text: Date of birth
        - button "Pick a date"
        - paragraph: Your date of birth is used to calculate your age.
        - text: Language
        - combobox "Language":
          - text: Select language
          - img
        - paragraph: This is the language that will be used in the dashboard.
        - button "Update account"
    `);
  });

  test('SET-W2: User can navigate to Appearance settings', async ({ page }) => {
    await page.goto('/settings');
    await page.getByRole('navigation').getByRole('link', { name: /appearance/i }).click();
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Settings" [level=1]
        - paragraph: Manage your account settings and set e-mail preferences.
        - complementary:
          - navigation:
            - link "Profile":
              - /url: /settings
            - link "Account":
              - /url: /settings/account
            - link "Appearance":
              - /url: /settings/appearance
            - link "Notifications":
              - /url: /settings/notifications
            - link "Display":
              - /url: /settings/display
        - heading "Appearance" [level=3]
        - paragraph: Customize the appearance of the app. Automatically switch between day and night themes.
        - text: Font
        - combobox "Font":
          - option "inter" [selected]
          - option "manrope"
          - option "system"
        - img
        - paragraph: Set the font you want to use in the dashboard.
        - text: Theme
        - paragraph: Select the theme for the dashboard.
        - radiogroup:
          - radio "Light"
          - text: Light
          - radio "Dark"
          - text: Dark
        - button "Update preferences"
    `);
  });

  test('SET-W3: User can navigate to Notifications settings', async ({ page }) => {
    await page.goto('/settings');
    await page.getByRole('navigation').getByRole('link', { name: /notifications/i }).click();
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Settings" [level=1]
        - paragraph: Manage your account settings and set e-mail preferences.
        - complementary:
          - navigation:
            - link "Profile":
              - /url: /settings
            - link "Account":
              - /url: /settings/account
            - link "Appearance":
              - /url: /settings/appearance
            - link "Notifications":
              - /url: /settings/notifications
            - link "Display":
              - /url: /settings/display
        - heading "Notifications" [level=3]
        - paragraph: Configure how you receive notifications.
        - text: Notify me about...
        - radiogroup:
          - radio "All new messages"
          - text: All new messages
          - radio "Direct messages and mentions"
          - text: Direct messages and mentions
          - radio "Nothing"
          - text: Nothing
        - heading "Email Notifications" [level=3]
        - text: Communication emails
        - paragraph: Receive emails about your account activity.
        - switch "Communication emails"
        - text: Marketing emails
        - paragraph: Receive emails about new products, features, and more.
        - switch "Marketing emails"
        - text: Social emails
        - paragraph: Receive emails for friend requests, follows, and more.
        - switch "Social emails" [checked]
        - text: Security emails
        - paragraph: Receive emails about your account activity and security.
        - switch "Security emails" [checked] [disabled]
        - checkbox "Use different settings for my mobile devices"
        - text: Use different settings for my mobile devices
        - paragraph:
          - text: You can manage your mobile notifications in the
          - link "mobile settings":
            - /url: /settings
          - text: page.
        - button "Update notifications"
    `);
  });

  test('SET-W4: User can navigate to Display settings', async ({ page }) => {
    await page.goto('/settings');
    await page.getByRole('navigation').getByRole('link', { name: /display/i }).click();
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Settings" [level=1]
        - paragraph: Manage your account settings and set e-mail preferences.
        - complementary:
          - navigation:
            - link "Profile":
              - /url: /settings
            - link "Account":
              - /url: /settings/account
            - link "Appearance":
              - /url: /settings/appearance
            - link "Notifications":
              - /url: /settings/notifications
            - link "Display":
              - /url: /settings/display
        - heading "Display" [level=3]
        - paragraph: Turn items on or off to control what's displayed in the app.
        - text: Sidebar
        - paragraph: Select the items you want to display in the sidebar.
        - checkbox "Recents" [checked]
        - text: Recents
        - checkbox "Home" [checked]
        - text: Home
        - checkbox "Applications"
        - text: Applications
        - checkbox "Desktop"
        - text: Desktop
        - checkbox "Downloads"
        - text: Downloads
        - checkbox "Documents"
        - text: Documents
        - button "Update display"
    `);
  });

  test('SET-W5: User can navigate back to Profile from Account', async ({ page }) => {
    await page.goto('/settings/account');
    await page.getByRole('navigation').getByRole('link', { name: /profile/i }).click();
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Settings" [level=1]
        - paragraph: Manage your account settings and set e-mail preferences.
        - complementary:
          - navigation:
            - link "Profile":
              - /url: /settings
            - link "Account":
              - /url: /settings/account
            - link "Appearance":
              - /url: /settings/appearance
            - link "Notifications":
              - /url: /settings/notifications
            - link "Display":
              - /url: /settings/display
        - heading "Profile" [level=3]
        - paragraph: This is how others will see you on the site.
        - text: Username
        - textbox "Username":
          - /placeholder: shadcn
        - paragraph: /This is your public display name\\. It can be your real name or a pseudonym\\. You can only change this once every \\d+ days\\./
        - text: Email
        - combobox "Email": Select a verified email to display
        - paragraph:
          - text: You can manage verified email addresses in your
          - link "email settings":
            - /url: /
          - text: .
        - text: Bio
        - textbox "Bio":
          - /placeholder: Tell us a little bit about yourself
          - text: I own a computer.
        - paragraph: You can @mention other users and organizations to link to them.
        - text: URLs
        - paragraph: Add links to your website, blog, or social media profiles.
        - textbox "URLs": https://shadcn.com
        - text: URLs
        - paragraph: Add links to your website, blog, or social media profiles.
        - textbox "URLs": http://twitter.com/shadcn
        - button "Add URL"
        - button "Update profile"
    `);
  });
});

test.describe('Settings Profile Form Validation', () => {
  test('SET-W6: Profile form shows validation on empty username', async ({ page }) => {
    await page.goto('/settings');
    await page.getByLabel(/username/i).clear();
    await page.getByRole('button', { name: /update profile/i }).click();
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Settings" [level=1]
        - paragraph: Manage your account settings and set e-mail preferences.
        - complementary:
          - navigation:
            - link "Profile":
              - /url: /settings
            - link "Account":
              - /url: /settings/account
            - link "Appearance":
              - /url: /settings/appearance
            - link "Notifications":
              - /url: /settings/notifications
            - link "Display":
              - /url: /settings/display
        - heading "Profile" [level=3]
        - paragraph: This is how others will see you on the site.
        - text: Username
        - textbox "Username":
          - /placeholder: shadcn
        - paragraph: /This is your public display name\\. It can be your real name or a pseudonym\\. You can only change this once every \\d+ days\\./
        - paragraph: Please enter your username.
        - text: Email
        - combobox "Email": Select a verified email to display
        - paragraph:
          - text: You can manage verified email addresses in your
          - link "email settings":
            - /url: /
          - text: .
        - paragraph: Please select an email to display.
        - text: Bio
        - textbox "Bio":
          - /placeholder: Tell us a little bit about yourself
          - text: I own a computer.
        - paragraph: You can @mention other users and organizations to link to them.
        - text: URLs
        - paragraph: Add links to your website, blog, or social media profiles.
        - textbox "URLs": https://shadcn.com
        - text: URLs
        - paragraph: Add links to your website, blog, or social media profiles.
        - textbox "URLs": http://twitter.com/shadcn
        - button "Add URL"
        - button "Update profile"
    `);
  });

  test('SET-W7: Profile form shows validation on short username', async ({ page }) => {
    await page.goto('/settings');
    await page.getByLabel(/username/i).fill('a');
    await page.getByRole('button', { name: /update profile/i }).click();
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Settings" [level=1]
        - paragraph: Manage your account settings and set e-mail preferences.
        - complementary:
          - navigation:
            - link "Profile":
              - /url: /settings
            - link "Account":
              - /url: /settings/account
            - link "Appearance":
              - /url: /settings/appearance
            - link "Notifications":
              - /url: /settings/notifications
            - link "Display":
              - /url: /settings/display
        - heading "Profile" [level=3]
        - paragraph: This is how others will see you on the site.
        - text: Username
        - textbox "Username":
          - /placeholder: shadcn
          - text: ""
        - paragraph: /This is your public display name\\. It can be your real name or a pseudonym\\. You can only change this once every \\d+ days\\./
        - paragraph: Username must be at least 2 characters.
        - text: Email
        - combobox "Email": Select a verified email to display
        - paragraph:
          - text: You can manage verified email addresses in your
          - link "email settings":
            - /url: /
          - text: .
        - paragraph: Please select an email to display.
        - text: Bio
        - textbox "Bio":
          - /placeholder: Tell us a little bit about yourself
          - text: I own a computer.
        - paragraph: You can @mention other users and organizations to link to them.
        - text: URLs
        - paragraph: Add links to your website, blog, or social media profiles.
        - textbox "URLs": https://shadcn.com
        - text: URLs
        - paragraph: Add links to your website, blog, or social media profiles.
        - textbox "URLs": http://twitter.com/shadcn
        - button "Add URL"
        - button "Update profile"
    `);
  });

  test('SET-W8: Profile form shows validation when no email selected', async ({ page }) => {
    await page.goto('/settings');
    await page.getByLabel(/username/i).fill('validuser');
    await page.getByRole('button', { name: /update profile/i }).click();
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Settings" [level=1]
        - paragraph: Manage your account settings and set e-mail preferences.
        - complementary:
          - navigation:
            - link "Profile":
              - /url: /settings
            - link "Account":
              - /url: /settings/account
            - link "Appearance":
              - /url: /settings/appearance
            - link "Notifications":
              - /url: /settings/notifications
            - link "Display":
              - /url: /settings/display
        - heading "Profile" [level=3]
        - paragraph: This is how others will see you on the site.
        - text: Username
        - textbox "Username":
          - /placeholder: shadcn
          - text: validuser
        - paragraph: /This is your public display name\\. It can be your real name or a pseudonym\\. You can only change this once every \\d+ days\\./
        - text: Email
        - combobox "Email": Select a verified email to display
        - paragraph:
          - text: You can manage verified email addresses in your
          - link "email settings":
            - /url: /
          - text: .
        - paragraph: Please select an email to display.
        - text: Bio
        - textbox "Bio":
          - /placeholder: Tell us a little bit about yourself
          - text: I own a computer.
        - paragraph: You can @mention other users and organizations to link to them.
        - text: URLs
        - paragraph: Add links to your website, blog, or social media profiles.
        - textbox "URLs": https://shadcn.com
        - text: URLs
        - paragraph: Add links to your website, blog, or social media profiles.
        - textbox "URLs": http://twitter.com/shadcn
        - button "Add URL"
        - button "Update profile"
    `);
  });

  test('SET-W9: Profile form shows validation on short bio', async ({ page }) => {
    await page.goto('/settings');
    await page.getByLabel(/bio/i).clear();
    await page.getByLabel(/bio/i).fill('Hi');
    await page.getByRole('button', { name: /update profile/i }).click();
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Settings" [level=1]
        - paragraph: Manage your account settings and set e-mail preferences.
        - complementary:
          - navigation:
            - link "Profile":
              - /url: /settings
            - link "Account":
              - /url: /settings/account
            - link "Appearance":
              - /url: /settings/appearance
            - link "Notifications":
              - /url: /settings/notifications
            - link "Display":
              - /url: /settings/display
        - heading "Profile" [level=3]
        - paragraph: This is how others will see you on the site.
        - text: Username
        - textbox "Username":
          - /placeholder: shadcn
        - paragraph: /This is your public display name\\. It can be your real name or a pseudonym\\. You can only change this once every \\d+ days\\./
        - paragraph: Please enter your username.
        - text: Email
        - combobox "Email": Select a verified email to display
        - paragraph:
          - text: You can manage verified email addresses in your
          - link "email settings":
            - /url: /
          - text: .
        - paragraph: Please select an email to display.
        - text: Bio
        - textbox "Bio":
          - /placeholder: Tell us a little bit about yourself
          - text: ""
        - paragraph: You can @mention other users and organizations to link to them.
        - paragraph: "Too small: expected string to have >=4 characters"
        - text: URLs
        - paragraph: Add links to your website, blog, or social media profiles.
        - textbox "URLs": https://shadcn.com
        - text: URLs
        - paragraph: Add links to your website, blog, or social media profiles.
        - textbox "URLs": http://twitter.com/shadcn
        - button "Add URL"
        - button "Update profile"
    `);
  });
});

test.describe('Settings Account Form Validation', () => {
  test('SET-W10: Account form shows validation on empty name', async ({ page }) => {
    await page.goto('/settings/account');
    await page.getByLabel(/name/i).first().clear();
    await page.getByRole('button', { name: /update account/i }).click();
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Settings" [level=1]
        - paragraph: Manage your account settings and set e-mail preferences.
        - complementary:
          - navigation:
            - link "Profile":
              - /url: /settings
            - link "Account":
              - /url: /settings/account
            - link "Appearance":
              - /url: /settings/appearance
            - link "Notifications":
              - /url: /settings/notifications
            - link "Display":
              - /url: /settings/display
        - heading "Account" [level=3]
        - paragraph: Update your account settings. Set your preferred language and timezone.
        - text: Name
        - textbox "Name":
          - /placeholder: Your name
        - paragraph: This is the name that will be displayed on your profile and in emails.
        - paragraph: Please enter your name.
        - text: Date of birth
        - button "Pick a date"
        - paragraph: Your date of birth is used to calculate your age.
        - paragraph: Please select your date of birth.
        - text: Language
        - combobox "Language":
          - text: Select language
          - img
        - paragraph: This is the language that will be used in the dashboard.
        - paragraph: Please select a language.
        - button "Update account"
    `);
  });

  test('SET-W11: Account form shows validation on short name', async ({ page }) => {
    await page.goto('/settings/account');
    await page.getByLabel(/name/i).first().fill('a');
    await page.getByRole('button', { name: /update account/i }).click();
    await expect(page.locator('main')).toMatchAriaSnapshot(`
      - main:
        - heading "Settings" [level=1]
        - paragraph: Manage your account settings and set e-mail preferences.
        - complementary:
          - navigation:
            - link "Profile":
              - /url: /settings
            - link "Account":
              - /url: /settings/account
            - link "Appearance":
              - /url: /settings/appearance
            - link "Notifications":
              - /url: /settings/notifications
            - link "Display":
              - /url: /settings/display
        - heading "Account" [level=3]
        - paragraph: Update your account settings. Set your preferred language and timezone.
        - text: Name
        - textbox "Name":
          - /placeholder: Your name
          - text: ""
        - paragraph: This is the name that will be displayed on your profile and in emails.
        - paragraph: Name must be at least 2 characters.
        - text: Date of birth
        - button "Pick a date"
        - paragraph: Your date of birth is used to calculate your age.
        - paragraph: Please select your date of birth.
        - text: Language
        - combobox "Language":
          - text: Select language
          - img
        - paragraph: This is the language that will be used in the dashboard.
        - paragraph: Please select a language.
        - button "Update account"
    `);
  });
});
