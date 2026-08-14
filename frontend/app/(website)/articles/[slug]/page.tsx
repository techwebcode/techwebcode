import { Metadata } from "next";
import { notFound } from "next/navigation";

import Container from "@/components/layout/Container";
import ArticleHeader from "@/components/article/ArticleHeader";
import ArticleContent from "@/components/article/ArticleContent";
import ArticleSidebar from "@/components/article/ArticleSidebar";
import RelatedArticles from "@/components/article/RelatedArticles";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import AdBanner from "@/components/common/AdBanner";
import ArticleService from "@/services/article";
import Link from "next/link";
import { Wrench, ArrowRight } from "lucide-react";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const DEFAULT_ARTICLES: Record<string, any> = {
  "how-to-fix-nextjs-hydration-error": {
    id: 101,
    title: "How to Fix Next.js Hydration Error: Text Content Does Not Match Server-Rendered HTML",
    slug: "how-to-fix-nextjs-hydration-error",
    summary: "Complete guide to debugging and fixing Next.js App Router hydration mismatch errors caused by browser-only APIs, invalid HTML nesting, or dynamic dates.",
    content: `
## What is a Next.js Hydration Error?

A Next.js hydration error occurs when the initial HTML pre-rendered on the server does not match the HTML structure generated during the client-side React hydration phase.

### Common Causes of Hydration Mismatches

1. **Accessing Browser-Only APIs During SSR**: Referencing \`window\`, \`localStorage\`, or \`navigator\` directly inside component render cycles.
2. **Invalid HTML Nesting**: Placing block elements like \`<div>\` inside inline paragraph tags (\`<p>\`).
3. **Dynamic Data & Dates**: Rendering \`new Date().toLocaleTimeString()\` or \`Math.random()\` which output different values on server vs client.
4. **Browser Extensions**: Chrome extensions modifying the DOM before React finishes hydration.

## Solution 1: Use the \`useEffect\` Client Mounting Pattern

To prevent rendering client-only state during server side pre-rendering, delay rendering until the component mounts on the client:

\`\`\`tsx
"use client";

import { useState, useEffect } from "react";

export default function ClientOnlyComponent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <div>Client Time: {new Date().toLocaleTimeString()}</div>;
}
\`\`\`

## Solution 2: Suppress Hydration Warning for Dynamic Elements

If a mismatch is expected (e.g. timestamp display), use \`suppressHydrationWarning\`:

\`\`\`tsx
<time dateTime={date.toISOString()} suppressHydrationWarning>
  {date.toLocaleTimeString()}
</time>
\`\`\`
`,
    category: { name: "Frontend", slug: "frontend" },
    publishedAt: "2026-08-10",
    relatedTool: {
      name: "JSON Formatter & Validator",
      slug: "json-formatter",
      description: "Format, validate, and inspect JSON payloads online.",
    },
  },
  "how-to-connect-go-to-mysql": {
    id: 102,
    title: "How to Connect Go (Golang) to MySQL with database/sql and GORM",
    slug: "how-to-connect-go-to-mysql",
    summary: "Step-by-step tutorial on configuring database connection pools, executing raw SQL queries, and managing schema migrations in Go.",
    content: `
## Connecting Go to MySQL Database

Go provides the standard \`database/sql\` package paired with the \`go-sql-driver/mysql\` driver for reliable MySQL connectivity.

### Step 1: Install MySQL Driver

\`\`\`bash
go get -u github.com/go-sql-driver/mysql
\`\`\`

### Step 2: Initialize Connection Pool

\`\`\`go
package main

import (
    "database/sql"
    "fmt"
    "log"

    _ "github.com/go-sql-driver/mysql"
)

func main() {
    dsn := "user:password@tcp(127.0.0.1:3306)/techwebcode?parseTime=true"
    db, err := sql.Open("mysql", dsn)
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    if err := db.Ping(); err != nil {
        log.Fatal("Connection failed:", err)
    }

    fmt.Println("Connected to MySQL successfully!")
}
\`\`\`
`,
    category: { name: "Backend", slug: "backend" },
    publishedAt: "2026-08-11",
    relatedTool: {
      name: "SQL Query Formatter",
      slug: "sql-formatter",
      description: "Format and beautify raw SQL queries instantly.",
    },
  },
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  let article: any;

  try {
    const res = await ArticleService.getArticle(slug);
    if (res && res.data) article = res.data;
  } catch {
    // Fallback
  }

  if (!article) article = DEFAULT_ARTICLES[slug];

  const title = article ? article.title : "Developer Tutorial";
  const description = article?.summary || article?.seo_description || article?.excerpt || "Practical developer tutorials and troubleshooting guides.";
  const canonicalUrl = `https://techwebcode.in/articles/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | TechWebCode`,
      description,
      url: canonicalUrl,
      type: "article",
      siteName: "TechWebCode",
    },
  };
}

export default async function ArticlePage({
  params,
}: Readonly<Props>) {
  const { slug } = await params;
  let article: any;

  try {
    const response = await ArticleService.getArticle(slug);
    if (response && response.data) {
      article = response.data;
    }
  } catch {
    // Fallback
  }

  if (!article) {
    article = DEFAULT_ARTICLES[slug];
  }

  if (!article) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Articles", href: "/articles" },
    { label: article.category?.name || "Tutorial", href: `/categories/${article.category?.slug || "all"}` },
    { label: article.title },
  ];

  return (
    <Container className="py-12 space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={breadcrumbItems} />

      <ArticleHeader article={article} />

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="min-w-0 flex-1 space-y-8">
          {/* Natural Mid-Article Ad Slot */}
          <AdBanner slot="1122334455" className="my-4" />

          {/* Main Content */}
          <ArticleContent article={article} />

          {/* Embedded Tool CTA Banner (Tool + Article Linking) */}
          {article.relatedTool && (
            <div className="p-6 rounded-2xl border bg-gradient-to-r from-blue-950/30 via-background to-indigo-950/30 border-blue-500/30 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-primary">
                  <Wrench className="w-4 h-4" />
                  <span>RECOMMENDED INTERACTIVE TOOL</span>
                </div>
                <h4 className="font-bold text-base text-foreground">
                  {article.relatedTool.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {article.relatedTool.description}
                </p>
              </div>

              <Link
                href={`/tools/${article.relatedTool.slug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all shrink-0"
              >
                <span>Try {article.relatedTool.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        <ArticleSidebar
          url={`https://techwebcode.in/articles/${article.slug}`}
          title={article.title}
        />
      </div>

      <RelatedArticles slug={article.slug} />

      {/* Non-Intrusive Bottom Ad Banner */}
      <AdBanner slot="9988776655" className="mt-12" />
    </Container>
  );
}