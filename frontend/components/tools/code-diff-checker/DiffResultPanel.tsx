"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ListFilter,
  BarChart2,
  FileCode,
  ArrowRight,
  PlusCircle,
  MinusCircle,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { DiffResult, ChangeBlock } from "./diff.utils";
import { Button } from "@/components/ui/button";

interface DiffResultPanelProps {
  diffResult: DiffResult;
  currentChangeIndex: number;
  onSelectChangeIndex: (idx: number) => void;
  onTakeRight: (block: ChangeBlock) => void;
  onTakeLeft: (block: ChangeBlock) => void;
}

export default function DiffResultPanel({
  diffResult,
  currentChangeIndex,
  onSelectChangeIndex,
  onTakeRight,
  onTakeLeft,
}: DiffResultPanelProps) {
  const [activeTab, setActiveTab] = useState<"unified" | "changes" | "stats">("changes");
  const { lines, changes, stats } = diffResult;

  // Continuous Prev / Next navigation with wrapping
  const handlePrevChange = () => {
    if (changes.length === 0) return;
    const newIdx = currentChangeIndex > 0 ? currentChangeIndex - 1 : changes.length - 1;
    onSelectChangeIndex(newIdx);
  };

  const handleNextChange = () => {
    if (changes.length === 0) return;
    const newIdx = currentChangeIndex < changes.length - 1 ? currentChangeIndex + 1 : 0;
    onSelectChangeIndex(newIdx);
  };

  // Keyboard navigation for change blocks (Alt + ArrowUp / ArrowDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && changes.length > 0) {
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          e.preventDefault();
          handleNextChange();
        } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          e.preventDefault();
          handlePrevChange();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changes, currentChangeIndex]);

  if (stats.isIdentical) {
    return (
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/30 p-6 text-center space-y-2 animate-in fade-in duration-200">
        <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="font-extrabold text-base text-emerald-950 dark:text-emerald-200">
          ✓ No Differences Found
        </h3>
        <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-md mx-auto">
          The two versions of your code are 100% identical. No lines were added, removed, or modified.
        </p>
      </div>
    );
  }

  const safeIndex = Math.min(currentChangeIndex, Math.max(0, changes.length - 1));

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-md space-y-4">
      {/* Change Navigator Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab("changes")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "changes"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <ListFilter className="h-3.5 w-3.5" />
            <span>Changes List ({changes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("unified")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "unified"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>Unified Diff</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("stats")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "stats"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <BarChart2 className="h-3.5 w-3.5" />
            <span>Statistics</span>
          </button>
        </div>

        {/* Change Navigator Buttons */}
        {changes.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Change <strong className="text-blue-600 dark:text-blue-400 font-extrabold">{safeIndex + 1}</strong> of {changes.length}
            </span>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePrevChange}
                className="h-8 px-2.5 rounded-lg border-slate-200 dark:border-slate-800 text-xs font-bold gap-1"
                title="Previous Change (Alt + Up)"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Previous</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleNextChange}
                className="h-8 px-2.5 rounded-lg border-slate-200 dark:border-slate-800 text-xs font-bold gap-1"
                title="Next Change (Alt + Down)"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Tab Content: Structured Changes List with Git-Merge Hunk Actions */}
      {activeTab === "changes" && (
        <div className="space-y-2.5 max-h-96 overflow-y-auto">
          {changes.map((block, idx) => {
            const isSelected = idx === safeIndex;
            return (
              <div
                key={block.id}
                onClick={() => onSelectChangeIndex(idx)}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-xl border text-left transition-all gap-3 cursor-pointer ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 shadow-sm ring-1 ring-blue-500/30"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="pt-0.5 shrink-0">
                    {block.type === "added" && <PlusCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                    {block.type === "removed" && <MinusCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />}
                    {block.type === "modified" && <RefreshCw className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span>Change #{block.id}</span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        (Orig L{block.startLineOriginal} ↔ Mod L{block.startLineModified})
                      </span>
                    </div>

                    <div className="font-mono text-[11px] text-slate-600 dark:text-slate-300 truncate max-w-lg">
                      {block.lines[0]?.content || block.lines[0]?.modifiedContent || block.lines[0]?.originalContent}
                    </div>
                  </div>
                </div>

                {/* Git-Merge Hunk Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800 w-full sm:w-auto justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTakeRight(block);
                    }}
                    className="h-7 px-2.5 rounded-lg border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 hover:bg-blue-600 hover:text-white text-[11px] font-extrabold gap-1"
                    title="Copy Right (Modified) version into Left (Original) document"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    <span>← Take Right</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTakeLeft(block);
                    }}
                    className="h-7 px-2.5 rounded-lg border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 hover:bg-blue-600 hover:text-white text-[11px] font-extrabold gap-1"
                    title="Copy Left (Original) version into Right (Modified) document"
                  >
                    <span>Take Left →</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab Content: Unified Diff */}
      {activeTab === "unified" && (
        <div className="font-mono text-xs overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-3 text-slate-200 space-y-0.5 max-h-96 overflow-y-auto select-text">
          {lines.map((line, idx) => {
            const isAdded = line.type === "added";
            const isRemoved = line.type === "removed";
            const isModified = line.type === "modified";

            if (isModified) {
              return (
                <React.Fragment key={idx}>
                  <div className="flex items-center bg-rose-950/40 text-rose-300 px-2 py-0.5 rounded">
                    <span className="w-10 shrink-0 text-slate-600 select-none text-[10px]">
                      {line.originalLineNumber || "-"}
                    </span>
                    <span className="w-4 shrink-0 font-bold text-rose-400">-</span>
                    <span className="flex-1 whitespace-pre">{line.originalContent}</span>
                  </div>
                  <div className="flex items-center bg-emerald-950/40 text-emerald-300 px-2 py-0.5 rounded">
                    <span className="w-10 shrink-0 text-slate-600 select-none text-[10px]">
                      {line.modifiedLineNumber || "-"}
                    </span>
                    <span className="w-4 shrink-0 font-bold text-emerald-400">+</span>
                    <span className="flex-1 whitespace-pre">{line.modifiedContent}</span>
                  </div>
                </React.Fragment>
              );
            }

            return (
              <div
                key={idx}
                className={`flex items-center px-2 py-0.5 rounded ${
                  isAdded
                    ? "bg-emerald-950/40 text-emerald-300"
                    : isRemoved
                    ? "bg-rose-950/40 text-rose-300"
                    : "text-slate-400 hover:bg-slate-900"
                }`}
              >
                <span className="w-10 shrink-0 text-slate-600 select-none text-[10px]">
                  {line.modifiedLineNumber || line.originalLineNumber || "-"}
                </span>
                <span className="w-4 shrink-0 font-bold">
                  {isAdded ? "+" : isRemoved ? "-" : " "}
                </span>
                <span className="flex-1 whitespace-pre">{line.content}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab Content: Detailed Statistics */}
      {activeTab === "stats" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs font-medium">
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Changes</span>
            <div className="text-xl font-black text-slate-900 dark:text-slate-100">{stats.totalChanges}</div>
          </div>
          <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/30 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">+ Added Lines</span>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">{stats.addedLines}</div>
          </div>
          <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/30 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400">− Removed Lines</span>
            <div className="text-xl font-black text-rose-600 dark:text-rose-400">{stats.removedLines}</div>
          </div>
          <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/30 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">~ Modified Lines</span>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400">{stats.modifiedLines}</div>
          </div>
        </div>
      )}
    </div>
  );
}
