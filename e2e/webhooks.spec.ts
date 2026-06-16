import { test, expect } from '@playwright/test';

test.describe('Webhook Router', () => {
  test('displays webhook page with tester', async ({ page }) => {
    await page.goto('/webhooks');

    await expect(page.getByText('Webhook Router')).toBeVisible();
    await expect(page.getByText('Simulate Webhook')).toBeVisible();
  });

  test('can send a test webhook', async ({ page }) => {
    await page.goto('/webhooks');

    await page.click('button:has-text("Send Webhook")');

    await expect(page.getByText(/Delivered|Failed/)).toBeVisible({ timeout: 10000 });
  });
});
