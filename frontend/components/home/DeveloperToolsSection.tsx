"use client";

import React, { useState } from "react";
import Link from "next/link";
import SectionHeading from "./SectionHeading";
import ToolGrid from "@/components/tool/ToolGrid";
import ToolCard from "@/components/tool/ToolCard";
import { useFeaturedTools } from "@/hooks/useTools";
import { Tool } from "@/types/tools";
import { ArrowRight, Wrench, Layers } from "lucide-react";

// Curated tools list mapping catalog items with related guides for cross-linking
const CURATED_POPULAR_TOOLS = [
  {
    id: 1,
    name: "JSON Formatter",
    slug: "json-formatter",
    description: "Format, beautify, and inspect JSON objects with custom indentations.",
    icon: "FileCode",
    category: "JSON & Data",
    featured: true,
    badge: "FEATURED",
    relatedGuide: {
      title: "Mastering JSON Formatting & Validation",
      href: "/articles?category=tutorials",
    },
  },
  {
    id: 2,
    name: "JSON Validator",
    slug: "json-validator",
    description: "Validate JSON syntax against RFC 8259 specifications with exact error lines.",
    icon: "CheckCircle2",
    category: "JSON & Data",
    featured: true,
    relatedGuide: {
      title: "How to Debug Invalid JSON Syntax",
      href: "/articles?category=troubleshooting",
    },
  },
  {
    id: 9,
    name: "Regex Tester & Explainer",
    slug: "regex-tester",
    description: "Test regular expressions, highlight matches, and explain patterns instantly.",
    icon: "Code2",
    category: "Regex & SQL",
    featured: true,
    badge: "FEATURED",
    relatedGuide: {
      title: "Regex Cheat Sheet & Pattern Guide",
      href: "/articles?category=guides",
    },
  },
  {
    id: 10,
    name: "SQL Formatter",
    slug: "sql-formatter",
    description: "Format and beautify SQL queries with clean clause indentation and capitalized keywords.",
    icon: "Database",
    category: "Regex & SQL",
    featured: true,
    relatedGuide: {
      title: "Optimizing Complex SQL Queries",
      href: "/articles?category=guides",
    },
  },
  {
    id: 4,
    name: "JWT Decoder",
    slug: "jwt-decoder",
    description: "Inspect JSON Web Token headers, payload claims, and expiration dates securely.",
    icon: "Key",
    category: "Security",
    featured: true,
    relatedGuide: {
      title: "Understanding JWT Authentication & Claims",
      href: "/articles?category=devops",
    },
  },
  {
    id: 11,
    name: "YAML Formatter & K8s Secret",
    slug: "yaml-formatter",
    description: "Format YAML documents and encode/decode Kubernetes Secret payloads client-side.",
    icon: "FileText",
    category: "Encoding & YAML",
    featured: true,
    badge: "NEW",
    relatedGuide: {
      title: "Managing Secrets in Kubernetes & Helm",
      href: "/articles?category=devops",
    },
  },
  {
    id: 5,
    name: "Base64 Encoder / Decoder",
    slug: "base64",
    description: "Encode text strings into Base64 format or decode Base64 back to plain text.",
    icon: "ArrowLeftRight",
    category: "Encoding & YAML",
    featured: true,
  },
  {
    id: 6,
    name: "UUID Generator",
    slug: "uuid-generator",
    description: "Generate cryptographically secure v4 UUIDs individually or in bulk.",
    icon: "RefreshCw",
    category: "Generators",
    featured: true,
  },
];

const FILTER_TABS = [
  { id: "all", label: "All Utilities" },
  { id: "JSON & Data", label: "JSON & Data" },
  { id: "Regex & SQL", label: "Regex & SQL" },
  { id: "Security", label: "Security & JWT" },
  { id: "Encoding & YAML", label: "Encoding & YAML" },
];

export default function DeveloperToolsSection() {
  const [activeTab, setActiveTab] = useState("all");
  const { data } = useFeaturedTools();

  const filteredTools = CURATED_POPULAR_TOOLS.filter((tool) => {
    if (activeTab === "all") return true;
    return tool.category === activeTab;
  });

  return (
    <section className="py-12 lg:py-16 bg-slate-50/50 dark:bg-slate-950/30 border-b border-slate-200/60 dark:border-slate-800/60">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <Wrench className="h-3.5 w-3.5" />
              <span>Primary Developer Utilities</span>
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Popular Developer Tools
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              Fast, private, client-side tools designed to format, validate, encode, and debug data in seconds.
            </p>
          </div>

          <Link
            href="/tools"
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors shrink-0"
          >
            <span>Explore Full Catalog</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 mr-2 flex items-center gap-1 shrink-0">
            <Layers className="h-3.5 w-3.5" /> Filter:
          </span>
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all shrink-0 border ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-blue-500/40 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tools Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.slug}
              name={tool.name}
              slug={tool.slug}
              description={tool.description}
              icon={tool.icon}
              category={tool.category}
              badge={tool.badge}
              featured={tool.featured}
              relatedGuide={tool.relatedGuide}
            />
          ))}
        </div>
      </div>
    </section>
  );
}