import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer Articles & Programming Tutorials",
  description: "Explore practical software engineering guides, framework tutorials, and system design patterns for developers.",
  alternates: {
    canonical: "https://techwebcode.in/articles",
  },
  openGraph: {
    title: "Developer Articles & Programming Tutorials | TechWebCode",
    description: "Explore practical software engineering guides, framework tutorials, and system design patterns for developers.",
    url: "https://techwebcode.in/articles",
    siteName: "TechWebCode",
    type: "website",
  },
};

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
