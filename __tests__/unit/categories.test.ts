import { describe, it, expect } from 'vitest'
import {
  CATEGORY_MAP,
  CATEGORY_COLORS,
  CATEGORY_GROUPS,
  getCategoryGroup,
  getCategoryColor,
  isInCategoryGroup,
} from '@/lib/categories'

describe('CATEGORY_MAP', () => {
  it('should have all expected category groups', () => {
    expect(Object.keys(CATEGORY_MAP)).toEqual(['뷰티', '패션', '육아', '생활', '식품'])
  })

  it('should contain sub-categories for each group', () => {
    expect(CATEGORY_MAP.뷰티).toContain('스킨케어')
    expect(CATEGORY_MAP.패션).toContain('의류')
    expect(CATEGORY_MAP.육아).toContain('유아')
    expect(CATEGORY_MAP.생활).toContain('리빙')
    expect(CATEGORY_MAP.식품).toContain('과일')
  })
})

describe('CATEGORY_GROUPS', () => {
  it('should export all category group keys', () => {
    expect(CATEGORY_GROUPS).toEqual(['뷰티', '패션', '육아', '생활', '식품'])
  })
})

describe('getCategoryGroup', () => {
  it('should return correct group for sub-category', () => {
    expect(getCategoryGroup('스킨케어')).toBe('뷰티')
    expect(getCategoryGroup('의류')).toBe('패션')
    expect(getCategoryGroup('유아')).toBe('육아')
    expect(getCategoryGroup('리빙')).toBe('생활')
    expect(getCategoryGroup('과일')).toBe('식품')
  })

  it('should return correct group for main category', () => {
    expect(getCategoryGroup('뷰티')).toBe('뷰티')
    expect(getCategoryGroup('패션')).toBe('패션')
  })

  it('should return null for unknown category', () => {
    expect(getCategoryGroup('알수없음')).toBeNull()
  })

  it('should return null for null input', () => {
    expect(getCategoryGroup(null)).toBeNull()
  })
})

describe('getCategoryColor', () => {
  it('should return colors for main categories', () => {
    const beautyColor = getCategoryColor('뷰티')
    expect(beautyColor.bg).toBe('bg-rose-500')
    expect(beautyColor.text).toBe('text-rose-700')
  })

  it('should return colors for sub-categories', () => {
    const skincareColor = getCategoryColor('스킨케어')
    expect(skincareColor.bg).toBe('bg-rose-500') // 뷰티 그룹 색상
  })

  it('should return 기타 colors for unknown category', () => {
    const unknownColor = getCategoryColor('알수없음')
    expect(unknownColor.bg).toBe('bg-slate-500')
  })

  it('should return 기타 colors for null', () => {
    const nullColor = getCategoryColor(null)
    expect(nullColor.bg).toBe('bg-slate-500')
  })

  it('should return all color for "all" key', () => {
    const allColor = CATEGORY_COLORS.all
    expect(allColor.bg).toBe('bg-violet-500')
  })
})

describe('isInCategoryGroup', () => {
  it('should return true for sub-category in correct group', () => {
    expect(isInCategoryGroup('스킨케어', '뷰티')).toBe(true)
    expect(isInCategoryGroup('의류', '패션')).toBe(true)
  })

  it('should return false for sub-category in wrong group', () => {
    expect(isInCategoryGroup('스킨케어', '패션')).toBe(false)
    expect(isInCategoryGroup('의류', '뷰티')).toBe(false)
  })

  it('should return false for null category', () => {
    expect(isInCategoryGroup(null, '뷰티')).toBe(false)
  })

  it('should return true for main category in its own group', () => {
    expect(isInCategoryGroup('뷰티', '뷰티')).toBe(true)
  })
})
