"use client";

import React from "react";
import { Trash2, FileText, Clipboard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ToolInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onLoadSample?: () => void;
  onClear?: () => void;
  onFormat?: () => void;
  readOnly?: boolean;
  minHeight?: string;
  actions?: React.ReactNode;
}

export default function ToolInput({
  label = "Input Data",
  value,
  onChange,
  placeholder = "Paste or type your input here...",
  onLoadSample,
  onClear,
  onFormat,
  readOnly = false,
  minHeight = "min-h-[260px]",
  actions,
}: ToolInputProps) {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(text);
      }
    } catch {
      // Ignore
    }
  };

  const handleClear = () => {
    onChange("");
    if (onClear) onClear();
  };

  return (
    <div className="flex flex-col rounded-xl border bg-card shadow-sm overflow-hidden">
      {/* Input Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-muted/40 border-b">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>

        <div className="flex items-center gap-1.5">
          {actions}

          {onFormat && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onFormat}
              className="h-7 text-xs px-2.5 text-primary hover:text-primary hover:bg-primary/10"
              title="Format Input"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              <span>Format</span>
            </Button>
          )}

          {onLoadSample && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onLoadSample}
              className="h-7 text-xs px-2.5 text-muted-foreground hover:text-foreground"
              title="Load Sample Data"
            >
              <FileText className="w-3.5 h-3.5 mr-1" />
              <span>Sample</span>
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handlePaste}
            className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground"
            title="Paste Clipboard"
          >
            <Clipboard className="w-3.5 h-3.5" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-7 text-xs px-2 text-muted-foreground hover:text-destructive"
            title="Clear Input"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Input Textarea */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full ${minHeight} max-h-[500px] p-4 bg-transparent font-mono text-sm resize-y outline-none leading-relaxed border-none focus:ring-0 text-foreground placeholder:text-muted-foreground/60 editor-scroll-area`}
      />
    </div>
  );
}
