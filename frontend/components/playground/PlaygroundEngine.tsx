"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LanguageConfig } from "./languages.config";
import {
  PlaygroundExecutionService,
  LogItem,
} from "./PlaygroundExecutionService";
import PlaygroundToolbar from "./PlaygroundToolbar";
import PlaygroundEditor from "./PlaygroundEditor";
import PlaygroundOutput from "./PlaygroundOutput";
import FullScreenWorkspace from "@/components/tool/workspace/FullScreenWorkspace";

interface PlaygroundEngineProps {
  languageConfig: LanguageConfig;
}

export default function PlaygroundEngine({
  languageConfig,
}: PlaygroundEngineProps) {
  const router = useRouter();

  // Local Editor State per language
  const [codeState, setCodeState] = useState<{
    html?: string;
    css?: string;
    js?: string;
    code?: string;
  }>({});

  const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html");
  const [layoutMode, setLayoutMode] = useState<"columns" | "rows">("columns");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState<boolean>(false);

  // Execution Output State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [srcDoc, setSrcDoc] = useState<string>("");
  const [rawOutput, setRawOutput] = useState<string>("");

  // Storage key generator
  const getStorageKey = useCallback(
    (slug: string) => `techwebcode_playground_code_${slug}`,
    []
  );

  // Load code from LocalStorage or default templates when language changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(getStorageKey(languageConfig.slug));
      if (saved) {
        const parsed = JSON.parse(saved);
        setCodeState(parsed);
      } else {
        setCodeState(languageConfig.defaultCode);
      }
    } catch {
      setCodeState(languageConfig.defaultCode);
    }
  }, [languageConfig, getStorageKey]);

  // Persist code changes to LocalStorage
  const handleCodeChange = (
    key: "html" | "css" | "js" | "code",
    value: string
  ) => {
    setCodeState((prev) => {
      const updated = { ...prev, [key]: value };
      try {
        localStorage.setItem(
          getStorageKey(languageConfig.slug),
          JSON.stringify(updated)
        );
      } catch {
        // Fallback
      }
      return updated;
    });
  };

  // Run Code Execution
  const handleRun = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);

    try {
      const res = await PlaygroundExecutionService.executeCode(
        languageConfig,
        codeState,
        (statusLog) => {
          setLogs((prev) => [...prev.slice(-99), statusLog]);
        }
      );

      if (res.srcDoc) {
        setSrcDoc(res.srcDoc);
      }
      if (res.rawOutput !== undefined) {
        setRawOutput(res.rawOutput);
      }
      if (res.logs && res.logs.length > 0) {
        setLogs((prev) => [...prev.slice(-99), ...res.logs]);
      }
    } catch (err: any) {
      toast.error(`Execution error: ${err?.message || "Unknown error"}`);
    } finally {
      setIsRunning(false);
    }
  }, [languageConfig, codeState, isRunning]);

  // Intercept IFrame PostMessage logs for web languages
  useEffect(() => {
    if (!languageConfig.supportsPreview) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.source === "techwebcode-console") {
        const newLog: LogItem = {
          id: Math.random().toString(36).substring(2, 9),
          type: event.data.type || "log",
          message: event.data.args.join(" "),
          timestamp: new Date().toLocaleTimeString(),
        };
        setLogs((prev) => [...prev.slice(-99), newLog]);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [languageConfig]);

  // Execute initially when code loads
  useEffect(() => {
    handleRun();
  }, [handleRun]);

  // Language Switcher Handler
  const handleSelectLanguage = (newSlug: string) => {
    if (newSlug === languageConfig.slug) return;
    router.push(`/playground/${newSlug}`, { scroll: false });
    toast.info(`Switched to ${newSlug.toUpperCase()} Playground`);
  };

  // Reset Handler
  const handleReset = () => {
    setCodeState(languageConfig.defaultCode);
    setLogs([]);
    setRawOutput("");
    try {
      localStorage.removeItem(getStorageKey(languageConfig.slug));
    } catch {
      // Fallback
    }
    toast.info(`Reset ${languageConfig.name} code to template`);
  };

  // Copy Handler
  const handleCopy = () => {
    let fullText = "";
    if (languageConfig.supportsMultiTab) {
      fullText = `<!-- HTML -->\n${codeState.html || ""}\n\n/* CSS */\n${
        codeState.css || ""
      }\n\n// JavaScript\n${codeState.js || ""}`;
    } else {
      fullText = codeState.code || "";
    }

    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Export / Download Handler
  const handleExport = () => {
    let content = "";
    let fileName = `playground-code.${languageConfig.extension}`;

    if (languageConfig.supportsMultiTab) {
      content = `<!DOCTYPE html>\n<html>\n<head>\n<style>\n${
        codeState.css || ""
      }\n</style>\n</head>\n<body>\n${codeState.html || ""}\n<script>\n${
        codeState.js || ""
      }\n</script>\n</body>\n</html>`;
      fileName = "techwebcode-playground.html";
    } else {
      content = codeState.code || "";
    }

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${fileName}`);
  };

  // Keyboard Shortcuts (Ctrl + Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
        toast.info("Executed code");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRun]);

  const mainEngineContent = (
    <div className="flex flex-col h-full bg-background text-foreground overflow-hidden">
      {/* 1. Top Action Toolbar */}
      <PlaygroundToolbar
        currentLanguage={languageConfig}
        onSelectLanguage={handleSelectLanguage}
        onRun={handleRun}
        isRunning={isRunning}
        onReset={handleReset}
        onCopy={handleCopy}
        isCopied={isCopied}
        onExport={handleExport}
        layoutMode={layoutMode}
        onToggleLayout={() =>
          setLayoutMode(layoutMode === "columns" ? "rows" : "columns")
        }
        onToggleFullscreen={() => setIsFullscreen(true)}
      />

      {/* 2. Main Grid Container */}
      <div
        className={`flex-1 grid overflow-hidden ${
          layoutMode === "columns"
            ? "grid-cols-1 lg:grid-cols-2"
            : "grid-rows-2"
        }`}
      >
        {/* Left / Top: Code Editor */}
        <PlaygroundEditor
          languageConfig={languageConfig}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          codeState={codeState}
          onCodeChange={handleCodeChange}
        />

        {/* Right / Bottom: Output & Preview Pane */}
        <PlaygroundOutput
          languageConfig={languageConfig}
          srcDoc={srcDoc}
          logs={logs}
          rawOutput={rawOutput}
          onClearLogs={() => {
            setLogs([]);
            setRawOutput("");
          }}
          isFullscreenPreview={isFullscreenPreview}
          onToggleFullscreenPreview={setIsFullscreenPreview}
        />
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <FullScreenWorkspace
        isOpen={true}
        onClose={() => setIsFullscreen(false)}
        title={`${languageConfig.name} Online Playground`}
        badge="Full Screen Workspace"
      >
        <div className="flex-1 w-full h-full min-h-0 overflow-hidden">
          {mainEngineContent}
        </div>
      </FullScreenWorkspace>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-4rem)] border border-border rounded-xl shadow-xl overflow-hidden bg-card">
      {mainEngineContent}
    </div>
  );
}
