"use client";

import React from "react";
import { DiffOptions } from "./diff.utils";

export type ViewMode = "side-by-side" | "unified" | "split" | "word-diff";

interface CodeDiffControlsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  options: DiffOptions;
  onOptionsChange: (newOptions: DiffOptions) => void;
}

const SUPPORTED_LANGUAGES = [
  { value: "auto", label: "Auto Detect" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "json", label: "JSON" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "sql", label: "SQL" },
  { value: "yaml", label: "YAML" },
  { value: "xml", label: "XML" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "cpp", label: "C / C++" },
  { value: "php", label: "PHP" },
  { value: "shell", label: "Shell / Bash" },
];

export default function CodeDiffControls({
  viewMode,
  onViewModeChange,
  options,
  onOptionsChange,
}: CodeDiffControlsProps) {
  const toggleOption = (key: keyof DiffOptions) => {
    onOptionsChange({
      ...options,
      [key]: !options[key],
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* View Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 hidden sm:inline">
            View Mode:
          </span>
          {(["side-by-side", "unified", "split", "word-diff"] as ViewMode[]).map((mode) => {
            const isActive = viewMode === mode;
            const label =
              mode === "side-by-side"
                ? "Side by Side"
                : mode === "unified"
                  ? "Unified"
                  : mode === "split"
                    ? "Split"
                    : "Word Diff";

            return (
              <button
                key={mode}
                type="button"
                onClick={() => onViewModeChange(mode)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Ignore Options Checkboxes */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 hidden lg:inline">
            Ignore:
          </span>

          <label className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={options.ignoreWhitespace}
              onChange={() => toggleOption("ignoreWhitespace")}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Whitespace</span>
          </label>

          <label className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={options.ignoreCase}
              onChange={() => toggleOption("ignoreCase")}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Case</span>
          </label>

          <label className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={options.ignoreComments}
              onChange={() => toggleOption("ignoreComments")}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Comments</span>
          </label>

          <label className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={options.wordDiff}
              onChange={() => toggleOption("wordDiff")}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Word-Level Diff</span>
          </label>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Language:
          </span>
          <select
            value={options.language}
            onChange={(e) => onOptionsChange({ ...options, language: e.target.value })}
            className="h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-2.5 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-blue-600"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
