import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should load the app and redirect to calendar', async ({ page }) => {
    await page.goto('/')
    // Should redirect to login or calendar depending on auth state
    await expect(page).toHaveURL(/\/(login|calendar)/)
  })

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('h1, h2').first()).toBeVisible()
    // Demo mode: login form should be rendered
    await expect(page.locator('input[type="email"]')).toBeVisible()
  })

  test('should login in demo mode and navigate to calendar', async ({ page }) => {
    await page.goto('/login')

    // Fill in demo credentials
    await page.locator('input[type="email"]').fill('demo@test.com')
    await page.locator('input[type="password"]').fill('password123')
    await page.locator('button[type="submit"]').click()

    // Should navigate to calendar after login
    await page.waitForURL(/\/(calendar)?$/, { timeout: 10000 })

    // Calendar page should show date navigation
    await expect(page.locator('h2').first()).toBeVisible()
  })

  test('should navigate between views via sidebar', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.locator('input[type="email"]').fill('demo@test.com')
    await page.locator('input[type="password"]').fill('password123')
    await page.locator('button[type="submit"]').click()
    await page.waitForURL(/\/(calendar)?$/, { timeout: 10000 })

    // Navigate to today
    const todayLink = page.locator('a[href="/today"]')
    if (await todayLink.isVisible()) {
      await todayLink.click()
      await page.waitForURL(/\/today/)
    }

    // Navigate to habits
    const habitsLink = page.locator('a[href="/habits"]')
    if (await habitsLink.isVisible()) {
      await habitsLink.click()
      await page.waitForURL(/\/habits/)
    }

    // Navigate to settings
    const settingsLink = page.locator('a[href="/settings"]')
    if (await settingsLink.isVisible()) {
      await settingsLink.click()
      await page.waitForURL(/\/settings/)
      await expect(page.locator('h1')).toContainText('设置')
    }
  })
})
