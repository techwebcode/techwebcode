"use client";

import React from "react";
import CodeEditor from "@/components/tool/CodeEditor";
import { ArrowLeftRight, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { K8sOperationMode } from "./K8sSecretModeControls";

interface K8sSecretWorkspaceEditorsProps {
  originalYaml: string;
  processedYaml: string;
  onOriginalChange: (val: string) => void;
  onSwap: () => void;
  onCopyOriginal: () => void;
  onCopyProcessed: () => void;
  isMasked?: boolean;
  mode: K8sOperationMode;
  transformedCount: number;
  height?: string;
}

function maskYamlSecretValues(yamlStr: string): string {
  if (!yamlStr) return yamlStr;
  return yamlStr.replace(/^(\s*[A-Za-z0-9_-]+:\s*)(.+)$/gm, (match, prefix, val) => {
    if (
      prefix.includes("kind:") ||
      prefix.includes("apiVersion:") ||
      prefix.includes("type:") ||
      prefix.includes("name:") ||
      prefix.includes("namespace:") ||
      prefix.includes("labels:") ||
      prefix.includes("annotations:")
    ) {
      return match;
    }
    return `${prefix}••••••••`;
  });
}

export default function K8sSecretWorkspaceEditors({
  originalYaml,
  processedYaml,
  onOriginalChange,
  onSwap,
  onCopyOriginal,
  onCopyProcessed,
  isMasked = false,
  mode,
  transformedCount,
  height = "540px",
}: K8sSecretWorkspaceEditorsProps) {
  const displayProcessed = isMasked ? maskYamlSecretValues(processedYaml) : processedYaml;
  const displayOriginal = isMasked ? maskYamlSecretValues(originalYaml) : originalYaml;

  const modeTitle = mode === "decode" ? "Decode" : mode === "encode" ? "Encode" : "Format";

  return (
    <div className="relative grid gap-4 lg:grid-cols-2 w-full min-w-0">
      {/* Swap Button in Center (Desktop) */}
      <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onSwap}
          className="h-9 w-9 p-0 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-lg hover:bg-blue-600 hover:text-white transition-all"
          title="Swap Original and Processed Manifest"
          aria-label="Swap original and processed manifest"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Left Editor: Original Secret Manifest */}
      <div className="flex flex-col space-y-1.5 min-w-0">
        <div className="flex items-center justify-between px-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-slate-900 dark:text-slate-100">ORIGINAL SECRET MANIFEST</span>
          </div>
        </div>
        <CodeEditor
          language="yaml"
          value={displayOriginal}
          onChange={(val) => {
            if (!isMasked) onOriginalChange(val);
          }}
          readOnly={isMasked}
          height={height}
          placeholder="Paste or upload your Kubernetes Secret YAML manifest here..."
          onCopy={onCopyOriginal}
        />
      </div>

      {/* Right Editor: Processed Result Manifest */}
      <div className="flex flex-col space-y-1.5 min-w-0">
        <div className="flex items-center justify-between px-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold text-slate-900 dark:text-slate-100">PROCESSED RESULT MANIFEST</span>
          </div>
          <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
            {modeTitle} · {transformedCount} {transformedCount === 1 ? "value" : "values"} transformed
          </span>
        </div>
        <CodeEditor
          language="yaml"
          value={displayProcessed}
          onChange={() => {}}
          readOnly
          height={height}
          placeholder="Processed Secret manifest will appear here..."
          onCopy={onCopyProcessed}
        />
      </div>
    </div>
  );
}
