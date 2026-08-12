"use client";

import React from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  placeholder?: string;
  height?: string;
  minHeight?: string;
}

export default function CodeEditor({
  value,
  onChange,
  language = "json",
  readOnly = false,
  placeholder = "Enter code here...",
  height = "340px",
}: CodeEditorProps) {
  return (
    <div
      className="w-full rounded-xl border bg-[#1e1e1e] overflow-hidden shadow-inner relative"
      style={{ height }}
    >
      <Editor
        height="100%"
        language={language}
        theme="vs-dark"
        value={value}
        onChange={(val) => onChange && onChange(val || "")}
        options={{
          readOnly,
          fontSize: 13,
          fontFamily: "'Fira Code', monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          lineNumbers: "on",
          tabSize: 2,
          automaticLayout: true,
          renderLineHighlight: "all",
          placeholder,
        }}
        loading={
          <div className="flex items-center justify-center h-full text-xs text-muted-foreground font-mono bg-muted/20">
            Loading Code Editor...
          </div>
        }
      />
    </div>
  );
}
