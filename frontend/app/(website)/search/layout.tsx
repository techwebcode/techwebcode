import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Search Developer Tools & Articles",
  description: "Search online developer tools, code compilers, and guides across TechWebCode.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://techwebcode.in/search",
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
