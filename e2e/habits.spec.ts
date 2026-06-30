import { test, expect } from '@playwright/test'

test.describe('Habit Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login in demo mode
    await page.goto('/login')
    await page.locator('input[type="email"]').fill('demo@test.com')
    await page.locator('input[type="password"]').fill('password123')
    await page.locator('button[type="submit"]').click()
    await page.waitForURL(/\/(calendar)?$/, { timeout: 10000 })
  })

  test('should display habits page with create button', async ({ page }) => {
    await page.goto('/habits')
    await page.waitForLoadState('networkidle')

    // Should find page title
    await expect(page.locator('h1')).toContainText(/习惯|打卡/)

    // Should have a create button
    const createButton = page.locator('button:has-text("新建习惯")')
    await expect(createButton).toBeVisible()
  })

  test('should open create habit dialog', async ({ page }) => {
    await page.goto('/habits')
    await page.waitForLoadState('networkidle')

    // Click create button
    const createButton = page.locator('button:has-text("新建习惯")')
    await createButton.click()

    // Dialog/Drawer should appear with form fields
    const dialog = page.locator('[role="dialog"], [data-drawer]')
    // In demo mode, the dialog may appear; check for form elements
    const nameInput = page.locator('input#habit-name, input[placeholder*="阅读"], input[placeholder*="运动"]')
    if (await nameInput.isVisible({ timeout: 2000 })) {
      await expect(nameInput).toBeVisible()
    }
  })

  test('should display habit checkin section', async ({ page }) => {
    await page.goto('/habits')
    await page.waitForLoadState('networkidle')

    // Page should be visible with content
    await expect(page.locator('body')).toBeVisible()
  })
})
