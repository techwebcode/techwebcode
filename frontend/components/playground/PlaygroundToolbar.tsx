"use client";

import React from "react";
import {
  Play,
  RotateCcw,
  Download,
  Copy,
  Check,
  Columns,
  Rows,
  Maximize2,
  Code2,
  Loader2,
} from "lucide-react";
import { LANGUAGES, LanguageConfig } from "./languages.config";

interface PlaygroundToolbarProps {
  currentLanguage: LanguageConfig;
  onSelectLanguage: (slug: string) => void;
  onRun: () => void;
  isRunning?: boolean;
  onReset: () => void;
  onCopy: () => void;
  isCopied: boolean;
  onExport: () => void;
  layoutMode: "columns" | "rows";
  onToggleLayout: () => void;
  onToggleFullscreen: () => void;
}

export default function PlaygroundToolbar({
  currentLanguage,
  onSelectLanguage,
  onRun,
  isRunning = false,
  onReset,
  onCopy,
  isCopied,
  onExport,
  layoutMode,
  onToggleLayout,
  onToggleFullscreen,
}: PlaygroundToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-card border-b border-border text-foreground select-none">
      {/* Left: Language Selector & Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-bold text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg border border-primary/20 shrink-0">
          <Code2 className="w-4 h-4 text-primary" />
          <span className="hidden sm:inline">Online Playground</span>
        </div>

        {/* Language Switcher Dropdown */}
        <div className="flex items-center gap-1.5">
          <label htmlFor="language-select" className="text-xs font-semibold text-muted-foreground hidden md:inline">
            Language:
          </label>
          <select
            id="language-select"
            value={currentLanguage.slug}
            onChange={(e) => onSelectLanguage(e.target.value)}
            className="text-xs bg-muted text-foreground border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary font-bold cursor-pointer transition-all hover:bg-muted/80"
            aria-label="Select programming language"
          >
            {Object.values(LANGUAGES).map((lang) => (
              <option key={lang.slug} value={lang.slug}>
                {lang.name} ({lang.executionType === "client" ? "Browser" : "Compiler"})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: Controls & Actions */}
      <div className="flex items-center gap-2">
        {/* Run Button */}
        <button
          type="button"
          onClick={onRun}
          disabled={isRunning}
          className={`flex items-center gap-1.5 text-xs font-extrabold bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed`}
          title={isRunning ? "Executing code..." : "Run Code (Ctrl + Enter)"}
          aria-label={isRunning ? "Executing code" : "Run Code"}
        >
          {isRunning ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current" />
          )}
          <span>{isRunning ? "Running..." : "Run"}</span>
        </button>

        {/* Reset Button */}
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs font-medium bg-muted hover:bg-muted/80 text-foreground px-3 py-1.5 rounded-lg border border-border transition-all cursor-pointer"
          title="Reset Code to Default Template"
          aria-label="Reset Code"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        {/* Copy Button */}
        <button
          type="button"
          onClick={onCopy}
          className="flex items-center gap-1.5 text-xs font-medium bg-muted hover:bg-muted/80 text-foreground px-3 py-1.5 rounded-lg border border-border transition-all cursor-pointer"
          title="Copy Code to Clipboard"
          aria-label="Copy Code"
        >
          {isCopied ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">{isCopied ? "Copied" : "Copy"}</span>
        </button>

        {/* Export Button */}
        <button
          type="button"
          onClick={onExport}
          className="flex items-center gap-1.5 text-xs font-medium bg-muted hover:bg-muted/80 text-foreground px-3 py-1.5 rounded-lg border border-border transition-all cursor-pointer"
          title="Export Code to File"
          aria-label="Export Code"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export</span>
        </button>

        <div className="h-4 w-px bg-border mx-0.5" />

        {/* Layout Toggle */}
        <button
          type="button"
          onClick={onToggleLayout}
          className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors cursor-pointer"
          title={`Switch to ${layoutMode === "columns" ? "Stacked Rows" : "Side-by-Side"} Layout`}
          aria-label="Toggle Layout Mode"
        >
          {layoutMode === "columns" ? <Rows className="w-4 h-4" /> : <Columns className="w-4 h-4" />}
        </button>

        {/* Fullscreen Workspace Button */}
        <button
          type="button"
          onClick={onToggleFullscreen}
          className="flex items-center gap-1.5 text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white px-2.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-2xs"
          title="Full Screen Workspace (Distraction Free)"
          aria-label="Full Screen Workspace"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Full Screen Workspace</span>
        </button>
      </div>
    </div>
  );
}
