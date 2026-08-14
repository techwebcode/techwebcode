import type { Metadata } from "next";
import CategoryClient from "./CategoryClient";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = slug
    ? slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "Category";
  const canonicalUrl = `https://techwebcode.in/categories/${slug}`;

  return {
    title: `${categoryName} Articles`,
    description: `Explore all programming tutorials and technical guides under the ${categoryName} category.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${categoryName} Articles | TechWebCode`,
      description: `Explore all programming tutorials and technical guides under the ${categoryName} category.`,
      url: canonicalUrl,
      siteName: "TechWebCode",
      type: "website",
    },
  };
}

export default async function CategoryDetailPage({ params }: Props) {
  const resolvedParams = await params;
  return <CategoryClient slug={resolvedParams.slug} />;
}
