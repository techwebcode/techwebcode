"use client";

import React from "react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/common/SectionHeading";
import CategoryGrid from "@/components/category/CategoryGrid";
import { useCategories } from "@/hooks/useCategories";

export default function CategorySection() {
  const { data, isLoading } = useCategories({ page: 1, limit: 12 });

  if (isLoading) {
    return (
      <section className="py-16">
        <Container>
          <div className="h-12 w-64 animate-pulse rounded-lg bg-muted mb-8" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        </Container>
      </section>
    );
  }

  const categories = data?.data ?? [];

  if (!categories.length) {
    return null;
  }

  return (
    <section className="py-16">
      <Container>
        <SectionHeading
          title="Explore by Technology"
          description="Browse practical tutorials, developer guides, and tools by technology stack."
          href="/categories"
          actionLabel="View All Technologies"
        />

        <div className="mt-10">
          <CategoryGrid categories={categories} />
        </div>
      </Container>
    </section>
  );
}