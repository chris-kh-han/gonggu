import { test, expect } from '@playwright/test'

test.describe('공구 목록 페이지', () => {
  test('should load the main page', async ({ page }) => {
    await page.goto('/')

    // 페이지 제목 확인
    await expect(page).toHaveTitle(/공구/)
  })

  test('should display category filter', async ({ page }) => {
    await page.goto('/')

    // 카테고리 필터 버튼들 확인
    await expect(page.getByRole('button', { name: /전체/ })).toBeVisible()
  })

  test('should filter by category when clicked', async ({ page }) => {
    await page.goto('/')

    // 뷰티 카테고리 클릭
    const beautyButton = page.getByRole('button', { name: /뷰티/ })
    if (await beautyButton.isVisible()) {
      await beautyButton.click()

      // URL에 카테고리 파라미터 확인
      await expect(page).toHaveURL(/category=뷰티/)
    }
  })

  test('should display gonggu cards when data exists', async ({ page }) => {
    await page.goto('/')

    // 공구 카드가 있으면 표시되어야 함 (데이터 의존적)
    const cards = page.locator('[data-testid="gonggu-card"]')
    const emptyState = page.getByText(/등록된 공구가 없습니다/)

    // 카드가 있거나 빈 상태 메시지가 표시되어야 함
    const hasCards = await cards.count() > 0
    const isEmpty = await emptyState.isVisible()

    expect(hasCards || isEmpty).toBeTruthy()
  })
})
