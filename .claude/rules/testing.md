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
├── integration/       # 통합 테스트 (API, 컴포넌트 + 의존성)
│   └── api/
└── e2e/               # E2E 테스트 (Playwright)
```
 
## 파일 네이밍
 
- 유닛/통합: `*.test.ts` 또는 `*.test.tsx`
- E2E: `*.spec.ts`
 
## 커버리지
 
- 목표: 80% 이상
- 확인: `pnpm test:coverage` → `coverage/index.html`
 
## Agent Support
 
테스트 관련 작업 시 전문 에이전트 자동 사용:
 
- **tdd-guide** - 새 기능 개발, 버그 수정 시 TDD 워크플로우 적용
- **e2e-runner** - E2E 테스트 생성, 유지보수, 실행
 
상세 예시와 Supabase 모킹 가이드는 위 에이전트 참조.