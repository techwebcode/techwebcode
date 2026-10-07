import React from "react";
import { Metadata } from "next";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/common/SectionHeading";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import CategoriesClient from "@/components/category/CategoriesClient";
import CategoryService from "@/services/category";
import { Category } from "@/types/category";

export const metadata: Metadata = {
  title: "Explore Programming & Tech Categories | TechWebCode",
  description:
    "Browse comprehensive tutorials, coding guides, and technical explanations across web development, DevOps, algorithms, cloud computing, and developer tools.",
  alternates: {
    canonical: "https://techwebcode.in/categories",
  },
  openGraph: {
    title: "Explore Programming & Tech Categories — TechWebCode",
    description:
      "Browse tutorials, coding guides, and technical explanations across web development, DevOps, and cloud computing.",
    url: "https://techwebcode.in/categories",
    siteName: "TechWebCode",
    type: "website",
  },
};

const FALLBACK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Web Development",
    slug: "web-development",
    description:
      "Modern frontend and backend web application development patterns, architectures, and frameworks.",
  },
  {
    id: 2,
    name: "JavaScript",
    slug: "javascript",
    description:
      "In-depth modern ECMAScript features, asynchronous patterns, event loop mechanics, and DOM APIs.",
  },
  {
    id: 3,
    name: "TypeScript",
    slug: "typescript",
    description:
      "Static type safety, advanced generic utilities, type inference, and enterprise TypeScript best practices.",
  },
  {
    id: 4,
    name: "Python",
    slug: "python",
    description:
      "Pythonic programming, backend microservices, automation scripting, and data manipulation.",
  },
  {
    id: 5,
    name: "DevOps & Cloud",
    slug: "devops",
    description:
      "CI/CD deployment pipelines, Docker containerization, Kubernetes orchestration, and cloud infrastructure.",
  },
  {
    id: 6,
    name: "React & Next.js",
    slug: "react",
    description:
      "React Server Components, App Router patterns, performance optimization, and SSR architectures.",
  },
  {
    id: 7,
    name: "Database & SQL",
    slug: "database",
    description:
      "Relational database design, query optimization, indexing strategies, and data persistence.",
  },
  {
    id: 8,
    name: "Algorithms & Data Structures",
    slug: "algorithms",
    description:
      "Algorithmic problem solving, Big-O complexity analysis, trees, graphs, and system design.",
  },
];

export default async function CategoriesPage() {
  let categories: (Category & { article_count?: number })[] = [];

  try {
    const res = await CategoryService.getCategories({ limit: 100 });
    const fetched = (res as unknown as { data: (Category & { article_count?: number })[] })?.data ?? (Array.isArray(res) ? res : []);
    categories = fetched.length > 0 ? fetched : FALLBACK_CATEGORIES;
  } catch {
    categories = FALLBACK_CATEGORIES;
  }

  const breadcrumbItems = [{ label: "Categories" }];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://techwebcode.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Categories",
        item: "https://techwebcode.in/categories",
      },
    ],
  };

  return (
    <Container className="py-12 lg:py-16 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <SectionHeading
        title="Article Categories"
        description="Browse all tutorials, guides, and programming topics by category."
      />

      <CategoriesClient initialCategories={categories} />
    </Container>
  );
}
