"use client";

import React, { useRef } from "react";
import {
  GitCompare,
  Plus,
  FileCode,
  Upload,
  ArrowLeftRight,
  Trash2,
  Download,
  Maximize2,
  ChevronDown,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CodeDiffToolbarProps {
  onCompare: () => void;
  onNew: () => void;
  onLoadSample: () => void;
  onUploadOriginal: (content: string) => void;
  onUploadModified: (content: string) => void;
  onSwap: () => void;
  onTakeAllRight: () => void;
  onTakeAllLeft: () => void;
  onClear: () => void;
  onExportDiff: () => void;
  onExportOriginal: () => void;
  onExportModified: () => void;
  onExportJsonSummary: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

export default function CodeDiffToolbar({
  onCompare,
  onNew,
  onLoadSample,
  onUploadOriginal,
  onUploadModified,
  onSwap,
  onTakeAllRight,
  onTakeAllLeft,
  onClear,
  onExportDiff,
  onExportOriginal,
  onExportModified,
  onExportJsonSummary,
  onToggleFullscreen,
  isFullscreen,
}: CodeDiffToolbarProps) {
  const origFileInputRef = useRef<HTMLInputElement>(null);
  const modFileInputRef = useRef<HTMLInputElement>(null);

  const handleOrigFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) onUploadOriginal(content);
    };
    reader.readAsText(file);
    if (e.target) e.target.value = "";
  };

  const handleModFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) onUploadModified(content);
    };
    reader.readAsText(file);
    if (e.target) e.target.value = "";
  };

  return (
    <header className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-md space-y-3">
      {/* Hidden File Inputs */}
      <input type="file" ref={origFileInputRef} onChange={handleOrigFile} className="hidden" />
      <input type="file" ref={modFileInputRef} onChange={handleModFile} className="hidden" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Section: Icon + Title + Badges */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
            <GitCompare className="h-5 w-5" />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-slate-100">
              Code Difference Checker
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[10px] font-extrabold uppercase">
              Free Tool
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
              <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              <span>Client-Side</span>
            </span>
          </div>
        </div>

        {/* Center/Right Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Primary Solid TechWebCode Blue Action: Compare */}
          <Button
            type="button"
            onClick={onCompare}
            className="h-9 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all gap-1.5"
          >
            <GitCompare className="h-4 w-4" />
            <span>Compare Code</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onNew}
            className="h-9 px-3 rounded-xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onLoadSample}
            className="h-9 px-3 rounded-xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs gap-1.5"
          >
            <FileCode className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Sample Diff</span>
          </Button>

          {/* Upload Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 rounded-xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs gap-1"
                >
                  <Upload className="h-3.5 w-3.5 text-slate-400" />
                  <span>Upload</span>
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <DropdownMenuItem
                onClick={() => origFileInputRef.current?.click()}
                className="cursor-pointer font-semibold text-xs"
              >
                Upload Original File
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => modFileInputRef.current?.click()}
                className="cursor-pointer font-semibold text-xs"
              >
                Upload Modified File
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Swap Files */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSwap}
            className="h-9 px-3 rounded-xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs gap-1.5"
            title="Swap Original and Modified Files"
          >
            <ArrowLeftRight className="h-3.5 w-3.5 text-slate-400" />
            <span>Swap Files</span>
          </Button>

          {/* Bulk Hunk Merge Options Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 rounded-xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs gap-1"
                >
                  <span>Merge All</span>
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              <DropdownMenuItem onClick={onTakeAllRight} className="cursor-pointer font-semibold text-xs gap-2">
                <ArrowLeft className="h-3.5 w-3.5 text-blue-600" />
                <span>Take All from Right (Modified → Original)</span>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={onTakeAllLeft} className="cursor-pointer font-semibold text-xs gap-2">
                <ArrowRight className="h-3.5 w-3.5 text-blue-600" />
                <span>Take All from Left (Original → Modified)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-9 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl gap-1.5"
            title="Clear both editors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear</span>
          </Button>

          {/* Export Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 rounded-xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs gap-1"
                >
                  <Download className="h-3.5 w-3.5 text-slate-400" />
                  <span>Export</span>
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-52 rounded-xl">
              <DropdownMenuItem onClick={onExportDiff} className="cursor-pointer font-semibold text-xs">
                Download Unified Diff (.diff)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportOriginal} className="cursor-pointer font-semibold text-xs">
                Download Original Code
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportModified} className="cursor-pointer font-semibold text-xs">
                Download Modified Code
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportJsonSummary} className="cursor-pointer font-semibold text-xs">
                Export JSON Change Summary
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Fullscreen Workspace Toggle */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onToggleFullscreen}
            className="h-9 px-3 rounded-xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold gap-1.5"
            title="Fullscreen Workspace (Distraction Free)"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Fullscreen</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
