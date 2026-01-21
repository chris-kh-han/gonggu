// 카테고리 매핑 설정
// DB 세부 카테고리 → UI 그룹 카테고리

export const CATEGORY_MAP = {
  뷰티: ['뷰티', '스킨케어', '메이크업', '향수'],
  패션: ['패션', '의류', '신발', '가방', '액세서리'],
  육아: ['육아', '유아', '완구', '아동복'],
  생활: ['생활', '리빙', '가전', '인테리어', '주방'],
  식품: ['식품', '과일', '정육', '수산', '간식'],
} as const;

// 카테고리별 색상 (Tailwind 클래스)
export const CATEGORY_COLORS = {
  all: {
    bg: 'bg-violet-500',
    bgLight: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
    borderAccent: 'border-l-violet-400',
    hover: 'hover:bg-violet-100',
  },
  뷰티: {
    bg: 'bg-rose-500',
    bgLight: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    borderAccent: 'border-l-rose-400',
    hover: 'hover:bg-rose-100',
  },
  패션: {
    bg: 'bg-indigo-500',
    bgLight: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    borderAccent: 'border-l-indigo-400',
    hover: 'hover:bg-indigo-100',
  },
  육아: {
    bg: 'bg-amber-500',
    bgLight: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    borderAccent: 'border-l-amber-400',
    hover: 'hover:bg-amber-100',
  },
  생활: {
    bg: 'bg-emerald-500',
    bgLight: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    borderAccent: 'border-l-emerald-400',
    hover: 'hover:bg-emerald-100',
  },
  식품: {
    bg: 'bg-orange-500',
    bgLight: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    borderAccent: 'border-l-orange-400',
    hover: 'hover:bg-orange-100',
  },
  기타: {
    bg: 'bg-slate-500',
    bgLight: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    borderAccent: 'border-l-slate-400',
    hover: 'hover:bg-slate-100',
  },
} as const;

export type CategoryColorKey = keyof typeof CATEGORY_COLORS;

// 카테고리 색상 가져오기
export function getCategoryColor(category: string | null) {
  if (!category) return CATEGORY_COLORS.기타;

  // 그룹 카테고리인 경우
  if (category in CATEGORY_COLORS) {
    return CATEGORY_COLORS[category as CategoryColorKey];
  }

  // DB 세부 카테고리인 경우 → 그룹 찾기
  const group = getCategoryGroup(category);
  if (group) {
    return CATEGORY_COLORS[group];
  }

  return CATEGORY_COLORS.기타;
}

export type CategoryGroup = keyof typeof CATEGORY_MAP;

export const CATEGORY_GROUPS = Object.keys(CATEGORY_MAP) as CategoryGroup[];

// DB 카테고리 → UI 그룹 변환
export function getCategoryGroup(dbCategory: string | null): CategoryGroup | null {
  if (!dbCategory) return null;

  for (const [group, subCategories] of Object.entries(CATEGORY_MAP)) {
    if (subCategories.includes(dbCategory as never)) {
      return group as CategoryGroup;
    }
  }

  return null; // 매핑 안되면 기타
}

// UI 그룹에 속하는 DB 카테고리인지 확인
export function isInCategoryGroup(dbCategory: string | null, group: CategoryGroup): boolean {
  if (!dbCategory) return false;
  return CATEGORY_MAP[group].includes(dbCategory as never);
}
