"use client";

import React from "react";
import { ToolCategory } from "@/types/tools";
import { Button } from "@/components/ui/button";

interface ToolCategoriesProps {
  categories: ToolCategory[];
  activeCategory?: string;
  onSelectCategory: (categorySlug?: string) => void;
}

const DEFAULT_CATEGORIES: ToolCategory[] = [
  { id: 1, name: "JSON", slug: "json" },
  { id: 2, name: "Encoding", slug: "encoding" },
  { id: 3, name: "Security", slug: "security" },
  { id: 4, name: "Generators", slug: "generators" },
  { id: 5, name: "Date & Time", slug: "date-and-time" },
  { id: 6, name: "Web", slug: "web" },
  { id: 7, name: "Database", slug: "database" },
  { id: 8, name: "DevOps", slug: "devops" },
];

export default function ToolCategories({
  categories = [],
  activeCategory,
  onSelectCategory,
}: ToolCategoriesProps) {
  const displayCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      <Button
        type="button"
        variant={!activeCategory ? "default" : "outline"}
        size="sm"
        onClick={() => onSelectCategory(undefined)}
        className="h-8 text-xs font-semibold rounded-full px-4"
      >
        All
      </Button>

      {displayCategories.map((cat) => {
        const isActive = activeCategory === cat.slug;
        return (
          <Button
            key={cat.id || cat.slug}
            type="button"
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectCategory(cat.slug)}
            className="h-8 text-xs font-semibold rounded-full px-4"
          >
            {cat.name}
          </Button>
        );
      })}
    </div>
  );
}
