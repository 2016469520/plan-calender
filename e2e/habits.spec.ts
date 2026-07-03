import { test, expect } from '@playwright/test'

test.describe('Habit Management', () => {
  test('login page renders before auth', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 })
  })

  test('habits page redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/habits')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 })
  })
})
