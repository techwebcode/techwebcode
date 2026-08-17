"use client";

import React from "react";
import CodeEditor from "@/components/tool/CodeEditor";
import { ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorOutputWorkspaceProps {
  input: string;
  output: string;
  onInputChange: (val: string) => void;
  language?: string;
  inputTitle?: string;
  outputTitle?: string;
  inputBadge?: string;
  outputBadge?: string;
  height?: string;
  onSwap?: () => void;
  onCopyOutput?: () => void;
  onDownloadOutput?: () => void;
}

export default function EditorOutputWorkspace({
  input,
  output,
  onInputChange,
  language = "json",
  inputTitle = "RAW / UNFORMATTED JSON",
  outputTitle = "FORMATTED JSON RESULT",
  inputBadge = "Input",
  outputBadge = "Output",
  height = "520px",
  onSwap,
  onCopyOutput,
  onDownloadOutput,
}: EditorOutputWorkspaceProps) {
  return (
    <div className="relative grid gap-4 lg:grid-cols-2 w-full min-w-0">
      {/* Swap Direction Button in Middle (Desktop) */}
      {onSwap && (
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSwap}
            className="h-9 w-9 p-0 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-lg hover:bg-blue-600 hover:text-white transition-all"
            title="Swap Input & Output"
            aria-label="Swap input and output"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Left Input Editor */}
      <div className="flex flex-col space-y-1.5 min-w-0">
        <div className="flex items-center justify-between px-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>{inputTitle}</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {inputBadge}
            </span>
          </div>
        </div>
        <CodeEditor
          language={language}
          value={input}
          onChange={onInputChange}
          height={height}
          placeholder="Paste or type raw unformatted payload here..."
        />
      </div>

      {/* Right Output Editor */}
      <div className="flex flex-col space-y-1.5 min-w-0">
        <div className="flex items-center justify-between px-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>{outputTitle}</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
              {outputBadge}
            </span>
          </div>
        </div>
        <CodeEditor
          language={language}
          value={output}
          onChange={() => {}}
          readOnly
          height={height}
          placeholder="Formatted output result will appear here..."
          onCopy={onCopyOutput}
          onDownload={onDownloadOutput}
        />
      </div>
    </div>
  );
}
