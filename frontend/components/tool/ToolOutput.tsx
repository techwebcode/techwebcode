"use client";

import React, { useState } from "react";
import { Copy, Check, Download, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ToolOutputProps {
  label?: string;
  value: string;
  placeholder?: string;
  status?: "idle" | "success" | "error";
  errorMessage?: string;
  minHeight?: string;
  downloadFilename?: string;
  actions?: React.ReactNode;
}

export default function ToolOutput({
  label = "Output Result",
  value,
  placeholder = "Output will appear here...",
  status = "idle",
  errorMessage,
  minHeight = "min-h-[260px]",
  downloadFilename = "output.txt",
  actions,
}: ToolOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Copied output to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!value) return;
    const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadFilename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${downloadFilename}`);
  };

  return (
    <div className="flex flex-col rounded-xl border bg-card shadow-sm overflow-hidden">
      {/* Output Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-muted/40 border-b">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          {status === "success" && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" /> Valid
            </span>
          )}
          {status === "error" && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
              <AlertCircle className="w-3 h-3" /> Error
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {actions}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!value}
            onClick={handleCopy}
            className="h-7 text-xs px-2.5 text-muted-foreground hover:text-foreground"
            title="Copy Output"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 mr-1" />
            )}
            <span>{copied ? "Copied" : "Copy"}</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!value}
            onClick={handleDownload}
            className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground"
            title="Download File"
          >
            <Download className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {status === "error" && errorMessage && (
        <div className="bg-rose-500/10 text-rose-500 text-xs font-mono p-3 border-b border-rose-500/20 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="break-all">{errorMessage}</span>
        </div>
      )}

      {/* Output Display */}
      <textarea
        readOnly
        value={value}
        placeholder={placeholder}
        className={`w-full ${minHeight} p-4 bg-muted/20 font-mono text-sm resize-y outline-none leading-relaxed border-none focus:ring-0 text-foreground placeholder:text-muted-foreground/60`}
      />
    </div>
  );
}
