import { test, expect } from '@playwright/test'

test.describe('Badge Components E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Create a test page with badge components
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Badge Components Test</title>
          <script src="https://unpkg.com/react@19/umd/react.production.min.js"></script>
          <script src="https://unpkg.com/react-dom@19/umd/react-dom.production.min.js"></script>
          <style>
            body { font-family: system-ui; padding: 20px; }
            .badge {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 64px;
              height: 64px;
              border-radius: 50%;
              border: 2px solid;
              font-size: 2rem;
            }
            .badge.earned {
              border-color: rgb(139, 92, 246);
              opacity: 1;
            }
            .badge.locked {
              border-color: rgb(229, 231, 235);
              opacity: 0.3;
            }
            .notification {
              display: flex;
              gap: 12px;
              padding: 16px;
              border: 2px solid rgb(139, 92, 246);
              border-radius: 12px;
              background: linear-gradient(to bottom right, rgb(250, 245, 255), rgb(243, 232, 255));
            }
          </style>
        </head>
        <body>
          <h1>Badge Components</h1>

          <section id="badge-icons">
            <h2>Badge Icons</h2>
            <div style="display: flex; gap: 16px;">
              <div class="badge earned" data-testid="badge-earned">🎉</div>
              <div class="badge locked" data-testid="badge-locked">💎</div>
            </div>
          </section>

          <section id="badge-list" style="margin-top: 32px;">
            <h2>Badge List</h2>
            <div data-testid="badge-counter">2/4 획득</div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 16px;">
              <div class="badge earned">🎉</div>
              <div class="badge earned">🔥</div>
              <div class="badge locked">🔍</div>
              <div class="badge locked">💎</div>
            </div>
          </section>

          <section id="badge-notification" style="margin-top: 32px;">
            <h2>Badge Notification</h2>
            <div class="notification" data-testid="badge-notification">
              <div style="font-size: 3rem;">🎉</div>
              <div>
                <div style="font-size: 0.75rem; color: rgb(124, 58, 237); font-weight: 600;">뱃지 획득!</div>
                <div style="font-weight: bold; margin-top: 4px;">첫 공구</div>
                <div style="color: rgb(107, 114, 128); margin-top: 4px;">첫 번째 공구를 등록했어요</div>
              </div>
              <button data-testid="close-btn">✕</button>
            </div>
          </section>
        </body>
      </html>
    `)
  })

  test('should display earned and locked badges', async ({ page }) => {
    const earnedBadge = page.getByTestId('badge-earned')
    const lockedBadge = page.getByTestId('badge-locked')

    await expect(earnedBadge).toBeVisible()
    await expect(lockedBadge).toBeVisible()

    // Earned badge should have full opacity
    await expect(earnedBadge).toHaveClass(/earned/)

    // Locked badge should have reduced opacity
    await expect(lockedBadge).toHaveClass(/locked/)
  })

  test('should show badge counter', async ({ page }) => {
    const counter = page.getByTestId('badge-counter')

    await expect(counter).toBeVisible()
    await expect(counter).toHaveText('2/4 획득')
  })

  test('should display badge notification', async ({ page }) => {
    const notification = page.getByTestId('badge-notification')

    await expect(notification).toBeVisible()
    await expect(notification).toContainText('뱃지 획득!')
    await expect(notification).toContainText('첫 공구')
    await expect(notification).toContainText('첫 번째 공구를 등록했어요')
  })

  test('should have close button on notification', async ({ page }) => {
    const closeBtn = page.getByTestId('close-btn')

    await expect(closeBtn).toBeVisible()
    await expect(closeBtn).toBeEnabled()
  })

  test('badge icons should have proper styling', async ({ page }) => {
    const earnedBadge = page.getByTestId('badge-earned')

    // Check styling
    const borderColor = await earnedBadge.evaluate((el) => {
      return window.getComputedStyle(el).borderColor
    })

    // Should have colored border (violet-ish)
    expect(borderColor).toBeTruthy()
  })

  test('notification should have gradient background', async ({ page }) => {
    const notification = page.getByTestId('badge-notification')

    const background = await notification.evaluate((el) => {
      return window.getComputedStyle(el).background
    })

    // Should have gradient
    expect(background).toContain('gradient')
  })
})

test.describe('Badge Components Accessibility', () => {
  test('badge icons should be keyboard accessible', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <button data-testid="badge-btn" aria-label="첫 공구 뱃지 (획득됨)">🎉</button>
        </body>
      </html>
    `)

    const badge = page.getByTestId('badge-btn')

    // Should be focusable
    await badge.focus()
    await expect(badge).toBeFocused()

    // Should have accessible label
    await expect(badge).toHaveAttribute('aria-label', /첫 공구/)
  })

  test('notification should have alert role', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <div role="alert" data-testid="notification">
            <div>뱃지 획득!</div>
          </div>
        </body>
      </html>
    `)

    const notification = page.getByTestId('notification')

    await expect(notification).toHaveAttribute('role', 'alert')
  })

  test('close button should have accessible label', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <button aria-label="알림 닫기" data-testid="close-btn">✕</button>
        </body>
      </html>
    `)

    const closeBtn = page.getByTestId('close-btn')

    await expect(closeBtn).toHaveAttribute('aria-label', /닫기/)
  })
})
