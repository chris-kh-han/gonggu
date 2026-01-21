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
    await expect(beautyButton).toBeVisible()
    await beautyButton.click()

    // 버튼이 선택 상태로 변경되었는지 확인 (배경색 변경)
    await expect(beautyButton).toHaveClass(/text-white/)
  })

  test('should display gonggu cards or empty state', async ({ page }) => {
    await page.goto('/')

    // 로딩 완료 대기
    await page.waitForLoadState('networkidle')

    // 공구 카드 (article 또는 Card 컴포넌트)
    const cards = page.locator('article, [class*="rounded-xl"][class*="shadow"]')
    // 빈 상태 메시지
    const emptyState = page.getByText(/공구가 없습니다/)

    // 카드가 있거나 빈 상태 메시지가 표시되어야 함
    const cardCount = await cards.count()
    const isEmpty = await emptyState.isVisible().catch(() => false)

    expect(cardCount > 0 || isEmpty).toBeTruthy()
  })
})
