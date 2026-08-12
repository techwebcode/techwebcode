"use client";

import React from "react";
import { useFeaturedArticles } from "@/hooks/useFeaturedArticles";
import SectionHeading from "@/components/common/SectionHeading";
import ArticleCard from "@/components/article/ArticleCard";
import Container from "@/components/layout/Container";
import FeaturedArticleCard from "../article/FeaturedArticleCard";
import { Article } from "@/types/article";

export default function FeaturedArticles() {
  const { data, isLoading } = useFeaturedArticles(3);

  if (isLoading) {
    return (
      <section className="py-16">
        <Container>
          <div className="h-12 w-64 animate-pulse rounded-lg bg-muted mb-8" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 h-96 animate-pulse rounded-2xl bg-muted" />
            <div className="space-y-6">
              <div className="h-44 animate-pulse rounded-xl bg-muted" />
              <div className="h-44 animate-pulse rounded-xl bg-muted" />
            </div>
          </div>
        </Container>
      </section>
    );
  }

  const articles: Article[] = Array.isArray(data) ? data : (data as unknown as { data: Article[] })?.data ?? [];

  if (!articles.length || !articles[0]) {
    return null;
  }

  return (
    <section className="py-16">
      <Container>
        <SectionHeading
          title="Featured Tutorials"
          description="Practical guides and tutorials selected for developers."
          href="/articles"
          actionLabel="View All Tutorials"
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <FeaturedArticleCard article={articles[0]} />
          </div>

          <div className="space-y-6">
            {articles.slice(1, 3).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}