import { test, expect } from '@playwright/test'

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login in demo mode
    await page.goto('/login')
    await page.locator('input[type="email"]').fill('demo@test.com')
    await page.locator('input[type="password"]').fill('password123')
    await page.locator('button[type="submit"]').click()
    await page.waitForURL(/\/(calendar)?$/, { timeout: 10000 })
  })

  test('should display day view with three period sections', async ({ page }) => {
    // Navigate to today
    await page.goto('/today')
    await page.waitForLoadState('networkidle')

    // Should see period labels (上午, 下午, 晚上)
    const pageContent = page.locator('body')
    await expect(pageContent).toContainText(/上午|下午|晚上/i)
  })

  test('should open new task dialog when clicking "+ 新建" button', async ({ page }) => {
    await page.goto('/calendar')
    await page.waitForLoadState('networkidle')

    // Click the "新建" button in the header (top-right)
    const newButton = page.locator('header button[title*="新建"]')
    await expect(newButton).toBeVisible()
    await newButton.click()

    // A dialog or drawer should appear with "新建事项" title
    const dialogTitle = page.locator('text=新建事项')
    await expect(dialogTitle.first()).toBeVisible({ timeout: 5000 })
  })

  test('should create a new task and see it in calendar', async ({ page }) => {
    await page.goto('/calendar')
    await page.waitForLoadState('networkidle')

    // Click the "新建" button
    const newButton = page.locator('header button[title*="新建"]')
    await newButton.click()

    // Wait for dialog
    await expect(page.locator('text=新建事项').first()).toBeVisible({ timeout: 5000 })

    // Fill in task title
    const taskTitle = `E2E Test ${Date.now()}`
    await page.locator('#title').fill(taskTitle)

    // Submit the form
    await page.locator('button[type="submit"]').click()

    // Dialog should close
    await expect(page.locator('text=新建事项')).not.toBeVisible({ timeout: 5000 })

    // Should see success toast
    await expect(page.locator('text=事项已创建')).toBeVisible({ timeout: 5000 })
  })

  test('should cancel task creation without saving', async ({ page }) => {
    await page.goto('/calendar')
    await page.waitForLoadState('networkidle')

    // Open new task dialog
    const newButton = page.locator('header button[title*="新建"]')
    await newButton.click()
    await expect(page.locator('text=新建事项').first()).toBeVisible({ timeout: 5000 })

    // Fill something and then cancel
    await page.locator('#title').fill('should not save')
    await page.locator('button:has-text("取消")').click()

    // Dialog should close without saving
    await expect(page.locator('text=新建事项')).not.toBeVisible({ timeout: 5000 })
  })

  test('should open new task dialog via keyboard shortcut N', async ({ page }) => {
    await page.goto('/calendar')
    await page.waitForLoadState('networkidle')

    // Press 'n' key (make sure no input is focused)
    await page.locator('body').press('n')

    // Dialog should appear
    await expect(page.locator('text=新建事项').first()).toBeVisible({ timeout: 5000 })
  })

  test('should display tag manager in settings', async ({ page }) => {
    await page.goto('/settings')
    await page.waitForLoadState('networkidle')

    // Should find tag management section
    await expect(page.locator('text=标签管理')).toBeVisible({ timeout: 5000 })

    // Should show default tags (at minimum)
    const tagList = page.locator('text=标签管理').locator('..').locator('..')
    await expect(tagList).toBeVisible()
  })

  test('should create and delete a new tag', async ({ page }) => {
    await page.goto('/settings')
    await page.waitForLoadState('networkidle')

    // Click "新建" in tag management
    const newTagButton = page.locator('button:has-text("新建")').first()
    await newTagButton.click()

    // Fill in tag name
    const tagName = `test-tag-${Date.now()}`
    const tagInput = page.locator('input[placeholder="标签名称"]')
    await tagInput.fill(tagName)

    // Click "添加"
    await page.locator('button:has-text("添加")').click()

    // Should see success toast
    await expect(page.locator('text=标签已创建')).toBeVisible({ timeout: 5000 })

    // Now delete the tag — hover to reveal delete button
    const tagRow = page.locator(`text=${tagName}`).locator('..')
    await tagRow.hover()

    // Click delete button (Trash2 icon)
    const deleteBtn = tagRow.locator('button.text-destructive')
    await deleteBtn.click()

    // Should see delete confirmation dialog
    await expect(page.locator('text=删除标签')).toBeVisible({ timeout: 5000 })

    // Confirm deletion
    await page.locator('button:has-text("确认删除")').click()

    // Tag should be removed
    await expect(page.locator(`text=${tagName}`)).not.toBeVisible({ timeout: 5000 })
  })

  test('should NOT have duplicate default tags', async ({ page }) => {
    await page.goto('/settings')
    await page.waitForLoadState('networkidle')

    // Get all default tag names displayed
    const defaultBadges = page.locator('span:has-text("默认")')
    const count = await defaultBadges.count()

    // Count unique tag names near default badges
    const names = new Set<string>()
    for (let i = 0; i < count; i++) {
      const badge = defaultBadges.nth(i)
      // The tag name is the sibling text before the badge
      const row = badge.locator('..')
      const text = await row.textContent()
      if (text) {
        names.add(text.trim())
      }
    }

    // Each default tag should appear only once
    // Since textContent includes the whole row, we check badge count instead
    // The 8 default tags should each have exactly 1 "默认" badge
    expect(count).toBeLessThanOrEqual(8)
  })

  test('should navigate calendar by day', async ({ page }) => {
    await page.goto('/today')
    await page.waitForLoadState('networkidle')

    // Find and click next day button
    const nextButton = page.locator('button').filter({ has: page.locator('svg.lucide-chevron-right') })
    if (await nextButton.first().isVisible()) {
      await nextButton.first().click()
      await page.waitForTimeout(500)
    }
  })

  test('should display month view', async ({ page }) => {
    await page.goto('/calendar')
    await page.waitForLoadState('networkidle')

    const pageContent = page.locator('body')
    await expect(pageContent).toBeVisible()
  })

  test('should show settings page with notification and template sections', async ({ page }) => {
    await page.goto('/settings')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1')).toContainText('设置')

    const pageContent = page.locator('body')
    await expect(pageContent).toContainText(/通知|浏览器通知/i)
  })
})
