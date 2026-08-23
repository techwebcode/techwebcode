"use client";

import React, { useRef } from "react";
import {
  Menu,
  Play,
  Minimize2,
  CheckCircle2,
  FileCode,
  Upload,
  Copy,
  Download,
  HelpCircle,
  Maximize2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ToolWorkspaceHeaderProps {
  title: string;
  badge?: string;
  isToolsPanelOpen: boolean;
  onToggleToolsPanel: () => void;
  isHelpPanelOpen: boolean;
  onToggleHelpPanel: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onFormat: () => void;
  onMinify: () => void;
  onValidate: () => void;
  indent: string;
  onIndentChange: (indent: string) => void;
  onLoadSample: () => void;
  onFileUpload: (content: string) => void;
  onCopy: () => void;
  onDownload: () => void;
}

export default function ToolWorkspaceHeader({
  title,
  badge = "Free Tool",
  isToolsPanelOpen,
  onToggleToolsPanel,
  isHelpPanelOpen,
  onToggleHelpPanel,
  isFullscreen,
  onToggleFullscreen,
  onFormat,
  onMinify,
  onValidate,
  indent,
  onIndentChange,
  onLoadSample,
  onFileUpload,
  onCopy,
  onDownload,
}: ToolWorkspaceHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) onFileUpload(content);
    };
    reader.readAsText(file);
    if (e.target) e.target.value = "";
  };

  return (
    <header className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-md space-y-3">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json,.txt,.application/json"
        className="hidden"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Section: [☰] Drawer Toggle + Tool Title + Badges */}
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onToggleToolsPanel}
            className={`h-9 w-9 p-0 rounded-xl border ${
              isToolsPanelOpen
                ? "bg-blue-600 text-white border-blue-600"
                : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
            title="Toggle Left Tools Panel"
            aria-label="Toggle left tools panel"
          >
            <Menu className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-slate-100">
              {title}
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[10px] font-extrabold uppercase">
              {badge}
            </span>
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold"
              title="100% Client-Side: Processed locally in your browser"
            >
              <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              <span>Client-Side</span>
            </span>
          </div>
        </div>

        {/* Center Section: Primary Action Buttons & Indent Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            type="button"
            onClick={onFormat}
            className="h-9 px-4 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-700 active:scale-95 transition-all gap-1.5"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Format</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onMinify}
            className="h-9 px-3.5 rounded-xl border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs gap-1.5"
          >
            <Minimize2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Minify</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onValidate}
            className="h-9 px-3.5 rounded-xl border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs gap-1.5"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Validate</span>
          </Button>

          {/* Indent Selector */}
          <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Indent:
            </span>
            {["2", "4", "8"].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => onIndentChange(val)}
                className={`h-7 w-7 rounded-lg text-xs font-bold transition-all ${
                  indent === val
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Right Section: Utilities & Panels Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onLoadSample}
            className="h-8 px-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg gap-1"
          >
            <FileCode className="h-3.5 w-3.5 text-slate-400" />
            <span>Sample</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-8 px-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg gap-1"
          >
            <Upload className="h-3.5 w-3.5 text-slate-400" />
            <span>Upload</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCopy}
            className="h-8 px-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg gap-1"
          >
            <Copy className="h-3.5 w-3.5 text-slate-400" />
            <span>Copy</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDownload}
            className="h-8 px-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg gap-1"
          >
            <Download className="h-3.5 w-3.5 text-slate-400" />
            <span>Download</span>
          </Button>

          {/* Toggle Help Panel */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onToggleHelpPanel}
            className={`h-8 w-8 p-0 rounded-lg border ${
              isHelpPanelOpen
                ? "bg-blue-600 text-white border-blue-600"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
            title="Toggle Right Help Panel"
            aria-label="Toggle right help panel"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>

          {/* Fullscreen Workspace Toggle */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onToggleFullscreen}
            className="h-8 px-2.5 rounded-lg border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold gap-1"
            title="Fullscreen Workspace (Distraction Free)"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Full Screen Workspace</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
