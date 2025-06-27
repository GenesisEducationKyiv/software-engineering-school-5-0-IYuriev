import { test, expect } from '@playwright/test';

test.describe('Weather Subscription Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display weather form', async ({ page }) => {
    const form = page.locator('#weather-form');
    await expect(form).toBeVisible();
  });

  test('should fetch weather for a valid city', async ({ page }) => {
    await page.goto('/');
    await page.fill('#weather-city', 'Kyiv');
    await page.click('#weather-form button[type="submit"]');
    const result = page.locator('#weather-result');
    await expect(result).toBeVisible();
  });

  test('should show error for invalid city', async ({ page }) => {
    await page.fill('#weather-city', 'InvalidCity');
    await page.click('#weather-form button[type="submit"]');

    const error = page.locator('#weather-error');
    await expect(error).toBeVisible();
    await expect(error).toContainText('City not found');
  });

  test('should allow fetching weather for another city', async ({ page }) => {
    await page.fill('#weather-city', 'Kyiv');
    await page.click('#weather-form button[type="submit"]');

    const result = page.locator('#weather-result');
    await expect(result).toBeVisible();
    await expect(result).toContainText('Kyiv');

    await page.fill('#weather-city', 'Lviv');
    await page.click('#weather-form button[type="submit"]');

    await expect(result).toBeVisible();
    await expect(result).toContainText('Lviv');
  });

  test('should clear error message after valid input', async ({ page }) => {
    await page.fill('#weather-city', 'InvalidCity');
    await page.click('#weather-form button[type="submit"]');

    const error = page.locator('#weather-error');
    await expect(error).toBeVisible();
    await expect(error).toContainText('City not found');

    await page.fill('#weather-city', 'Kyiv');
    await page.click('#weather-form button[type="submit"]');

    await expect(error).not.toBeVisible();
  });
});
