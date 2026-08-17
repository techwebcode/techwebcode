"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";

interface ClientSidePrivacyNoticeProps {
  className?: string;
}

export default function ClientSidePrivacyNotice({
  className = "",
}: ClientSidePrivacyNoticeProps) {
  return (
    <div
      className={`rounded-2xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/30 p-3.5 sm:p-4 text-emerald-950 dark:text-emerald-200 shadow-sm transition-all ${className}`}
      role="region"
      aria-label="Privacy guarantee"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="p-2 rounded-xl bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
          <ShieldCheck className="h-5 w-5" />
        </div>

        <div className="space-y-0.5 min-w-0">
          <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <span>🛡 100% Client-Side Privacy</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
            Your data stays in your browser. Nothing is uploaded, logged, or stored on TechWebCode servers.
          </p>
        </div>
      </div>
    </div>
  );
}
