"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { X, HelpCircle, ArrowRight } from "lucide-react";

interface RightHelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
  toolSlug: string;
}

export default function RightHelpPanel({
  isOpen,
  onClose,
  toolSlug,
}: RightHelpPanelProps) {
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
    }
  }, []);

  if (!isOpen) return null;

  const cmdKey = isMac ? "⌘" : "Ctrl";

  return (
    <aside
      className="w-72 shrink-0 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-lg flex flex-col justify-between animate-in fade-in duration-200"
      aria-label="Quick Help Panel"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
              HELP (Right Panel)
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            title="Close Help Panel"
            aria-label="Close help panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            QUICK HELP &amp; SHORTCUTS
          </h4>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="font-medium text-slate-700 dark:text-slate-300">Format JSON</span>
              <kbd className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-[10px] text-slate-600 dark:text-slate-300">
                {cmdKey} + Enter
              </kbd>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="font-medium text-slate-700 dark:text-slate-300">Minify JSON</span>
              <kbd className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-[10px] text-slate-600 dark:text-slate-300">
                {cmdKey} + Shift + M
              </kbd>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="font-medium text-slate-700 dark:text-slate-300">Validate JSON</span>
              <kbd className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-[10px] text-slate-600 dark:text-slate-300">
                {cmdKey} + Shift + V
              </kbd>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="font-medium text-slate-700 dark:text-slate-300">Upload JSON file</span>
              <kbd className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-[10px] text-slate-600 dark:text-slate-300">
                {cmdKey} + O
              </kbd>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="font-medium text-slate-700 dark:text-slate-300">Fullscreen</span>
              <kbd className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-[10px] text-slate-600 dark:text-slate-300">
                Esc to Exit
              </kbd>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
        <Link
          href={`/articles?search=${encodeURIComponent(toolSlug)}`}
          className="flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <span>View guides &amp; examples</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </aside>
  );
}
