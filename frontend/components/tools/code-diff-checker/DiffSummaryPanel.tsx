"use client";

import React from "react";
import { DiffStats } from "./diff.utils";
import { Copy, Download, Keyboard, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DiffSummaryPanelProps {
  stats: DiffStats;
  onCopyDiff: () => void;
  onDownloadDiff: () => void;
  onCopyOriginal: () => void;
  onCopyModified: () => void;
}

export default function DiffSummaryPanel({
  stats,
  onCopyDiff,
  onDownloadDiff,
  onCopyOriginal,
  onCopyModified,
}: DiffSummaryPanelProps) {
  return (
    <div className="space-y-4">
      {/* Change Summary Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span>CHANGE SUMMARY</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-base shadow-sm">
              {stats.totalChanges}
            </div>
            <div>
              <div className="font-extrabold text-xs text-slate-900 dark:text-slate-100">
                Total Changes
              </div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {stats.isIdentical ? "Files match perfectly" : `${stats.charsChanged} characters modified`}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400">
            <span className="text-[10px] block text-emerald-600/70 dark:text-emerald-400/70 font-semibold uppercase">Added</span>
            <span className="text-sm font-extrabold">+{stats.addedLines}</span>
          </div>

          <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 text-rose-700 dark:text-rose-400">
            <span className="text-[10px] block text-rose-600/70 dark:text-rose-400/70 font-semibold uppercase">Removed</span>
            <span className="text-sm font-extrabold">−{stats.removedLines}</span>
          </div>

          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-amber-700 dark:text-amber-400">
            <span className="text-[10px] block text-amber-600/70 dark:text-amber-400/70 font-semibold uppercase">Modified</span>
            <span className="text-sm font-extrabold">~{stats.modifiedLines}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
          <div className="flex justify-between">
            <span>Original Lines:</span>
            <strong className="text-slate-800 dark:text-slate-200">{stats.originalLineCount} lines ({stats.fileSizeOriginal})</strong>
          </div>
          <div className="flex justify-between">
            <span>Modified Lines:</span>
            <strong className="text-slate-800 dark:text-slate-200">{stats.modifiedLineCount} lines ({stats.fileSizeModified})</strong>
          </div>
        </div>
      </div>

      {/* Quick Actions Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          QUICK ACTIONS
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCopyDiff}
            className="h-8 text-xs font-bold rounded-xl border-slate-200 dark:border-slate-800 gap-1.5"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Copy Diff</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onDownloadDiff}
            className="h-8 text-xs font-bold rounded-xl border-slate-200 dark:border-slate-800 gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download Diff</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCopyOriginal}
            className="h-8 text-[11px] font-semibold text-slate-600 dark:text-slate-400 rounded-xl"
          >
            Copy Original
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCopyModified}
            className="h-8 text-[11px] font-semibold text-slate-600 dark:text-slate-400 rounded-xl"
          >
            Copy Modified
          </Button>
        </div>
      </div>

      {/* Keyboard Shortcuts Cheatsheet */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Keyboard className="h-4 w-4" />
          <span>KEYBOARD SHORTCUTS</span>
        </div>

        <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400 font-medium">
          <div className="flex justify-between items-center">
            <span>Next Change</span>
            <kbd className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-[10px] font-mono">Alt + ↓</kbd>
          </div>
          <div className="flex justify-between items-center">
            <span>Previous Change</span>
            <kbd className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-[10px] font-mono">Alt + ↑</kbd>
          </div>
          <div className="flex justify-between items-center">
            <span>Compare Code</span>
            <kbd className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-[10px] font-mono">Ctrl + Enter</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
