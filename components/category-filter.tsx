"use client";

import { Button } from "@/components/ui/button";
import { CATEGORY_GROUPS } from "@/lib/categories";

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
      {CATEGORIES.map((category) => (
        <Button
          key={category.value}
          variant={selected === category.value ? "default" : "secondary"}
          size="sm"
          onClick={() => onSelect(category.value)}
          className="rounded-lg shrink-0"
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
}
