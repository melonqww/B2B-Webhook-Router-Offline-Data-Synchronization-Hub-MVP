import { test, expect } from '@playwright/test';

test.describe('Property Search', () => {
  test('displays property search page with results', async ({ page }) => {
    await page.goto('/properties');

    await expect(page.getByText('Property Search')).toBeVisible();
    await expect(page.getByText('Filters')).toBeVisible();
  });

  test('filters by property type', async ({ page }) => {
    await page.goto('/properties');

    await page.selectOption('select', 'medical');
    await page.click('button:has-text("Search")');

    await expect(page.getByText(/Medical Tower|Clinic|Health Center/)).toBeVisible({ timeout: 5000 });
  });

  test('filters by square footage range', async ({ page }) => {
    await page.goto('/properties');

    await page.fill('input[placeholder="Min Sq Ft"]', '10000');
    await page.fill('input[placeholder="Max Sq Ft"]', '50000');
    await page.click('button:has-text("Search")');

    await expect(page.getByText(/properties found/)).toBeVisible({ timeout: 5000 });
  });

  test('resets filters', async ({ page }) => {
    await page.goto('/properties');

    await page.fill('input[placeholder="Min Sq Ft"]', '10000');
    await page.click('button:has-text("Reset")');

    await expect(page.locator('input[placeholder="Min Sq Ft"]')).toHaveValue('');
  });

  test('shows property details in table', async ({ page }) => {
    await page.goto('/properties');

    await expect(page.locator('table')).toBeVisible({ timeout: 5000 });

    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });
});
