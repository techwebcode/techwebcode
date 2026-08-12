"use client";

import React from "react";
import Link from "next/link";
import { Wrench, ArrowRight } from "lucide-react";

interface RelatedToolItem {
  name: string;
  slug: string;
  description: string;
  icon?: string;
}

const ALL_RELATED_TOOLS: RelatedToolItem[] = [
  {
    name: "JSON Formatter",
    slug: "json-formatter",
    description: "Format, beautify, validate, and inspect JSON payloads.",
  },
  {
    name: "JSON Validator",
    slug: "json-validator",
    description: "Validate JSON syntax and detect syntax errors with line numbers.",
  },
  {
    name: "JSON Minifier",
    slug: "json-minifier",
    description: "Compress and minify JSON data by stripping whitespace.",
  },
  {
    name: "JWT Decoder",
    slug: "jwt-decoder",
    description: "Decode JWT tokens, inspect claims, and check expiration date.",
  },
  {
    name: "Base64 Encoder/Decoder",
    slug: "base64",
    description: "Encode text to Base64 and decode Base64 strings back to text.",
  },
];

interface RelatedToolsProps {
  currentSlug: string;
}

export default function RelatedTools({ currentSlug }: RelatedToolsProps) {
  const filtered = ALL_RELATED_TOOLS.filter((t) => t.slug !== currentSlug);

  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center gap-2 font-bold text-lg text-foreground">
        <Wrench className="w-5 h-5 text-primary" />
        <span>Related Developer Tools</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.slice(0, 4).map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="group flex flex-col justify-between rounded-xl border bg-card p-4 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
          >
            <div>
              <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                {tool.name}
              </h4>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {tool.description}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-primary group-hover:translate-x-1 transition-transform">
              <span>Open Tool</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
