import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('displays login page', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByText('B2B Automation Hub')).toBeVisible();
    await expect(page.getByText('Sign in to your account')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('logs in with valid admin credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[type="email"]', 'admin@b2bhub.com');
    await page.fill('input[type="password"]', 'Admin123!');
    await page.click('button[type="submit"]');

    await page.waitForURL('/');
    await expect(page.getByText('admin')).toBeVisible();
  });

  test('shows error with wrong credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[type="email"]', 'admin@b2bhub.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.getByText(/Invalid credentials|Authentication failed/)).toBeVisible();
  });

  test('can switch to register mode', async ({ page }) => {
    await page.goto('/login');

    await page.click('text=Create an account');
    await expect(page.getByLabel('Name')).toBeVisible();
    await expect(page.getByText('Create Account')).toBeVisible();
  });
});
