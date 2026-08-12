"use client";

import React from "react";
import Link from "next/link";

const topics = [
  "Go",
  "React",
  "Next.js",
  "TypeScript",
  "Docker",
  "Flutter",
  "Kubernetes",
  "AI",
];

export default function PopularTopicsSection() {
  return (
    <section className="py-6 border-y bg-muted/20">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground shrink-0">
          Popular Topics:
        </span>

        <div className="flex flex-wrap items-center gap-2">
          {topics.map((topic) => (
            <Link
              key={topic}
              href={`/search?q=${encodeURIComponent(topic)}`}
              className="rounded-full border bg-card px-4 py-1.5 text-xs font-medium transition hover:border-primary hover:text-primary shadow-xs"
            >
              {topic}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
