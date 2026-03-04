import { test, expect } from '@playwright/test';

test('login page loads and shows form', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('h1')).toContainText('Login');
  await expect(page.locator('input[name="username"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
});

test('homepage shows book catalog heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Book Catalog');
});
