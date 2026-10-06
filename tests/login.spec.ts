import { test, expect } from '@playwright/test';
import { users } from '../test-data/users';
import { messages } from '../test-data/messages';

const validUsers = [
  users.standard,
  users.problem,
  users.performanceGlitch,
  users.error,
  users.visual,
];

for (const user of validUsers) {
  test(`${user.username} can log in`, async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByLabel('Username').fill(user.username);
    await page.getByLabel('Password').fill(user.password);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/inventory/);
  });
}

test('locked out user sees an error', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByLabel('Username').fill(users.lockedOut.username);
  await page.getByLabel('Password').fill(users.lockedOut.password);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('[data-test="error"]')).toHaveText(messages.lockedOut);
});

test('user cannot log in with empty username', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByLabel('Password').fill(users.standard.password);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('[data-test="error"]')).toHaveText(messages.usernameRequired);
});

test('user cannot log in with empty password', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByLabel('Username').fill(users.standard.username);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('[data-test="error"]')).toHaveText(messages.passwordRequired);
}); 

test('user cannot log in with invalid credentials', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByLabel('Username').fill(users.standard.username);
  await page.getByLabel('Password').fill('wrong_password');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('[data-test="error"]')).toHaveText(messages.wrongCredentials);
}); 
