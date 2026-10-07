"use client";

import React from "react";
import Editor from "@monaco-editor/react";
import { LanguageConfig } from "./languages.config";

interface PlaygroundEditorProps {
  languageConfig: LanguageConfig;
  activeTab: "html" | "css" | "js";
  onTabChange: (tab: "html" | "css" | "js") => void;
  codeState: {
    html?: string;
    css?: string;
    js?: string;
    code?: string;
  };
  onCodeChange: (key: "html" | "css" | "js" | "code", val: string) => void;
}

export default function PlaygroundEditor({
  languageConfig,
  activeTab,
  onTabChange,
  codeState,
  onCodeChange,
}: PlaygroundEditorProps) {
  const isMultiTab = languageConfig.supportsMultiTab;

  return (
    <div className="flex flex-col border-r border-b border-border bg-card overflow-hidden h-full">
      {/* Editor Header / Tab Bar */}
      <div className="flex items-center justify-between px-2 bg-muted/40 border-b border-border select-none min-h-[38px]">
        {isMultiTab ? (
          <div className="flex">
            <button
              type="button"
              onClick={() => onTabChange("html")}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "html"
                  ? "border-orange-500 text-foreground bg-background"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              HTML
            </button>

            <button
              type="button"
              onClick={() => onTabChange("css")}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "css"
                  ? "border-blue-500 text-foreground bg-background"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              CSS
            </button>

            <button
              type="button"
              onClick={() => onTabChange("js")}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "js"
                  ? "border-yellow-400 text-foreground bg-background"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              JavaScript
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-2 py-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {languageConfig.name} Source Code
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              .{languageConfig.extension}
            </span>
          </div>
        )}

        <span className="text-[11px] text-muted-foreground font-mono px-2 hidden sm:inline">
          Ctrl + Enter to execute
        </span>
      </div>

      {/* Monaco Code Editor Container */}
      <div className="flex-1 overflow-hidden relative w-full h-full">
        {isMultiTab ? (
          <>
            <div className={`h-full ${activeTab === "html" ? "block" : "hidden"}`}>
              <Editor
                height="100%"
                defaultLanguage="html"
                theme="vs-dark"
                value={codeState.html || ""}
                onChange={(v) => onCodeChange("html", v || "")}
                options={{
                  fontSize: 13,
                  fontFamily: "'Fira Code', monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  lineNumbers: "on",
                  tabSize: 2,
                  scrollbar: {
                    alwaysConsumeMouseWheel: false,
                    vertical: "auto",
                    horizontal: "auto",
                  },
                }}
              />
            </div>

            <div className={`h-full ${activeTab === "css" ? "block" : "hidden"}`}>
              <Editor
                height="100%"
                defaultLanguage="css"
                theme="vs-dark"
                value={codeState.css || ""}
                onChange={(v) => onCodeChange("css", v || "")}
                options={{
                  fontSize: 13,
                  fontFamily: "'Fira Code', monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  lineNumbers: "on",
                  tabSize: 2,
                  scrollbar: {
                    alwaysConsumeMouseWheel: false,
                    vertical: "auto",
                    horizontal: "auto",
                  },
                }}
              />
            </div>

            <div className={`h-full ${activeTab === "js" ? "block" : "hidden"}`}>
              <Editor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={codeState.js || ""}
                onChange={(v) => onCodeChange("js", v || "")}
                options={{
                  fontSize: 13,
                  fontFamily: "'Fira Code', monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  lineNumbers: "on",
                  tabSize: 2,
                  scrollbar: {
                    alwaysConsumeMouseWheel: false,
                    vertical: "auto",
                    horizontal: "auto",
                  },
                }}
              />
            </div>
          </>
        ) : (
          <div className="h-full">
            <Editor
              height="100%"
              language={languageConfig.monacoLanguage}
              theme="vs-dark"
              value={codeState.code || ""}
              onChange={(v) => onCodeChange("code", v || "")}
              options={{
                fontSize: 13,
                fontFamily: "'Fira Code', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: "on",
                lineNumbers: "on",
                tabSize: 2,
                scrollbar: {
                  alwaysConsumeMouseWheel: false,
                  vertical: "auto",
                  horizontal: "auto",
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
