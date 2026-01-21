# Testing Guide

## Test Stack

- **Vitest** - Unit/Integration tests
- **Playwright** - E2E tests
- **Testing Library** - React component tests

## Commands

```bash
pnpm test              # Run Vitest (watch mode)
pnpm test --run        # Run Vitest once
pnpm test:coverage     # Generate coverage report
pnpm test:e2e          # Run Playwright E2E tests
```

## Directory Structure

```
__tests__/
├── unit/              # Unit tests (pure functions, utilities)
├── integration/       # Integration tests (API, components + dependencies)
│   └── api/
└── e2e/               # E2E tests (Playwright)
```

## File Naming

- Unit/Integration: `*.test.ts` or `*.test.tsx`
- E2E: `*.spec.ts`

## Coverage

- Target: 80%+
- Check: `pnpm test:coverage` → `coverage/index.html`

## Agent Support

Specialized agents are automatically used for testing tasks:

- **tdd-guide** - Apply TDD workflow for new features and bug fixes
- **e2e-runner** - Create, maintain, and run E2E tests

Refer to the above agents for detailed examples and Supabase mocking guide.
