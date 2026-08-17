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
}: ToolCardProps) {
  let IconComponent: LucideIcon = Wrench;

  if (typeof icon === "string" && ICON_MAP[icon]) {
    IconComponent = ICON_MAP[icon];
  } else if (typeof icon === "function" || typeof icon === "object") {
    IconComponent = icon as LucideIcon;
  }

  return (
    <div
      className={`group relative flex h-full flex-col rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-600/60 hover:shadow-xl dark:bg-slate-900/90 ${
        featured ? "border-blue-500/30 ring-1 ring-blue-500/20" : "border-slate-200 dark:border-slate-800"
      }`}
    >
      {/* Direct link wrapper */}
      <Link href={`/tools/${slug}`} className="flex-1 flex flex-col">
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <IconComponent className="h-5.5 w-5.5" />
          </div>

          {badge && (
            <span
              className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                badge === "NEW"
                  ? "bg-rose-500 text-white"
                  : "bg-blue-600 text-white"
              }`}
            >
              {badge}
            </span>
          )}
        </div>

        <div className="mt-4 flex-1">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {name}
          </h3>

          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3">
          {category ? (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {category}
            </span>
          ) : (
            <span />
          )}

          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400">
            Open Tool
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>

      {/* Optional Cross-Link to Supporting Guide (Requirement 7: Tool -> Guide -> Tool loop) */}
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