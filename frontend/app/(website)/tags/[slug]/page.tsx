"use client";

import { use, useState } from "react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/common/SectionHeading";
import ArticleGrid from "@/components/article/ArticleGrid";
import ArticleFilters from "@/components/article/ArticleFilters";
import { useLatestArticles } from "@/hooks/useLatestArticles";
import { Tag as TagIcon } from "lucide-react";
import { Article } from "@/types/article";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default function TagDetailPage({ params }: Props) {
  const { slug } = use(params);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  const { data, isLoading } = useLatestArticles();

  const allArticles: Article[] = (data as unknown as { data: Article[] })?.data ?? (Array.isArray(data) ? data : []);

  // Filter articles matching tag
  const tagArticles = allArticles.filter((art) => {
    const matchesTag = !slug || art.tags?.some((t) => t.slug === slug || t.name.toLowerCase() === slug.toLowerCase());
    const matchesSearch = !search || art.title.toLowerCase().includes(search.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const tagName = slug
    ? slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "Tag";

  return (
    <Container className="py-16 space-y-10">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <TagIcon className="h-6 w-6" />
        </div>
        <div>
          <SectionHeading
            title={`Tag: #${tagName}`}
            description={`Explore all articles tagged under #${tagName}.`}
          />
        </div>
      </div>

      <ArticleFilters
        search={search}
        category="all"
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
      ) : tagArticles.length === 0 ? (
        <div className="rounded-2xl border py-16 text-center text-muted-foreground">
          No articles found for tag &quot;#{tagName}&quot;.
        </div>
      ) : (
        <ArticleGrid articles={tagArticles} />
      )}
    </Container>
  );
}
