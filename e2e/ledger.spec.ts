import { test, expect } from '@playwright/test';

test.describe('Offline Ledger', () => {
  test('displays ledger page', async ({ page }) => {
    await page.goto('/ledger');

    await expect(page.getByText('Offline-First Ledger')).toBeVisible();
    await expect(page.getByText('New Ledger Entry')).toBeVisible();
  });

  test('can add a ledger entry', async ({ page }) => {
    await page.goto('/ledger');

    await page.fill('input[placeholder="Client ID"]', 'e2e_client_001');
    await page.fill('input[placeholder="Amount"]', '2500');
    await page.fill('input[placeholder="Description (optional)"]', 'E2E test entry');
    await page.click('button:has-text("Add Entry")');

    await expect(page.getByText('e2e_client_001')).toBeVisible({ timeout: 5000 });
  });

  test('shows online/offline status', async ({ page }) => {
    await page.goto('/ledger');

    await expect(page.getByText(/Online|Offline/)).toBeVisible();
  });
});
