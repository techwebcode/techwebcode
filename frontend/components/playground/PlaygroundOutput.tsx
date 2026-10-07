"use client";

import React, { useRef } from "react";
import { Terminal, Maximize2, Trash2 } from "lucide-react";
import { LanguageConfig } from "./languages.config";
import { LogItem } from "./PlaygroundExecutionService";
import FullScreenWorkspace from "@/components/tool/workspace/FullScreenWorkspace";

interface PlaygroundOutputProps {
  languageConfig: LanguageConfig;
  srcDoc: string;
  logs: LogItem[];
  rawOutput?: string;
  onClearLogs: () => void;
  isFullscreenPreview: boolean;
  onToggleFullscreenPreview: (open: boolean) => void;
}

export default function PlaygroundOutput({
  languageConfig,
  srcDoc,
  logs,
  rawOutput,
  onClearLogs,
  isFullscreenPreview,
  onToggleFullscreenPreview,
}: PlaygroundOutputProps) {
  const previewFrameRef = useRef<HTMLIFrameElement>(null);
  const isClientLanguage = languageConfig.supportsPreview;

  return (
    <div className="flex flex-col bg-background overflow-hidden h-full relative">
      {/* Client-side Web Live Preview Header & Frame */}
      {isClientLanguage ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-muted/30 border-b border-border select-none min-h-[38px]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Live Preview
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onToggleFullscreenPreview(true)}
                className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer"
                title="Fullscreen Preview Window"
                aria-label="Fullscreen Preview Window"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Fullscreen Preview Portal */}
          <FullScreenWorkspace
            isOpen={isFullscreenPreview}
            onClose={() => onToggleFullscreenPreview(false)}
            title={`${languageConfig.name} Live Viewport Preview`}
            badge="Full Viewport Preview"
          >
            <div className="flex-1 w-full h-full bg-white rounded-xl overflow-hidden relative shadow-2xl min-h-0">
              <iframe
                srcDoc={srcDoc}
                title="Full Viewport Preview"
                className="w-full h-full border-none bg-white"
                sandbox="allow-scripts allow-modals allow-same-origin"
              />
            </div>
          </FullScreenWorkspace>

          {/* Inline Live Preview IFrame */}
          <div className="flex-1 bg-white relative">
            <iframe
              ref={previewFrameRef}
              srcDoc={srcDoc}
              title="Preview"
              className="w-full h-full border-none bg-white"
              sandbox="allow-scripts allow-modals allow-same-origin"
            />
          </div>
        </>
      ) : (
        /* Server Compiler Standard Output View */
        <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 font-mono text-xs overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-slate-400 font-bold select-none">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>{languageConfig.name} Compiler Output Terminal</span>
            </div>
            <button
              type="button"
              onClick={onClearLogs}
              className="p-1 hover:text-white rounded transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
              title="Clear Output Logs"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear Terminal</span>
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono leading-relaxed">
            {rawOutput && (
              <div className="whitespace-pre-wrap font-mono text-slate-200 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                {rawOutput}
              </div>
            )}

            {logs.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                  Execution Logs ({logs.length})
                </div>
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className={`flex items-start gap-2 px-2.5 py-1.5 rounded break-all ${
                      log.type === "error"
                        ? "bg-rose-950/50 text-rose-300 border-l-2 border-rose-500"
                        : log.type === "warn"
                        ? "bg-amber-950/50 text-amber-300 border-l-2 border-amber-500"
                        : log.type === "info"
                        ? "bg-sky-950/50 text-sky-300 border-l-2 border-sky-500"
                        : "text-slate-200 border-l-2 border-slate-600"
                    }`}
                  >
                    <span className="text-[10px] text-slate-500 select-none pt-0.5">
                      {log.timestamp}
                    </span>
                    <span>{log.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Integrated Bottom Terminal Bar for Client Web Languages */}
      {isClientLanguage && (
        <div className="h-44 bg-slate-950 border-t border-border flex flex-col font-mono text-xs">
          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-border/40 text-muted-foreground font-semibold select-none">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Console Log ({logs.length})</span>
            </div>
            <button
              type="button"
              onClick={onClearLogs}
              className="p-1 hover:text-foreground rounded transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
              title="Clear Console Logs"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
            {logs.length === 0 ? (
              <div className="text-slate-600 italic py-2">
                Console logs and runtime errors will appear here...
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className={`flex items-start gap-2 px-2 py-1 rounded leading-relaxed break-all ${
                    log.type === "error"
                      ? "bg-rose-950/40 text-rose-300 border-l-2 border-rose-500"
                      : log.type === "warn"
                      ? "bg-amber-950/40 text-amber-300 border-l-2 border-amber-500"
                      : log.type === "info"
                      ? "bg-sky-950/40 text-sky-300 border-l-2 border-sky-500"
                      : "text-slate-200 border-l-2 border-slate-600"
                  }`}
                >
                  <span className="text-[10px] text-slate-500 select-none pt-0.5">
                    {log.timestamp}
                  </span>
                  <span>{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
