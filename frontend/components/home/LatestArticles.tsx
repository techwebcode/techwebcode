"use client";

import React from "react";
import SectionHeading from "@/components/common/SectionHeading";
import Container from "@/components/layout/Container";
import ArticleCard from "@/components/article/ArticleCard";
import { useLatestArticles } from "@/hooks/useLatestArticles";
import { Article } from "@/types/article";

export default function LatestArticles() {
  const { data, isLoading, error } = useLatestArticles(1, 6);

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/20 border-y border-border">
        <Container>
          <div className="h-12 w-64 animate-pulse rounded-lg bg-muted mb-8" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-64 animate-pulse rounded-2xl bg-card border" />
            ))}
          </div>
        </Container>
      </section>
    );
  }

  if (error) {
    return null;
  }

  const articles: Article[] = data?.data ?? [];

  if (!articles.length) {
    return null;
  }

  return (
    <section className="py-16 bg-muted/20 border-y border-border">
      <Container>
        <SectionHeading
          title="Latest Tutorials"
          description="Fresh guides, practical solutions, and developer knowledge."
          href="/articles"
          actionLabel="View All Articles"
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </Container>
    </section>
  );
}