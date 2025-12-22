# Gonggu Finder

Instagram group buying (공구) deal aggregation platform.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript (strict mode)
- Tailwind CSS 4
- shadcn/ui
- Supabase (DB + Auth)
- pnpm

## Commands

```bash
pnpm dev      # Start development server
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Project Structure

```
app/
├── layout.tsx
├── page.tsx          # 공구 목록 (메인)
├── globals.css
└── admin/            # 관리자 입력 페이지
components/
├── ui/               # shadcn components
└── gonggu/           # 공구 관련 컴포넌트
lib/
├── supabase/
│   ├── client.ts
│   └── server.ts
└── utils.ts
types/
└── database.types.ts
```

## Data Model

```
sellers (판매자)
- id, instagram_username, profile_url, category

gonggu_posts (공구 게시물)
- id, seller_id, instagram_url, title, price, deadline, status, created_at
```

## UI Design System

### Layout

- Mobile first (max-w-md 기본)
- 카드형 리스트 레이아웃

### Colors

- Primary: violet (보라 계열)
- Seconday: #F3F4F6 계열
- Text: #111827
- Background: slate-50
- Card: white, shadow-sm

### Components

- shadcn/ui 우선 사용
- Button: rounded-lg
- Card: p-4, rounded-xl

### Spacing

- 기본 gap: gap-4
- 섹션 간격: py-6

## Phase 1 Scope (MVP)

- [x] 공구 목록 조회
- [x] 카테고리 필터
- [x] 마감임박순/최신순 정렬
- [x] 관리자 수동 입력
- [ ] 유저 로그인 (Phase 2)
- [ ] 찜하기/알림 (Phase 2)

## Conventions

- Use App Router patterns
- Path alias: `@/*` maps to project root
- Server components by default, 'use client' only when needed
- Korean comments OK
