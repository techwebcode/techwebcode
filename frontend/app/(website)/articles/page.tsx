"use client";

import { useState } from "react";
import Container from "@/components/layout/Container";
import ArticleGrid from "@/components/article/ArticleGrid";
import ArticleFilters from "@/components/article/ArticleFilters";
import { useLatestArticles } from "@/hooks/useLatestArticles";
import { Article } from "@/types/article";
import { BookOpen } from "lucide-react";

// Fallback high-quality engineering articles with recommended tools cross-linking
const FALLBACK_ARTICLES: Article[] = [
  {
    id: 201,
    title: "Mastering JSON Formatting, Validation & Parsing in Modern Web Applications",
    slug: "json-formatting-validation-guide",
    excerpt: "Learn how to efficiently format nested JSON, inspect syntax errors line-by-line, and optimize API payload sizes with minification.",
    reading_time: 6,
    published_at: "2026-08-10T00:00:00Z",
    category: { id: 1, name: "Tutorials", slug: "tutorials", description: "Practical guides and tutorials" },
    featured_image: null,
    primary_tool: { name: "JSON Formatter", slug: "json-formatter" },
  },
  {
    id: 202,
    title: "Building and Debugging Regular Expressions Without Guesswork",
    slug: "regex-testing-debugging-guide",
    excerpt: "A comprehensive guide to understanding lookaheads, capture groups, and regular expression execution speed across JavaScript & Python.",
    reading_time: 8,
    published_at: "2026-08-05T00:00:00Z",
    category: { id: 2, name: "Developer Guides", slug: "guides", description: "Engineering architecture guides" },
    featured_image: null,
    primary_tool: { name: "Regex Tester", slug: "regex-tester" },
  },
  {
    id: 203,
    title: "JWT Authentication Security: Claims, Expiration & Signature Inspection",
    slug: "jwt-authentication-security-guide",
    excerpt: "How to inspect Base64 encoded JSON Web Tokens safely, verify claims expiration, and prevent key vulnerabilities in modern REST APIs.",
    reading_time: 7,
    published_at: "2026-07-28T00:00:00Z",
    category: { id: 3, name: "Security & DevOps", slug: "devops", description: "Security and deployment guides" },
    featured_image: null,
    primary_tool: { name: "JWT Decoder", slug: "jwt-decoder" },
  },
  {
    id: 204,
    title: "Kubernetes Secrets & YAML Formatting Best Practices for Production",
    slug: "kubernetes-secrets-yaml-formatting-guide",
    excerpt: "A practical guide to encoding secrets, avoiding indentation pitfalls, and managing multi-environment Kubernetes manifests.",
    reading_time: 9,
    published_at: "2026-07-20T00:00:00Z",
    category: { id: 4, name: "DevOps & Cloud", slug: "devops", description: "DevOps and cloud infrastructure" },
    featured_image: null,
    primary_tool: { name: "YAML Formatter", slug: "yaml-formatter" },
  },
  {
    id: 205,
    title: "Optimizing Complex SQL Queries: Indexing, Joins & Execution Plans",
    slug: "optimizing-sql-queries-guide",
    excerpt: "Learn how to format complex SQL queries for readability and optimize execution plans across PostgreSQL & MySQL databases.",
    reading_time: 10,
    published_at: "2026-07-15T00:00:00Z",
    category: { id: 5, name: "Database & Backend", slug: "backend", description: "Database and query optimization" },
    featured_image: null,
    primary_tool: { name: "SQL Formatter", slug: "sql-formatter" },
  },
  {
    id: 206,
    title: "UUID v4 Generation & Collision Probabilities in Distributed Systems",
    slug: "uuid-v4-generation-collision-probabilities",
    excerpt: "Explore cryptographically secure randomness, RFC 4122 specifications, and primary key strategies for high-scale microservices.",
    reading_time: 5,
    published_at: "2026-07-02T00:00:00Z",
    category: { id: 6, name: "Architecture", slug: "architecture", description: "Distributed system architecture" },
    featured_image: null,
    primary_tool: { name: "UUID Generator", slug: "uuid-generator" },
  },
];

export default function ArticlesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("latest");

  const { data, isLoading } = useLatestArticles();

  const apiArticles: Article[] = data?.data ?? [];
  const displayArticles = apiArticles.length > 0 ? apiArticles : FALLBACK_ARTICLES;

  // Filter articles based on search & category
  const filteredArticles = displayArticles.filter((art) => {
    const matchesSearch =
      !search.trim() ||
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "all" ||
      art.category?.slug === category ||
      art.category?.name.toLowerCase() === category.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <Container className="py-12 lg:py-16 space-y-8">
      {/* Header Section */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
          <BookOpen className="h-4 w-4" />
          <span>Engineering Publication &amp; Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Developer Guides &amp; Articles
        </h1>
        <p className="mt-2 text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Learn more about the software engineering concepts, troubleshooting techniques, and modern architecture patterns that TechWebCode developer tools help solve.
        </p>
      </div>

      {/* Filters */}
      <ArticleFilters
        search={search}
        category={category}
        sort={sort}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onSortChange={setSort}
      />

      {/* Loading Skeleton or Article Grid */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-card animate-pulse"
            />
          ))}
        </div>
      ) : (
        <ArticleGrid articles={filteredArticles} columns={3} />
      )}
    </Container>
  );
}