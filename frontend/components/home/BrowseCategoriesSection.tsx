import React from "react";
import Link from "next/link";
import {
  FileCode,
  Database,
  ShieldCheck,
  FileText,
  ArrowRightLeft,
  RefreshCw,
  Clock,
  ArrowRight,
  FolderKanban,
  Check,
} from "lucide-react";

const TOOL_CATEGORIES = [
  {
    title: "JSON & Data",
    slug: "json-data",
    count: "3 Tools",
    description: "Format, validate, beautify, and compress JSON payloads.",
    includedTools: ["JSON Formatter", "JSON Validator", "Minifier"],
    icon: FileCode,
    href: "/tools?category=json-data",
    gradient: "from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    title: "Regex & SQL",
    slug: "regex-sql",
    count: "2 Tools",
    description: "Test regular expressions and format complex SQL queries.",
    includedTools: ["Regex Tester", "SQL Formatter"],
    icon: Database,
    href: "/tools?category=regex-sql",
    gradient: "from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Encoding & Security",
    slug: "security",
    count: "3 Tools",
    description: "Inspect JWT claims, encode Base64 strings & URL query params.",
    includedTools: ["JWT Decoder", "Base64 Encoder", "URL Encoder"],
    icon: ShieldCheck,
    href: "/tools?category=security",
    gradient: "from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    title: "YAML & Kubernetes",
    slug: "yaml-k8s",
    count: "2 Tools",
    description: "Format YAML documents and generate K8s Secret payloads.",
    includedTools: ["YAML Formatter", "K8s Secret Generator"],
    icon: FileText,
    href: "/tools?category=yaml-k8s",
    gradient: "from-purple-500/10 to-violet-500/10 text-purple-600 dark:text-purple-400",
  },
  {
    title: "Web & API",
    slug: "api-devops",
    count: "2 Tools",
    description: "API contract testing and cross-file deployment config diagnostic.",
    includedTools: ["API Contract Tester", "Deployment Config"],
    icon: ArrowRightLeft,
    href: "/tools?category=api-devops",
    gradient: "from-rose-500/10 to-pink-500/10 text-rose-600 dark:text-rose-400",
  },
  {
    title: "Generators",
    slug: "generators",
    count: "1 Tool",
    description: "Generate cryptographically secure v4 UUIDs individually or bulk.",
    includedTools: ["v4 UUID Bulk Generator"],
    icon: RefreshCw,
    href: "/tools?category=generators",
    gradient: "from-cyan-500/10 to-blue-500/10 text-cyan-600 dark:text-cyan-400",
  },
  {
    title: "Date & Time",
    slug: "date-time",
    count: "1 Tool",
    description: "Convert Epoch Unix timestamps to UTC, ISO dates, and local time.",
    includedTools: ["Epoch Unix Converter"],
    icon: Clock,
    href: "/tools?category=date-time",
    gradient: "from-sky-500/10 to-indigo-500/10 text-sky-600 dark:text-sky-400",
  },
];

export default function BrowseCategoriesSection() {
  return (
    <section className="py-12 lg:py-16 border-b border-slate-200/60 dark:border-slate-800/60">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <FolderKanban className="h-3.5 w-3.5" />
              <span>Categorized Directory</span>
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Browse Developer Tools by Category
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              Quickly find developer tools organized by domain, language, or data specification.
            </p>
          </div>

          <Link
            href="/tools"
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors shrink-0"
          >
            <span>View All Categories</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Category Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TOOL_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={cat.href}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/60 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${cat.gradient}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-slate-100 dark:bg-slate-800/80 px-2.5 py-0.5 text-[10px] font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wider border border-slate-200/60 dark:border-slate-700/60">
                      {cat.count}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {cat.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>

                  {/* Included Utilities List */}
                  {cat.includedTools && cat.includedTools.length > 0 && (
                    <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-1">
                      {cat.includedTools.map((tName) => (
                        <span
                          key={tName}
                          className="inline-flex items-center gap-1 rounded bg-slate-100/80 dark:bg-slate-800/60 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-400"
                        >
                          <Check className="h-2.5 w-2.5 text-emerald-500 shrink-0" />
                          <span>{tName}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 opacity-90 group-hover:opacity-100 transition-opacity">
                  <span>Browse Category</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
