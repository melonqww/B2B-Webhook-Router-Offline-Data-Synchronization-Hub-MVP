import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('loads dashboard page', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Enterprise B2B Automation Hub')).toBeVisible();
    await expect(page.getByText('Webhook Router')).toBeVisible();
    await expect(page.getByText('Offline Ledger')).toBeVisible();
    await expect(page.getByText('Property Search')).toBeVisible();
  });

  test('shows API health status', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText(/API healthy/)).toBeVisible({ timeout: 5000 });
  });

  test('navigates to modules via cards', async ({ page }) => {
    await page.goto('/');

    await page.click('text=Webhook Router');
    await expect(page).toHaveURL('/webhooks');

    await page.click('text=Offline Ledger');
    await expect(page).toHaveURL('/ledger');

    await page.click('text=Property Search');
    await expect(page).toHaveURL('/properties');
  });
});
