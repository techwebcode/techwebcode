import Link from "next/link";
import { Wrench, BookOpen, ArrowRight } from "lucide-react";

interface HeroActionsProps {
  primaryHref?: string;
  secondaryHref?: string;
}

export default function HeroActions({
  primaryHref = "/tools",
  secondaryHref = "/articles",
}: HeroActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3.5">
      <Link
        href={primaryHref}
        className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 dark:bg-blue-500 px-6 py-3 text-sm font-extrabold text-white shadow-md hover:shadow-blue-500/20 transition-all duration-200 hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-95"
      >
        <Wrench className="h-4 w-4" />
        <span>Explore Developer Tools</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>

      <Link
        href={secondaryHref}
        className="group inline-flex items-center gap-2 rounded-xl border border-slate-300/90 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
      >
        <BookOpen className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
        <span>Read Developer Guides</span>
        <ArrowRight className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:translate-x-1 group-hover:opacity-100" />
      </Link>
    </div>
  );
}