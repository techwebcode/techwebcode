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
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href={primaryHref}
        className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 active:scale-95"
      >
        <Wrench className="h-4 w-4" />
        <span>Explore Developer Tools</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>

      <Link
        href={secondaryHref}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <BookOpen className="h-4 w-4 text-slate-500" />
        <span>Read Developer Guides →</span>
      </Link>
    </div>
  );
}