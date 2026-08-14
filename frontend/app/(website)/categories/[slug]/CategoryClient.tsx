"use client";

import { useState } from "react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/common/SectionHeading";
import ArticleGrid from "@/components/article/ArticleGrid";
import ArticleFilters from "@/components/article/ArticleFilters";
import { useLatestArticles } from "@/hooks/useLatestArticles";
import { FolderOpen } from "lucide-react";
import { Article } from "@/types/article";

interface Props {
  slug: string;
}

export default function CategoryClient({ slug }: Props) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  const { data, isLoading } = useLatestArticles();

  const allArticles: Article[] = (data as unknown as { data: Article[] })?.data ?? (Array.isArray(data) ? data : []);

  // Filter articles belonging to this category slug or matching search
  const categoryArticles = allArticles.filter((art) => {
    const matchesCategory = !slug || art.category?.slug === slug;
    const matchesSearch = !search || art.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoryName = slug
    ? slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "Category";

  return (
    <Container className="py-16 space-y-10">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <FolderOpen className="h-6 w-6" />
        </div>
        <div>
          <SectionHeading
            title={`${categoryName} Articles`}
            description={`Explore all tutorials and guides under the ${categoryName} category.`}
          />
        </div>
      </div>

      <ArticleFilters
        search={search}
        category={slug}
        sort={sort}
        onSearchChange={setSearch}
        onCategoryChange={() => {}}
        onSortChange={setSort}
      />

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-64 rounded-2xl border animate-pulse bg-muted/60"
            />
          ))}
        </div>
      ) : categoryArticles.length === 0 ? (
        <div className="rounded-2xl border py-16 text-center text-muted-foreground">
          No articles found for category &quot;{categoryName}&quot;.
        </div>
      ) : (
        <ArticleGrid articles={categoryArticles} />
      )}
    </Container>
  );
}
