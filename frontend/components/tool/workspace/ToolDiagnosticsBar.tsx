"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

interface ToolDiagnosticsBarProps {
  valid: boolean;
  error?: string;
  value?: string;
  onJumpToError?: () => void;
}

export default function ToolDiagnosticsBar({
  valid,
  error,
  value = "",
  onJumpToError,
}: ToolDiagnosticsBarProps) {
  // If input is empty, don't show an intrusive alert
  if (!value.trim() && !error) {
    return null;
  }

  if (valid) {
    return (
      <div className="flex items-center justify-between p-3 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm font-semibold transition-all animate-in fade-in duration-150">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            <strong className="font-bold">✓ Valid JSON</strong> — No syntax errors found. Ready to use or format.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 text-xs sm:text-sm font-semibold transition-all animate-in fade-in duration-150">
      <div className="flex items-start sm:items-center gap-2.5 min-w-0">
        <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5 sm:mt-0" />
        <span className="truncate">
          <strong className="font-bold">✕ Invalid JSON</strong> — {error || "Syntax error detected in input payload."}
        </span>
      </div>

      {onJumpToError && (
        <button
          type="button"
          onClick={onJumpToError}
          className="inline-flex items-center gap-1 rounded-lg bg-rose-600 text-white px-2.5 py-1 text-xs font-bold shadow-sm hover:bg-rose-700 transition-colors shrink-0"
        >
          <span>Jump to error</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
