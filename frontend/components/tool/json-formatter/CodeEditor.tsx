"use client";

import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  readOnly?: boolean;
}

export default function CodeEditor({
  value,
  onChange,
  language = "json",
  height = "520px",
  readOnly = false,
}: CodeEditorProps) {
  return (
    <div className="h-full w-full overflow-hidden rounded-xl border bg-card shadow-sm">
      <Editor
        height={height}
        language={language}
        theme="vs-dark"
        value={value}
        onChange={(val) => onChange(val ?? "")}
        options={{
          readOnly,
          automaticLayout: true,
          minimap: {
            enabled: false,
          },
          scrollBeyondLastLine: false,
          fontSize: 14,
          wordWrap: "on",
          tabSize: 2,
          formatOnPaste: true,
          formatOnType: true,
          folding: true,
          lineNumbers: "on",
          renderWhitespace: "selection",
          bracketPairColorization: {
            enabled: true,
          },
          padding: {
            top: 12,
            bottom: 12,
          },
        }}
      />
    </div>
  );
}