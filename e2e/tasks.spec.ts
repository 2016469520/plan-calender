import { test, expect } from '@playwright/test'

test.describe('App Smoke Tests', () => {
  test('login page renders in demo/supabase mode', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('button[type="submit"]').first()).toBeVisible()
  })

  test('root redirects to login for unauthenticated users', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 })
  })

  test('/calendar redirects to login for unauthenticated users', async ({ page }) => {
    await page.goto('/calendar')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 })
  })

  test('/habits redirects to login for unauthenticated users', async ({ page }) => {
    await page.goto('/habits')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 })
  })

  test('/settings redirects to login for unauthenticated users', async ({ page }) => {
    await page.goto('/settings')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 })
  })

  test('/focus redirects to login for unauthenticated users', async ({ page }) => {
    await page.goto('/focus')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 })
  })

  test('no internal enum values on login page', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const bodyText = await page.locator('body').textContent()
    // Raw enum values must never appear in UI
    expect(bodyText).not.toContain('"morning"')
    expect(bodyText).not.toContain('"medium"')
    expect(bodyText).not.toContain('"todo"')
    expect(bodyText).not.toContain('"none"')
  })

  test('mobile viewport renders login page correctly', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('body')).toBeVisible()
  })

  test('local demo mode opens the task-first app and persists after refresh', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    await page.getByTestId('enter-demo-mode').click()
    await expect(page).toHaveURL(/\/calendar/, { timeout: 15000 })
    await expect(page.getByRole('link', { name: '日历', exact: true })).toBeVisible({ timeout: 15000 })

    await page.goto('/schedule')
    await expect(page).toHaveURL(/\/schedule/, { timeout: 15000 })
    await page.reload()
    await expect(page).toHaveURL(/\/schedule/, { timeout: 15000 })
    await expect(page.locator('body')).not.toContainText('[object Object]')
  })
})
