"use client";

import { useState } from "react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/common/SectionHeading";
import CategoryGrid from "@/components/category/CategoryGrid";
import { useCategories } from "@/hooks/useCategories";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Category } from "@/types/category";

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useCategories({ limit: 100 });

  const categories: Category[] = (data as unknown as { data: Category[] })?.data ?? (Array.isArray(data) ? data : []);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    (cat.description && cat.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Container className="py-16 space-y-10">
      <SectionHeading
        title="Article Categories"
        description="Browse all tutorials, guides, and programming topics by category."
      />

      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-10 rounded-xl"
        />
      </div>

      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-44 rounded-2xl border animate-pulse bg-muted/60"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center text-destructive">
          Failed to load categories. Please try again later.
        </div>
      )}

      {!isLoading && !error && filteredCategories.length === 0 && (
        <div className="rounded-2xl border py-12 text-center text-muted-foreground">
          No categories found matching &quot;{search}&quot;.
        </div>
      )}

      {!isLoading && !error && filteredCategories.length > 0 && (
        <CategoryGrid categories={filteredCategories} />
      )}
    </Container>
  );
}
