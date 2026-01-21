"use client";

import { CATEGORY_GROUPS, CATEGORY_COLORS, type CategoryColorKey } from "@/lib/categories";
import { cn } from "@/lib/utils";

export const CATEGORIES = [
  { value: "all", label: "전체" },
  ...CATEGORY_GROUPS.map((group) => ({ value: group, label: group })),
  { value: "기타", label: "기타" },
] as const;

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {CATEGORIES.map((category) => {
        const colors = CATEGORY_COLORS[category.value as CategoryColorKey];
        const isSelected = selected === category.value;

        return (
          <button
            key={category.value}
            onClick={() => onSelect(category.value)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium shrink-0 transition-colors",
              isSelected
                ? `${colors.bg} text-white`
                : `${colors.bgLight} ${colors.text} ${colors.hover}`
            )}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
