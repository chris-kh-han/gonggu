# Testing Guide

## 테스트 스택

- **Vitest** - 유닛/통합 테스트
- **Playwright** - E2E 테스트
- **Testing Library** - React 컴포넌트 테스트

## 명령어

```bash
pnpm test              # Vitest 실행 (watch 모드)
pnpm test --run        # Vitest 1회 실행
pnpm test:coverage     # 커버리지 리포트 생성
pnpm test:e2e          # Playwright E2E 테스트
```

## 디렉토리 구조

```
__tests__/
├── unit/              # 유닛 테스트 (순수 함수, 유틸리티)
│   └── categories.test.ts
├── integration/       # 통합 테스트 (API, 컴포넌트 + 의존성)
│   └── api/
│       └── views.test.ts
└── e2e/               # E2E 테스트 (Playwright)
    └── gonggu-list.spec.ts
```

## 테스트 작성 규칙

### 파일 네이밍

- 유닛/통합: `*.test.ts` 또는 `*.test.tsx`
- E2E: `*.spec.ts`

### 유닛 테스트 예시

```typescript
import { describe, it, expect } from 'vitest'
import { getCategoryGroup } from '@/lib/categories'

describe('getCategoryGroup', () => {
  it('should return correct group for sub-category', () => {
    expect(getCategoryGroup('스킨케어')).toBe('뷰티')
  })

  it('should return null for unknown category', () => {
    expect(getCategoryGroup('알수없음')).toBeNull()
  })
})
```

### API 통합 테스트 예시

```typescript
import { describe, it, expect, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/views/route'

// Supabase 모킹
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve({
    from: vi.fn(() => ({ /* 체이닝 mock */ })),
    rpc: vi.fn(() => Promise.resolve({ error: null })),
  })),
}))

describe('POST /api/views', () => {
  it('should return 400 if postId is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/views', {
      method: 'POST',
      body: JSON.stringify({}),
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })
})
```

### E2E 테스트 예시

```typescript
import { test, expect } from '@playwright/test'

test.describe('공구 목록 페이지', () => {
  test('should load the main page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/공구/)
  })

  test('should filter by category', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /뷰티/ }).click()
    await expect(page).toHaveURL(/category=뷰티/)
  })
})
```

## Mocking

### Supabase 클라이언트 모킹

```typescript
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve({
    from: vi.fn((table) => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: mockData })),
        })),
      })),
      insert: vi.fn(() => Promise.resolve({ error: null })),
    })),
    rpc: vi.fn((fnName, params) => Promise.resolve({ data: null, error: null })),
  })),
}))
```

## 커버리지

커버리지 리포트 생성 후 `coverage/` 디렉토리에서 확인:

```bash
pnpm test:coverage
open coverage/index.html  # HTML 리포트 확인
```

### 커버리지 제외 항목

- `node_modules/`
- `__tests__/`
- 타입 정의 파일 (`*.d.ts`)
- 설정 파일 (`*.config.ts`)

## E2E 테스트 환경

Playwright는 테스트 실행 전 자동으로 dev 서버를 시작합니다.

```typescript
// playwright.config.ts
webServer: {
  command: 'pnpm dev',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
}
```

CI 환경에서는 새 서버를 시작하고, 로컬에서는 기존 서버를 재사용합니다.

## CI 환경 설정

```yaml
# GitHub Actions 예시
- name: Install dependencies
  run: pnpm install

- name: Run unit tests
  run: pnpm test --run

- name: Install Playwright browsers
  run: pnpm exec playwright install --with-deps chromium

- name: Run E2E tests
  run: pnpm test:e2e
```

## 테스트 추가 시 체크리스트

- [ ] 함수/유틸리티 → `__tests__/unit/`에 유닛 테스트
- [ ] API 라우트 → `__tests__/integration/api/`에 통합 테스트
- [ ] 컴포넌트 → `__tests__/integration/components/`에 통합 테스트
- [ ] 사용자 플로우 → `__tests__/e2e/`에 E2E 테스트
