"use client";

import React from "react";
import Link from "next/link";
import { useFeaturedArticles } from "@/hooks/useFeaturedArticles";
import ArticleCard from "@/components/article/ArticleCard";
import { Article } from "@/types/article";
import { BookOpen, ArrowRight } from "lucide-react";

// Fallback high-quality engineering articles with cross-linked recommended tools
const FALLBACK_ARTICLES: { article: Article; relatedTool?: { name: string; href: string } }[] = [
  {
    article: {
      id: 101,
      title: "Mastering JSON Formatting, Validation & Parsing in Modern Web Applications",
      slug: "json-formatting-validation-guide",
      excerpt: "Learn how to efficiently format nested JSON, inspect syntax errors line-by-line, and optimize API payload sizes with minification.",
      reading_time: 6,
      published_at: "2026-08-10T00:00:00Z",
      category: { id: 1, name: "Tutorials", slug: "tutorials", description: "Practical guides and tutorials" },
      featured_image: "/images/article-placeholder.jpg",
    },
    relatedTool: { name: "JSON Formatter", href: "/tools/json-formatter" },
  },
  {
    article: {
      id: 102,
      title: "Building and Debugging Regular Expressions Without Guesswork",
      slug: "regex-testing-debugging-guide",
      excerpt: "A comprehensive guide to understanding lookaheads, capture groups, and regular expression execution speed across JavaScript & Python.",
      reading_time: 8,
      published_at: "2026-08-05T00:00:00Z",
      category: { id: 2, name: "Developer Guides", slug: "guides", description: "Engineering architecture guides" },
      featured_image: "/images/article-placeholder.jpg",
    },
    relatedTool: { name: "Regex Tester", href: "/tools/regex-tester" },
  },
  {
    article: {
      id: 103,
      title: "JWT Authentication Security: Claims, Expiration & Signature Inspection",
      slug: "jwt-authentication-security-guide",
      excerpt: "How to inspect Base64 encoded JSON Web Tokens safely, verify claims expiration, and prevent key vulnerabilities in modern REST APIs.",
      reading_time: 7,
      published_at: "2026-07-28T00:00:00Z",
      category: { id: 3, name: "Security & DevOps", slug: "devops", description: "Security and deployment guides" },
      featured_image: "/images/article-placeholder.jpg",
    },
    relatedTool: { name: "JWT Decoder", href: "/tools/jwt-decoder" },
  },
];

export default function FeaturedArticles() {
  const { data, isLoading } = useFeaturedArticles(3);

  const apiArticles: Article[] = Array.isArray(data)
    ? data
    : (data as unknown as { data: Article[] })?.data ?? [];

  const displayList =
    apiArticles.length >= 3
      ? apiArticles.slice(0, 3).map((a, idx) => ({
          article: a,
          relatedTool: FALLBACK_ARTICLES[idx % FALLBACK_ARTICLES.length]?.relatedTool,
        }))
      : FALLBACK_ARTICLES;

  return (
    <section className="py-12 lg:py-16 bg-slate-50/40 dark:bg-slate-950/20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Secondary Knowledge Base</span>
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Developer Guides & Articles
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              Practical guides, troubleshooting, and engineering insights to help you build and debug faster.
            </p>
          </div>

          <Link
            href="/articles"
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors shrink-0"
          >
            <span>View All Articles →</span>
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayList.map(({ article, relatedTool }) => (
            <ArticleCard
              key={article.id || article.slug}
              article={article}
              relatedTool={relatedTool}
            />
          ))}
        </div>
      </div>
    </section>
  );
}