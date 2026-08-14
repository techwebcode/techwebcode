import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Article Categories",
  description: "Browse software engineering articles by category including Frontend, Backend, DevOps, Mobile, and System Design.",
  alternates: {
    canonical: "https://techwebcode.in/categories",
  },
  openGraph: {
    title: "Article Categories | TechWebCode",
    description: "Browse software engineering articles by category including Frontend, Backend, DevOps, Mobile, and System Design.",
    url: "https://techwebcode.in/categories",
    siteName: "TechWebCode",
    type: "website",
  },
};

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
