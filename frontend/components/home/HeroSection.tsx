import Link from "next/link";
import HeroActions from "./HeroActions";
import HeroSearch from "./HeroSearch";
import { ShieldCheck, Zap, Lock, UserCheck, Terminal, Sparkles } from "lucide-react";

const QUICK_UTILITIES = [
  { name: "JSON Formatter", href: "/tools/json-formatter", tag: "Format & Validate" },
  { name: "JWT Decoder", href: "/tools/jwt-decoder", tag: "Inspect Claims" },
  { name: "Regex Tester", href: "/tools/regex-tester", tag: "Test Patterns" },
  { name: "SQL Formatter", href: "/tools/sql-formatter", tag: "Beautify Queries" },
  { name: "Base64", href: "/tools/base64", tag: "Encode & Decode" },
  { name: "UUID Generator", href: "/tools/uuid-generator", tag: "v4 Bulk" },
];

const HIGHLIGHTED_PILLS = [
  {
    icon: ShieldCheck,
    title: "100% Client-Side",
    desc: "Processed in your browser",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Zap,
    title: "Zero Latency",
    desc: "Instant local execution",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Lock,
    title: "Privacy First",
    desc: "Zero server data logs",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
  {
    icon: UserCheck,
    title: "No Signup Required",
    desc: "100% free forever",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
];

export default function HeroSection() {
  return (
    <section className="py-12 lg:py-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-slate-50/90 via-white to-transparent dark:from-slate-950/80 dark:via-slate-900/50 dark:to-transparent">
      <div className="container mx-auto px-4 max-w-5xl text-center flex flex-col items-center">
        {/* Platform Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 shadow-sm">
          <Terminal className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          <span>Professional Developer Utility Platform</span>
        </div>

        {/* Tools-First Headline */}
        <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl lg:text-6xl max-w-4xl leading-[1.15]">
          Developer tools that{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 dark:from-blue-400 dark:via-indigo-400 dark:to-blue-300 bg-clip-text text-transparent">
            just get the job done.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="mt-4 max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          Fast, practical, privacy-first tools for formatting, validating, encoding,
          debugging, and working with modern development data.
        </p>

        {/* Search Box */}
        <div className="mt-7 w-full flex justify-center">
          <HeroSearch placeholder="Search developer tools (e.g. JSON, JWT, Regex, SQL)..." />
        </div>

        {/* 1-Click Quick Access Utility Chips */}
        <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 max-w-2xl text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-blue-500" /> Quick Access:
          </span>
          {QUICK_UTILITIES.map((u) => (
            <Link
              key={u.name}
              href={u.href}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-2.5 py-1 font-medium text-slate-700 dark:text-slate-300 shadow-2xs hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
            >
              <span>{u.name}</span>
            </Link>
          ))}
        </div>

        {/* Main CTAs */}
        <div className="mt-7 flex justify-center">
          <HeroActions />
        </div>

        {/* PROMINENT HIGHLIGHTED VALUE PROPOSITION GRID */}
        <div className="mt-12 w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-left">
          {HIGHLIGHTED_PILLS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 shadow-sm hover:shadow-md hover:border-blue-500/40 transition-all duration-200"
              >
                <div className={`p-2.5 rounded-xl border ${item.bg} ${item.color} shrink-0 transition-transform group-hover:scale-105`}>
                  <Icon className="h-5 w-5 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                    {item.title}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {item.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}