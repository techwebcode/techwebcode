"use client";

import React, { useRef, useEffect } from "react";
import CodeEditor from "@/components/tool/CodeEditor";
import { ArrowLeftRight, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ViewMode } from "./CodeDiffControls";
import { DiffResult, ChangeBlock } from "./diff.utils";

interface CodeDiffWorkspaceEditorsProps {
  original: string;
  modified: string;
  onOriginalChange: (val: string) => void;
  onModifiedChange: (val: string) => void;
  language: string;
  viewMode: ViewMode;
  diffResult: DiffResult;
  onSwap: () => void;
  onCopyOriginal: () => void;
  onCopyModified: () => void;
  activeHunk?: ChangeBlock | null;
  height?: string;
  origEditorRef?: React.MutableRefObject<any>;
  modEditorRef?: React.MutableRefObject<any>;
}

export default function CodeDiffWorkspaceEditors({
  original,
  modified,
  onOriginalChange,
  onModifiedChange,
  language = "javascript",
  viewMode,
  diffResult,
  onSwap,
  onCopyOriginal,
  onCopyModified,
  activeHunk,
  height = "520px",
  origEditorRef,
  modEditorRef,
}: CodeDiffWorkspaceEditorsProps) {
  const localOrigRef = useRef<any>(null);
  const localModRef = useRef<any>(null);

  const setOrigRef = (editor: any) => {
    localOrigRef.current = editor;
    if (origEditorRef) origEditorRef.current = editor;
  };

  const setModRef = (editor: any) => {
    localModRef.current = editor;
    if (modEditorRef) modEditorRef.current = editor;
  };

  // Scroll and highlight editors whenever activeHunk changes
  useEffect(() => {
    if (!activeHunk) return;

    if (localOrigRef.current && activeHunk.startLineOriginal) {
      localOrigRef.current.revealLineInCenter(activeHunk.startLineOriginal);
      localOrigRef.current.setSelection({
        startLineNumber: activeHunk.startLineOriginal,
        startColumn: 1,
        endLineNumber: activeHunk.endLineOriginal || activeHunk.startLineOriginal,
        endColumn: 100,
      });
    }

    if (localModRef.current && activeHunk.startLineModified) {
      localModRef.current.revealLineInCenter(activeHunk.startLineModified);
      localModRef.current.setSelection({
        startLineNumber: activeHunk.startLineModified,
        startColumn: 1,
        endLineNumber: activeHunk.endLineModified || activeHunk.startLineModified,
        endColumn: 100,
      });
    }
  }, [activeHunk]);

  const isUnified = viewMode === "unified";

  if (isUnified) {
    const unifiedText = diffResult.lines
      .map((l) => {
        if (l.type === "added") return `+ ${l.content}`;
        if (l.type === "removed") return `- ${l.content}`;
        if (l.type === "modified") return `- ${l.originalContent}\n+ ${l.modifiedContent}`;
        return `  ${l.content}`;
      })
      .join("\n");

    return (
      <div className="flex flex-col space-y-1.5 w-full min-w-0">
        <div className="flex items-center justify-between px-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <FileCode className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>UNIFIED DIFF VIEW</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
              Combined Stream
            </span>
          </div>
        </div>
        <CodeEditor
          language={language}
          value={unifiedText}
          onChange={() => {}}
          readOnly
          height={height}
          placeholder="Unified difference will appear here..."
          onEditorMount={setOrigRef}
        />
      </div>
    );
  }

  return (
    <div className="relative grid gap-4 lg:grid-cols-2 w-full min-w-0">
      {/* Swap Direction Button in Middle (Desktop) */}
      <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onSwap}
          className="h-9 w-9 p-0 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-lg hover:bg-blue-600 hover:text-white transition-all"
          title="Swap Original and Modified Code"
          aria-label="Swap original and modified code"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Left Original Code Editor */}
      <div className="flex flex-col space-y-1.5 min-w-0">
        <div className="flex items-center justify-between px-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-slate-100">ORIGINAL CODE</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
              Base Version
            </span>
          </div>
        </div>
        <CodeEditor
          language={language}
          value={original}
          onChange={onOriginalChange}
          height={height}
          placeholder="Paste or type original version of your code here..."
          onCopy={onCopyOriginal}
          onEditorMount={setOrigRef}
        />
      </div>

      {/* Right Modified Code Editor */}
      <div className="flex flex-col space-y-1.5 min-w-0">
        <div className="flex items-center justify-between px-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-slate-100">MODIFIED / NEW CODE</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              New Version
            </span>
          </div>
        </div>
        <CodeEditor
          language={language}
          value={modified}
          onChange={onModifiedChange}
          height={height}
          placeholder="Paste or type modified version of your code here..."
          onCopy={onCopyModified}
          onEditorMount={setModRef}
        />
      </div>
    </div>
  );
}
