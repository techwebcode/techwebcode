"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const fullItems: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    ...items,
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: fullItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `https://techwebcode.com${item.href}` : undefined,
    })),
  };

  return (
    <>
      {/* Schema.org Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="py-3">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground font-medium">
          {fullItems.map((item, idx) => {
            const isLast = idx === fullItems.length - 1;

            return (
              <li key={idx} className="flex items-center gap-1.5">
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />}

                {idx === 0 && <Home className="w-3.5 h-3.5 shrink-0 mr-0.5 text-muted-foreground" />}

                {isLast || !item.href ? (
                  <span className="text-foreground font-semibold truncate max-w-[200px] sm:max-w-none">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-primary transition-colors hover:underline"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
