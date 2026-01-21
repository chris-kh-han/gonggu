---
name: ui-elements
description: UI Element 디자인 가이드. "버튼 만들어줘", "카드 컴포넌트 필요해", "모달 추가해줘" 등 UI 컴포넌트 요청시 자동으로 참고. shadcn/ui + Tailwind 기반.
---

# UI Elements Guide

Based on DNAS (uxdnas.com) UI/UX Design References.

## Categories

UI elements는 4가지 카테고리로 분류됨:

1. **Input Controls** - 사용자 입력 (버튼, 폼, 체크박스 등)
2. **Navigation Components** - 네비게이션 (탭바, 메뉴 등)
3. **Informational Components** - 정보 표시 (뱃지, 토스트 등)
4. **Containers** - 콘텐츠 그룹화 (카드, 모달 등)

---

## 🚀 Screen States

### Splash
앱 시작 화면. 로고 + 로딩 표시.
```
- 중앙 정렬 로고
- 배경색: primary 또는 white
- 로딩 indicator (optional)
```

### Onboarding
첫 사용자 안내 화면.
```
- 스와이프 가능한 페이지
- 일러스트 + 설명 텍스트
- Skip 버튼 + 다음/완료 버튼
- 페이지 indicator (dots)
```

### Walkthroughs
기능 설명 튜토리얼.
```
- 특정 UI 요소 하이라이트
- 툴팁 형태 설명
- 순차적 진행
```

### Skeleton Screen
로딩 중 콘텐츠 placeholder.
```
- 실제 레이아웃과 동일한 구조
- animate-pulse 효과
- 회색 박스로 표현
```

### Empty Data
데이터 없을 때 화면.
```
- 일러스트 또는 아이콘
- 설명 텍스트
- CTA 버튼 (선택)
```

### Placeholder
입력 전 힌트 텍스트.
```
- 연한 회색 텍스트
- 입력 시 사라짐
```

---

## 🔘 Input Controls

### Button
```
Types:
- Primary: bg-violet-600 text-white
- Secondary: border bg-white text-gray-700
- Ghost: bg-transparent
- Destructive: bg-red-600 text-white

Sizes:
- sm: h-8 px-3 text-sm
- md: h-10 px-4 (default)
- lg: h-12 px-6 text-lg

States: default, hover, active, disabled, loading
Shape: rounded-lg (default), rounded-full (pill)
```

### Floating Action Button (FAB)
```
- 화면 우하단 고정
- rounded-full
- shadow-lg
- size: 56px (w-14 h-14)
- 주요 액션 1개만
```

### Input Field / Text Field
```
Anatomy:
- Label (상단)
- Input container (border)
- Helper text (하단)
- Leading/Trailing icon (optional)

States:
- Default: border-gray-300
- Focus: border-violet-500 ring-2
- Error: border-red-500
- Disabled: bg-gray-100 opacity-50

Styles:
- Outlined: border
- Filled: bg-gray-100
- Underlined: border-b only
```

### Search Field
```
- Leading search icon
- Placeholder "검색..."
- Clear button (trailing, 입력 있을 때)
- rounded-full 또는 rounded-lg
```

### Checkbox
```
- size: w-5 h-5
- checked: bg-violet-600
- border-radius: rounded
- label 오른쪽 배치
```

### Radio Button
```
- size: w-5 h-5
- rounded-full
- checked: inner dot
- 그룹으로 사용
```

### Toggle / Switch
```
- width: w-11
- height: h-6
- thumb: w-5 h-5 rounded-full
- on: bg-violet-600
- off: bg-gray-300
- transition 효과
```

### Slider Controls
```
- track: h-2 bg-gray-200 rounded-full
- filled: bg-violet-600
- thumb: w-5 h-5 rounded-full shadow
- min/max labels (optional)
```

### Picker
```
- 날짜/시간 선택
- wheel 또는 calendar 형태
- 모달 또는 inline
```

### Stepper
```
- +/- 버튼
- 중앙 숫자 표시
- min/max 제한
```

### Form
```
- 세로 배치 (gap-4)
- Label + Input 그룹
- Validation 메시지
- Submit 버튼 하단
```

### Dropdown
```
Styles:
- Outlined: border
- Filled: bg-gray-100
- Minimal: underline only

Components:
- Trigger button
- Menu (absolute positioned)
- Menu items
- Chevron icon
```

---

## 🧭 Navigation Components

### Tab Bar (Bottom Navigation)
```
- 하단 고정
- 3-5개 아이템
- 아이콘 + 라벨
- active: text-violet-600
- safe-area-inset 고려
```

### Navigation Types
```
1. Bottom Tab Bar (가장 일반적)
2. Top Tab Bar
3. Side Drawer
4. Hamburger Menu
```

### Hamburger Menu (☰)
```
- 좌상단 배치
- 3개 가로선
- 클릭 시 Drawer 열림
```

### Drawer (Side Bar)
```
- 왼쪽에서 슬라이드
- overlay backdrop
- 메뉴 리스트
- 닫기 버튼 또는 스와이프
```

### Breadcrumb
```
- 경로 표시
- separator: / 또는 >
- 현재 페이지는 비활성
- 클릭으로 이동
```

### Pagination
```
- 이전/다음 버튼
- 페이지 번호
- 현재 페이지 하이라이트
- 또는 무한 스크롤
```

---

## 🍔 Menu Types

### Kebab Menu (⋮)
```
- 세로 점 3개
- 더보기 옵션
- 카드/리스트 아이템에 사용
```

### Meatballs Menu (⋯)
```
- 가로 점 3개
- 더보기 옵션
- 채팅/메시지에 자주 사용
```

### Bento Menu (⊞)
```
- 3x3 그리드 점
- 앱/서비스 전환
- Google 스타일
```

### Doner Menu (≡)
```
- Hamburger와 유사
- 필터/정렬 옵션에 사용
```

---

## 📦 Containers

### Card
```
Structure:
- Container: rounded-xl shadow-sm bg-white p-4
- Header (optional): 제목, 아이콘
- Content: 본문
- Footer (optional): 버튼, 링크

Variants:
- Basic: 텍스트만
- Media: 이미지 + 텍스트
- Interactive: hover 효과, 클릭 가능
```

### Modal / Dialog
```
- 중앙 배치
- backdrop: bg-black/50
- rounded-xl
- 헤더 + 콘텐츠 + 액션 버튼
- 닫기: X 버튼 또는 backdrop 클릭
```

### Popover
```
- 특정 요소 근처에 표시
- arrow로 연결
- 작은 정보/액션
- 클릭 또는 호버로 표시
```

### Accordion
```
- 접기/펼치기
- 헤더 클릭으로 토글
- chevron 아이콘 회전
- 한 번에 하나만 또는 여러 개
```

### Carousel
```
- 가로 스크롤
- indicator dots
- 자동 재생 (optional)
- 이전/다음 버튼
```

---

## 🔔 Informational Components

### Badge
```
- 작은 라벨
- rounded-full
- 아이콘/아바타 위에 표시
- 숫자 또는 dot
- 색상으로 상태 표시
```

### Toast / Pop-up
```
- 임시 알림 메시지
- 상단 또는 하단
- 자동 사라짐 (3-5초)
- success/error/warning/info 색상
```

### Progress Bar
```
- 진행 상태 표시
- h-2 rounded-full
- bg-gray-200 (track)
- bg-violet-600 (fill)
- 퍼센트 표시 (optional)
```

### Throbber / Spinner
```
- 로딩 표시
- animate-spin
- circular 형태
- size: w-6 h-6 (default)
```

### Dividers
```
- 콘텐츠 구분선
- border-t border-gray-200
- 또는 gap으로 여백만
```

---

## 🎨 Icons

### Icon Metrics
```
- Base size: 24x24px
- Touch target: 44x44px
- Padding: 내부 2px
- Consistent stroke width
```

### Icon Types
```
1. Outlined: 선만 (기본)
2. Filled: 채워진 형태 (active)
3. Two-tone: 두 가지 색상
```

### Icon Corner
```
- Sharp: 날카로운 모서리
- Rounded: 부드러운 모서리 (추천)
```

### Icon Stroke
```
- Thin: 1px
- Regular: 1.5px (추천)
- Bold: 2px
```

### Keyline Shapes
```
- 아이콘 일관성을 위한 가이드
- Circle, Square, Vertical/Horizontal rectangle
```

---

## 🏗 Layout & Grid

### Mobile Grid System
```
- Columns: 4 (mobile)
- Gutter: 16px
- Margin: 16px (양쪽)
- max-width: 100% (mobile)
```

### Web & Mobile Grids
```
Mobile: 4 columns
Tablet: 8 columns
Desktop: 12 columns
```

---

## 🎨 Design Tokens

### Colors
```
Primary: violet-600
Secondary: gray-100
Success: green-500
Error: red-500
Warning: yellow-500
Info: blue-500

Text:
- Primary: gray-900
- Secondary: gray-600
- Muted: gray-400
```

### Shadows
```
- sm: shadow-sm (카드 기본)
- md: shadow-md (elevated)
- lg: shadow-lg (모달, FAB)
```

### Spacing
```
기본 단위: 4px
- xs: 4px (space-1)
- sm: 8px (space-2)
- md: 16px (space-4)
- lg: 24px (space-6)
- xl: 32px (space-8)
```

---

## 📱 Chips

### Anatomy
```
- Container: rounded-full px-3 py-1
- Label text
- Leading icon (optional)
- Trailing icon/close (optional)
```

### States
```
- Default
- Selected: bg-violet-100 border-violet-600
- Disabled: opacity-50
```

### Sizes
```
- sm: h-6 text-xs
- md: h-8 text-sm (default)
- lg: h-10 text-base
```

### Types
```
1. Input chips: 사용자 입력 (태그)
2. Filter chips: 필터 선택
3. Choice chips: 단일 선택
4. Action chips: 액션 트리거
```

---

## Usage with shadcn/ui

이 가이드의 컴포넌트 대부분은 shadcn/ui에서 제공:

```bash
# 설치 예시
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add badge
pnpm dlx shadcn@latest add toast
pnpm dlx shadcn@latest add tabs
pnpm dlx shadcn@latest add checkbox
pnpm dlx shadcn@latest add radio-group
pnpm dlx shadcn@latest add switch
pnpm dlx shadcn@latest add slider
pnpm dlx shadcn@latest add skeleton
pnpm dlx shadcn@latest add accordion
pnpm dlx shadcn@latest add carousel
pnpm dlx shadcn@latest add dropdown-menu
pnpm dlx shadcn@latest add popover
pnpm dlx shadcn@latest add progress
```

---

## Quick Reference

| 용도 | Component | shadcn |
|------|-----------|--------|
| 주요 액션 | Button | ✅ |
| 목록 아이템 | Card | ✅ |
| 알림 | Toast | ✅ |
| 로딩 | Skeleton | ✅ |
| 팝업 | Dialog/Modal | ✅ |
| 선택 | Checkbox, Radio, Switch | ✅ |
| 입력 | Input, Textarea | ✅ |
| 필터 | Chips | 커스텀 |
| 하단 네비 | Tab Bar | 커스텀 |
| 더보기 | Dropdown Menu | ✅ |
