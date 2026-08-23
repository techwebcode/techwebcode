"use client";

import React, { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Maximize2, Copy, Check, Download } from "lucide-react";
import { toast } from "sonner";
import EditorWorkspace from "./workspace/EditorWorkspace";

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
  onEditorMount?: (editor: any) => void;
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
  onEditorMount,
}: CodeEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [copied, setCopied] = useState(false);
  const expandBtnRef = useRef<HTMLButtonElement>(null);
  const editorRef = useRef<any>(null);

  // Handle Expanded Workspace Toggle
  const handleOpenExpanded = () => {
    setIsExpanded(true);
  };

  const handleCloseExpanded = () => {
    setIsExpanded(false);
    setTimeout(() => {
      expandBtnRef.current?.focus();
    }, 50);
  };

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

  // Render Expanded Workspace view ONLY when isExpanded is true
  if (isExpanded) {
    return (
      <div className="flex flex-col space-y-2 w-full">
        {/* Inline Editor Placeholder while expanded */}
        <div className="w-full rounded-xl border border-dashed border-border/80 bg-muted/20 p-4 text-center text-xs text-muted-foreground font-mono flex items-center justify-center gap-2" style={{ height }}>
          <span>Editor expanded into viewport workspace.</span>
          <Button type="button" variant="ghost" size="sm" onClick={handleCloseExpanded} className="h-6 text-xs text-primary underline">
            Restore Inline View
          </Button>
        </div>

        <EditorWorkspace
          isOpen={true}
          onClose={handleCloseExpanded}
          title={title || "Code Editor"}
          badge={badge || "Expand Workspace"}
          actions={
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyText}
                disabled={!value}
                className="h-8 text-xs gap-1.5 border-slate-700 text-slate-200 hover:bg-slate-800"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
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
                  className="h-8 text-xs gap-1.5 border-slate-700 text-slate-200 hover:bg-slate-800"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </Button>
              )}
            </div>
          }
        >
          <div className="flex-1 w-full h-full rounded-xl border border-slate-800 bg-[#1e1e1e] overflow-hidden shadow-2xl relative min-h-0">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={value}
              onChange={(val) => onChange && onChange(val || "")}
              onMount={(editor) => {
                editorRef.current = editor;
                if (onEditorMount) onEditorMount(editor);
              }}
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
                scrollbar: {
                  alwaysConsumeMouseWheel: false,
                  vertical: "auto",
                  horizontal: "auto",
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10,
                },
              }}
            />
          </div>
        </EditorWorkspace>
      </div>
    );
  }

  // Normal inline editor return when NOT expanded
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
            onClick={handleOpenExpanded}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary gap-1.5"
            title="Expand Editor Workspace"
            aria-label="Expand editor to full workspace"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Expand Workspace</span>
          </Button>
        </div>
      )}

      {/* Inline Editor Surface */}
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
            editorRef.current = editor;
            editor.onDidFocusEditorText(() => setIsFocused(true));
            editor.onDidBlurEditorText(() => setIsFocused(false));
            if (onEditorMount) onEditorMount(editor);
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
            scrollbar: {
              alwaysConsumeMouseWheel: false,
              vertical: "auto",
              horizontal: "auto",
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
          }}
          loading={
            <div className="flex items-center justify-center h-full text-xs text-muted-foreground font-mono bg-muted/20">
              Loading Code Editor...
            </div>
          }
        />
      </div>
    </div>
  );
}
