import Link from "next/link";
import {
  LucideIcon,
  ArrowRight,
  Braces,
  Code2,
  KeyRound,
  Binary,
  Hash,
  Clock3,
  Clock,
  Wrench,
  FileCode,
  Terminal,
  Cpu,
  CheckCircle2,
  Minimize2,
  Database,
  FileText,
  ArrowRightLeft,
  ShieldCheck,
  ArrowLeftRight,
  Key,
  Link as LinkIcon,
  RefreshCw,
  BookOpen,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  "code-bracket": Braces,
  code: Code2,
  "code-2": Code2,
  Code2,
  key: Key,
  Key,
  binary: Binary,
  hash: Hash,
  clock: Clock,
  Clock,
  Clock3,
  wrench: Wrench,
  Wrench,
  "file-code": FileCode,
  FileCode,
  terminal: Terminal,
  Terminal,
  cpu: Cpu,
  "check-circle-2": CheckCircle2,
  CheckCircle2,
  "minimize-2": Minimize2,
  Minimize2,
  database: Database,
  Database,
  "file-text": FileText,
  FileText,
  "arrow-right-left": ArrowRightLeft,
  ArrowRightLeft,
  "shield-check": ShieldCheck,
  ShieldCheck,
  "arrow-left-right": ArrowLeftRight,
  ArrowLeftRight,
  link: LinkIcon,
  Link: LinkIcon,
  LinkIcon,
  "refresh-cw": RefreshCw,
  RefreshCw,
};

// Developer-focused spec tag mapping for high clarity
const TOOL_SPECS: Record<string, { specTag: string; ioPill: string }> = {
  "json-formatter": { specTag: "RFC 8259", ioPill: "JSON ➔ Formatted Tree" },
  "json-validator": { specTag: "RFC 8259", ioPill: "Syntax ➔ Line Diagnostics" },
  "regex-tester": { specTag: "PCRE / JS", ioPill: "Pattern ➔ Match Highlights" },
  "sql-formatter": { specTag: "ANSI / Postgres", ioPill: "Query ➔ Indented SQL" },
  "jwt-decoder": { specTag: "RFC 7519", ioPill: "Token ➔ Claims & Signature" },
  "yaml-formatter": { specTag: "YAML 1.2", ioPill: "YAML ➔ K8s Manifest" },
  base64: { specTag: "RFC 4648", ioPill: "Raw Text ↔ Base64" },
  "uuid-generator": { specTag: "RFC 4122 v4", ioPill: "Crypto UUID Generator" },
};

export interface RelatedGuide {
  title: string;
  href: string;
}

export interface ToolCardProps {
  name: string;
  slug: string;
  description: string;
  icon?: LucideIcon | string;
  category?: string;
  badge?: string;
  featured?: boolean;
  relatedGuide?: RelatedGuide;
  specTag?: string;
  ioPill?: string;
}

export default function ToolCard({
  name,
  slug,
  description,
  icon,
  category,
  badge,
  featured = false,
  relatedGuide,
  specTag,
  ioPill,
}: ToolCardProps) {
  let IconComponent: LucideIcon = Wrench;

  if (typeof icon === "string" && ICON_MAP[icon]) {
    IconComponent = ICON_MAP[icon];
  } else if (typeof icon === "function" || typeof icon === "object") {
    IconComponent = icon as LucideIcon;
  }

  // Resolve technical spec tag and IO capability pill
  const resolvedSpec = specTag || TOOL_SPECS[slug]?.specTag || "Client-Side";
  const resolvedIoPill = ioPill || TOOL_SPECS[slug]?.ioPill;

  return (
    <div
      className={`group relative flex h-full flex-col rounded-2xl border bg-white dark:bg-slate-900 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/60 dark:hover:border-blue-500/60 hover:shadow-md ${
        featured
          ? "border-blue-500/30 ring-1 ring-blue-500/15 dark:border-blue-500/30"
          : "border-slate-200/90 dark:border-slate-800/90"
      }`}
    >
      {/* Direct link wrapper */}
      <Link href={`/tools/${slug}`} className="flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 transition-all shrink-0">
            <IconComponent className="h-5.5 w-5.5" />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {resolvedSpec && (
              <span className="rounded-md bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
                {resolvedSpec}
              </span>
            )}

            {badge && (
              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                  badge === "NEW"
                    ? "bg-rose-500 text-white"
                    : badge === "FEATURED"
                    ? "bg-blue-600 dark:bg-blue-500 text-white"
                    : "bg-slate-700 text-white"
                }`}
              >
                {badge}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 flex-1">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {name}
          </h3>

          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {description}
          </p>

          {resolvedIoPill && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-md bg-blue-50/80 dark:bg-blue-950/40 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/40">
              <span className="truncate">{resolvedIoPill}</span>
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3">
          {category ? (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {category}
            </span>
          ) : (
            <span />
          )}

          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400">
            Open Utility
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>

      {/* Optional Cross-Link to Supporting Guide */}
      {relatedGuide && (
        <div className="mt-3 pt-2.5 border-t border-dashed border-slate-200 dark:border-slate-800/60">
          <Link
            href={relatedGuide.href}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate max-w-full"
          >
            <BookOpen className="h-3 w-3 shrink-0 text-blue-500" />
            <span className="truncate">Guide: {relatedGuide.title}</span>
            <ArrowRight className="h-3 w-3 shrink-0 ml-auto opacity-70" />
          </Link>
        </div>
      )}
    </div>
  );
}