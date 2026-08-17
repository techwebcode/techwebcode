"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";

interface WorkspaceFooterProps {
  value: string;
  isClientSideOnly?: boolean;
}

export default function WorkspaceFooter({
  value,
  isClientSideOnly = true,
}: WorkspaceFooterProps) {
  // Calculate text metrics
  const linesCount = value ? value.split("\n").length : 0;
  const charCount = value ? value.length : 0;

  // Format payload size in B, KB, MB
  const getByteSize = (str: string) => {
    const bytes = new Blob([str]).size;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const byteSize = getByteSize(value);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-xs font-mono select-none">
      {/* Left: Text & Code Metrics */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Ln 1, Col 1</span>
        </div>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <div>
          <span>Lines:</span> <strong className="text-slate-700 dark:text-slate-300 font-bold">{linesCount}</strong>
        </div>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <div>
          <span>Characters:</span> <strong className="text-slate-700 dark:text-slate-300 font-bold">{charCount}</strong>
        </div>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <div>
          <span>Size:</span> <strong className="text-slate-700 dark:text-slate-300 font-bold">{byteSize}</strong>
        </div>
      </div>

      {/* Right: Privacy & Security Badge */}
      {isClientSideOnly && (
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-sans font-semibold text-[11px]">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>✓ 100% Privacy — All processing happens in your browser</span>
        </div>
      )}
    </div>
  );
}
