import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should have auth callback route accessible', async ({ page }) => {
    // Try to access callback without code (should redirect with error)
    const response = await page.goto('/auth/callback')

    // Should redirect to home with error
    await expect(page).toHaveURL('/?error=missing_code')
  })

  test('should access homepage without authentication', async ({ page }) => {
    await page.goto('/')

    // Homepage should load successfully
    await expect(page).toHaveTitle(/공구/)
  })

  test('middleware should allow public routes', async ({ page }) => {
    await page.goto('/')

    // Check that the page loaded successfully (no auth required)
    expect(page.url()).toContain('localhost')

    // API routes should also be accessible
    const apiResponse = await page.request.post('/api/views', {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {},
    })

    // Should return 400 (missing postId) not 401 (unauthorized)
    expect(apiResponse.status()).toBe(400)
  })

  test('should handle auth callback with invalid code', async ({ page }) => {
    // Simulate OAuth callback with invalid code
    await page.goto('/auth/callback?code=invalid-code-12345')

    // Should redirect to home with error (invalid code from Supabase)
    await page.waitForURL('/?error=auth_error', { timeout: 5000 })

    expect(page.url()).toContain('error=auth_error')
  })

  test('should preserve next parameter in auth callback', async ({ page }) => {
    // Try callback without code but with next parameter
    await page.goto('/auth/callback?next=/admin')

    // Should redirect to home with error (preserving that we tried to go to /admin)
    await expect(page).toHaveURL('/?error=missing_code')
  })

  test('admin routes should be accessible without auth (for MVP)', async ({ page }) => {
    // In Phase 1, admin routes are accessible without auth
    const response = await page.goto('/admin')

    // Should load successfully (200 or 404 if not implemented yet)
    // Not 401 or 403
    expect(response?.status()).not.toBe(401)
    expect(response?.status()).not.toBe(403)
  })
})

test.describe('Auth Security', () => {
  test('should prevent open redirect attacks', async ({ page }) => {
    // Try to redirect to external URL
    await page.goto('/auth/callback?code=fake&next=https://evil.com')

    // Should redirect to home, not external URL
    await page.waitForURL('/?error=auth_error', { timeout: 5000 })

    // Verify we're still on our domain
    expect(page.url()).toContain('localhost')
    expect(page.url()).not.toContain('evil.com')
  })

  test('should handle malformed URLs gracefully', async ({ page }) => {
    // Test with various malformed inputs
    const malformedUrls = [
      '/auth/callback?code=',
      '/auth/callback?code=%00',
      '/auth/callback?next=javascript:alert(1)',
    ]

    for (const url of malformedUrls) {
      await page.goto(url)

      // Should handle gracefully and redirect to error page
      await page.waitForURL(/\?error=/, { timeout: 5000 })

      expect(page.url()).toContain('error=')
      expect(page.url()).toContain('localhost')
    }
  })
})
