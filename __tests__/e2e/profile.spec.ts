import { test, expect } from '@playwright/test'

test.describe('Profile Page', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/profile')

    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/)
  })

  test('should display user profile when authenticated', async ({ page, context }) => {
    // TODO: This test requires authentication setup
    // For now, this is a placeholder that will be implemented
    // when authentication is fully set up in Phase 2
    test.skip()
  })

  test('should display activity stats', async ({ page, context }) => {
    // TODO: This test requires authentication setup
    test.skip()
  })

  test('should display earned badges', async ({ page, context }) => {
    // TODO: This test requires authentication setup
    test.skip()
  })

  test('should show loading skeleton initially', async ({ page, context }) => {
    // TODO: This test requires authentication setup
    test.skip()
  })
})
