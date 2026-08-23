import React from "react";
import { ShieldCheck, Cpu, Lock, CheckCircle2 } from "lucide-react";

export default function DeveloperPlatformSpecs() {
  return (
    <section className="py-10 border-b border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-r from-blue-950/5 via-slate-50 to-indigo-950/5 dark:from-slate-950/60 dark:via-slate-900/40 dark:to-slate-950/60">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 md:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Developer Platform Architecture</span>
              </div>
              <h3 className="mt-1.5 text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Designed for Speed, Security & Developer Privacy
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                TechWebCode tools execute 100% client-side in your browser. Your sensitive code snippets, API keys, JSON tokens, and database queries are never uploaded or recorded on external servers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:w-1/2">
              <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                  <Cpu className="h-4 w-4 text-blue-500 shrink-0" />
                  <span>Instant Execution</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  Zero network roundtrips. Instant local parsing.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                  <Lock className="h-4 w-4 text-purple-500 shrink-0" />
                  <span>Zero Server Logs</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  Your payload data stays strictly in local browser RAM.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>RFC Compliant</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  Strict spec adherence (RFC 8259, 7519, 4122).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
