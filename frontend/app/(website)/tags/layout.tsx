import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Article Tags",
  description: "Browse articles by technical tags and engineering topics.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function TagsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
