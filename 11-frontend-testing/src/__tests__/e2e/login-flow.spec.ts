import { test, expect } from '@playwright/test';

test('login page loads and shows form', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('h1')).toContainText('Login');
  await expect(page.locator('input[name="username"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
});

test('can log in and log out through the full server-action flow', async ({ page, request }) => {
  const username = `e2e-user-${Date.now()}`;
  const password = 'password123';

  const registerResponse = await request.post('http://localhost:3000/api/auth/register', {
    data: { username, password },
  });
  expect(registerResponse.ok()).toBeTruthy();

  await page.goto('/login');
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByLabel('Title')).toBeVisible();

  await page.getByRole('button', { name: 'Logout' }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
});
