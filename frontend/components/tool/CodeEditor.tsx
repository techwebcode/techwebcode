"use client";

import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2, Copy, Check, Download, X } from "lucide-react";
import { toast } from "sonner";

interface CodeEditorProps {
  title?: string;
  badge?: string;
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  placeholder?: string;
  height?: string;
  minHeight?: string;
  onCopy?: () => void;
  onDownload?: () => void;
}

export default function CodeEditor({
  title,
  badge,
  value,
  onChange,
  language = "json",
  readOnly = false,
  placeholder = "Enter code here...",
  height = "380px",
  onCopy,
  onDownload,
}: CodeEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [copied, setCopied] = useState(false);
  const expandBtnRef = useRef<HTMLButtonElement>(null);

  // Handle Fullscreen Toggle
  const handleOpenFullscreen = () => {
    setIsFullscreen(true);
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
    setTimeout(() => {
      expandBtnRef.current?.focus();
    }, 50);
  };

  // Keyboard accessibility: Escape key closes fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        e.preventDefault();
        handleCloseFullscreen();
      }
    };

    if (isFullscreen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen]);

  // Copy handler
  const handleCopyText = () => {
    if (onCopy) {
      onCopy();
    } else if (value) {
      navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard!");
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col space-y-2 w-full">
      {/* Editor Header */}
      {title && (
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {title}
            </span>
            {badge && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {badge}
              </span>
            )}
          </div>

          <Button
            ref={expandBtnRef}
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleOpenFullscreen}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary gap-1.5"
            title="Expand Editor (Fullscreen)"
            aria-label="Expand editor to full screen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Expand</span>
          </Button>
        </div>
      )}

      {/* Editor Surface */}
      <div
        className={`w-full rounded-xl border bg-[#1e1e1e] overflow-hidden shadow-sm relative transition-all ${
          isFocused ? "border-primary/60 ring-2 ring-primary/20" : "border-border"
        }`}
        style={{ height }}
      >
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={value}
          onChange={(val) => onChange && onChange(val || "")}
          onMount={(editor) => {
            editor.onDidFocusEditorText(() => setIsFocused(true));
            editor.onDidBlurEditorText(() => setIsFocused(false));
          }}
          options={{
            readOnly,
            fontSize: 13,
            fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            lineNumbers: "on",
            tabSize: 2,
            automaticLayout: true,
            renderLineHighlight: "all",
            placeholder,
            padding: { top: 12, bottom: 12 },
          }}
          loading={
            <div className="flex items-center justify-center h-full text-xs text-muted-foreground font-mono bg-muted/20">
              Loading Code Editor...
            </div>
          }
        />
      </div>

      {/* Fullscreen Modal Overlay */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col p-4 sm:p-6 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label={title || "Fullscreen Code Editor"}
        >
          {/* Fullscreen Top Navigation Bar */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-border mb-4">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-base text-foreground">
                {title || "JSON Editor"}
              </h3>
              {badge && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {badge}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyText}
                disabled={!value}
                className="h-8 text-xs gap-1.5 focus-visible:ring-2 focus-visible:ring-primary"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copied ? "Copied" : "Copy"}</span>
              </Button>

              {onDownload && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onDownload}
                  disabled={!value}
                  className="h-8 text-xs gap-1.5 focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </Button>
              )}

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleCloseFullscreen}
                className="h-8 text-xs gap-1.5 font-medium focus-visible:ring-2 focus-visible:ring-primary"
                title="Exit Fullscreen (Esc)"
                aria-label="Exit fullscreen mode"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Exit Fullscreen</span>
              </Button>
            </div>
          </div>

          {/* Fullscreen Monaco Editor Area */}
          <div className="flex-1 w-full rounded-xl border border-border bg-[#1e1e1e] overflow-hidden shadow-2xl relative">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={value}
              onChange={(val) => onChange && onChange(val || "")}
              options={{
                readOnly,
                fontSize: 14,
                fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace",
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                wordWrap: "on",
                lineNumbers: "on",
                tabSize: 2,
                automaticLayout: true,
                renderLineHighlight: "all",
                placeholder,
                padding: { top: 16, bottom: 16 },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
