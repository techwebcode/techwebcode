import React from "react";
import Link from "next/link";
import { Bug, MessageSquare } from "lucide-react";

export default function HelpFeedbackSection() {
  return (
    <section className="py-10 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 md:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <Bug className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
                  <span>Help &amp; Feedback</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Found a Bug or Have Feedback?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                  Notice a broken tool, incorrect output, or visual glitch? Help us make TechWebCode better by reporting issues directly to our engineering team.
                </p>
              </div>
            </div>

            <Link
              href="/contact?type=bug"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-xs sm:text-sm font-bold text-rose-700 dark:text-rose-300 transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 w-full sm:w-auto text-center"
              aria-label="Report a bug on TechWebCode"
            >
              <Bug className="h-4 w-4 shrink-0" />
              <span>Report a Bug</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
