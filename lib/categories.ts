// 카테고리 매핑 설정
// DB 세부 카테고리 → UI 그룹 카테고리

export const CATEGORY_MAP = {
  뷰티: ['뷰티', '스킨케어', '메이크업', '향수'],
  패션: ['패션', '의류', '신발', '가방', '액세서리'],
  육아: ['육아', '유아', '완구', '아동복'],
  생활: ['생활', '리빙', '가전', '인테리어', '주방'],
  식품: ['식품', '과일', '정육', '수산', '간식'],
} as const;

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
