"use client";

import React from "react";
import { CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react";
import { K8sValidationResult } from "./k8sSecret.utils";

interface K8sSecretValidationPanelProps {
  result: K8sValidationResult;
  onJumpToLine?: (line: number) => void;
}

export default function K8sSecretValidationPanel({
  result,
  onJumpToLine,
}: K8sSecretValidationPanelProps) {
  if (result.valid) {
    return (
      <div className="flex flex-wrap items-center gap-3 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 text-xs font-semibold shadow-sm">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>✓ Valid YAML — No syntax errors found.</span>
        </div>
        <div className="flex items-center gap-1.5 pl-3 border-l border-emerald-300 dark:border-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>✓ Valid Kubernetes Secret — Base64 encoding verified.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30 p-3 text-rose-950 dark:text-rose-200 text-xs space-y-2 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-extrabold text-rose-700 dark:text-rose-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>✕ Invalid Kubernetes Secret Manifest</span>
        </div>
      </div>

      <div className="space-y-1 pl-6">
        {result.errors.map((err, idx) => (
          <div key={idx} className="flex items-center justify-between font-medium">
            <span>
              {err.line && <strong className="font-mono bg-rose-200/60 dark:bg-rose-900/60 px-1.5 py-0.5 rounded mr-1">Line {err.line}</strong>}
              {err.key && <span className="font-semibold text-slate-900 dark:text-slate-100 mr-1">[{err.key}]:</span>}
              {err.message}
            </span>

            {err.line && onJumpToLine && (
              <button
                type="button"
                onClick={() => onJumpToLine(err.line!)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-300 hover:underline shrink-0 ml-2"
              >
                <span>Jump to line</span>
                <ArrowUpRight className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
