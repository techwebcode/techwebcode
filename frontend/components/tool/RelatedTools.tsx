"use client";

import React from "react";
import Link from "next/link";
import { Wrench, ArrowRight } from "lucide-react";

interface RelatedToolItem {
  name: string;
  slug: string;
  actionText: string;
  description: string;
}

const TOOL_RELATIONS: Record<string, string[]> = {
  "json-formatter": ["json-validator", "json-minifier", "yaml-formatter", "base64"],
  "json-validator": ["json-formatter", "json-minifier", "yaml-formatter", "regex-tester"],
  "json-minifier": ["json-formatter", "json-validator", "base64", "url-encoder"],
  "jwt-decoder": ["base64", "json-formatter", "json-validator", "uuid-generator"],
  base64: ["jwt-decoder", "url-encoder", "json-formatter", "uuid-generator"],
  "uuid-generator": ["timestamp-converter", "base64", "jwt-decoder", "json-formatter"],
  "timestamp-converter": ["uuid-generator", "json-formatter", "url-encoder", "regex-tester"],
  "url-encoder": ["base64", "regex-tester", "jwt-decoder", "timestamp-converter"],
  "regex-tester": ["url-encoder", "json-validator", "sql-formatter", "base64"],
  "sql-formatter": ["json-formatter", "yaml-formatter", "regex-tester", "uuid-generator"],
  "yaml-formatter": ["json-formatter", "sql-formatter", "json-validator", "base64"],
  "code-diff-checker": ["json-formatter", "json-validator", "sql-formatter", "api-contract-checker"],
};

const ALL_RELATED_TOOLS: Record<string, RelatedToolItem> = {
  "code-diff-checker": {
    name: "Code Difference Checker",
    slug: "code-diff-checker",
    actionText: "Compare Code Diffs",
    description: "Compare two versions of code side-by-side or unified with 100% browser privacy.",
  },
  "json-formatter": {
    name: "JSON Formatter",
    slug: "json-formatter",
    actionText: "Try the JSON Formatter",
    description: "Format, beautify, validate, and inspect JSON payloads.",
  },
  "json-validator": {
    name: "JSON Validator",
    slug: "json-validator",
    actionText: "Try the JSON Validator",
    description: "Validate JSON syntax and detect syntax errors with line numbers.",
  },
  "json-minifier": {
    name: "JSON Minifier",
    slug: "json-minifier",
    actionText: "Use the JSON Minifier",
    description: "Compress and minify JSON data by stripping whitespace.",
  },
  "jwt-decoder": {
    name: "JWT Decoder",
    slug: "jwt-decoder",
    actionText: "Open the JWT Decoder",
    description: "Decode JWT tokens, inspect claims, and check expiration date.",
  },
  base64: {
    name: "Base64 Encoder & Decoder",
    slug: "base64",
    actionText: "Use the Base64 Tool",
    description: "Encode text to Base64 and decode Base64 strings back to text.",
  },
  "uuid-generator": {
    name: "UUID Generator",
    slug: "uuid-generator",
    actionText: "Generate UUID v4",
    description: "Generate random Version 4 UUIDs individually or in bulk.",
  },
  "timestamp-converter": {
    name: "Unix Timestamp Converter",
    slug: "timestamp-converter",
    actionText: "Convert Unix Timestamp",
    description: "Convert Epoch timestamps to human-readable dates and UTC time.",
  },
  "url-encoder": {
    name: "URL Encoder & Decoder",
    slug: "url-encoder",
    actionText: "Try the URL Encoder",
    description: "Encode query parameters into percent-encoded URL format.",
  },
  "regex-tester": {
    name: "Regex Tester",
    slug: "regex-tester",
    actionText: "Test Regex Pattern",
    description: "Test and debug regular expressions with match highlighting.",
  },
  "sql-formatter": {
    name: "SQL Formatter",
    slug: "sql-formatter",
    actionText: "Format SQL Queries",
    description: "Beautify and format SQL queries with clean indentations.",
  },
  "yaml-formatter": {
    name: "YAML Formatter",
    slug: "yaml-formatter",
    actionText: "Format YAML Files",
    description: "Format, validate, and beautify YAML configurations.",
  },
};

interface RelatedToolsProps {
  currentSlug: string;
}

export default function RelatedTools({ currentSlug }: RelatedToolsProps) {
  const targetSlugs = TOOL_RELATIONS[currentSlug] || [
    "json-formatter",
    "json-validator",
    "base64",
    "jwt-decoder",
  ];

  const relatedList = targetSlugs
    .map((slug) => ALL_RELATED_TOOLS[slug])
    .filter(Boolean);

  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center gap-2 font-bold text-lg text-foreground">
        <Wrench className="w-5 h-5 text-primary" />
        <span>Related Developer Tools</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {relatedList.map((tool) => (
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
              <span>{tool.actionText}</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
