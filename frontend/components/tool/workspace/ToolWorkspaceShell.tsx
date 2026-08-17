"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Tool } from "@/types/tools";
import ToolWorkspaceHeader from "./ToolWorkspaceHeader";
import ToolDiagnosticsBar from "./ToolDiagnosticsBar";
import ClientSidePrivacyNotice from "./ClientSidePrivacyNotice";
import LeftToolsPanel from "./LeftToolsPanel";
import RightHelpPanel from "./RightHelpPanel";
import WorkspaceFooter from "./WorkspaceFooter";
import RelatedTools from "@/components/tool/RelatedTools";
import ToolExplanation from "@/components/tool/ToolExplanation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ToolWorkspaceShellProps {
  tool: Tool;
  valid: boolean;
  error?: string;
  input: string;
  output: string;
  indent: string;
  onIndentChange: (val: string) => void;
  onFormat: () => void;
  onMinify: () => void;
  onValidate: () => void;
  onLoadSample: () => void;
  onFileUpload: (content: string) => void;
  onCopy: () => void;
  onDownload: () => void;
  onJumpToError?: () => void;
  isClientSideOnly?: boolean;
  children: React.ReactNode;
}

export default function ToolWorkspaceShell({
  tool,
  valid,
  error,
  input,
  output,
  indent,
  onIndentChange,
  onFormat,
  onMinify,
  onValidate,
  onLoadSample,
  onFileUpload,
  onCopy,
  onDownload,
  onJumpToError,
  isClientSideOnly = true,
  children,
}: ToolWorkspaceShellProps) {
  const [isToolsPanelOpen, setIsToolsPanelOpen] = useState(false);
  const [isHelpPanelOpen, setIsHelpPanelOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Escape key exits Fullscreen & prevents body scrolling in Fullscreen mode
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    }
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen]);

  // Fullscreen Overlay Portal
  const fullscreenOverlay = isFullscreen && mounted ? createPortal(
    <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-[999999] w-screen h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 flex flex-col space-y-3 overflow-hidden text-slate-900 dark:text-slate-100 shadow-2xl">
      {/* Fullscreen Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-slate-100">
            {tool.name}
          </span>
          <span className="rounded-full bg-blue-600/10 px-3 py-0.5 text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-600/20">
            IDE Workspace Mode
          </span>
        </div>

        <div className="flex items-center gap-3">
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-500">
            ESC to exit
          </kbd>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(false)}
            className="rounded-xl gap-1.5 text-xs font-bold border-rose-200 dark:border-rose-900/60 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
          >
            <X className="h-4 w-4" />
            <span>Exit Fullscreen</span>
          </Button>
        </div>
      </div>

      {/* Fullscreen Workspace Shell */}
      <div className="flex-1 flex flex-col space-y-3 min-h-0 overflow-hidden">
        <ToolWorkspaceHeader
          title={tool.name}
          isToolsPanelOpen={isToolsPanelOpen}
          onToggleToolsPanel={() => setIsToolsPanelOpen(!isToolsPanelOpen)}
          isHelpPanelOpen={isHelpPanelOpen}
          onToggleHelpPanel={() => setIsHelpPanelOpen(!isHelpPanelOpen)}
          isFullscreen={true}
          onToggleFullscreen={() => setIsFullscreen(false)}
          onFormat={onFormat}
          onMinify={onMinify}
          onValidate={onValidate}
          indent={indent}
          onIndentChange={onIndentChange}
          onLoadSample={onLoadSample}
          onFileUpload={onFileUpload}
          onCopy={onCopy}
          onDownload={onDownload}
        />

        <ToolDiagnosticsBar
          valid={valid}
          error={error}
          value={input}
          onJumpToError={onJumpToError}
        />

        {isClientSideOnly && <ClientSidePrivacyNotice />}

        <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
          <LeftToolsPanel
            isOpen={isToolsPanelOpen}
            onClose={() => setIsToolsPanelOpen(false)}
            currentSlug={tool.slug}
          />
          <div className="flex-1 min-w-0 h-full">
            {children}
          </div>
          <RightHelpPanel
            isOpen={isHelpPanelOpen}
            onClose={() => setIsHelpPanelOpen(false)}
            toolSlug={tool.slug}
          />
        </div>

        <WorkspaceFooter value={output || input} isClientSideOnly={isClientSideOnly} />
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div className="space-y-6 w-full">
      {fullscreenOverlay}

      {/* Normal Workspace Container */}
      <div className="space-y-4 w-full">
        {/* 1. Header Toolbar */}
        <ToolWorkspaceHeader
          title={tool.name}
          isToolsPanelOpen={isToolsPanelOpen}
          onToggleToolsPanel={() => setIsToolsPanelOpen(!isToolsPanelOpen)}
          isHelpPanelOpen={isHelpPanelOpen}
          onToggleHelpPanel={() => setIsHelpPanelOpen(!isHelpPanelOpen)}
          isFullscreen={false}
          onToggleFullscreen={() => setIsFullscreen(true)}
          onFormat={onFormat}
          onMinify={onMinify}
          onValidate={onValidate}
          indent={indent}
          onIndentChange={onIndentChange}
          onLoadSample={onLoadSample}
          onFileUpload={onFileUpload}
          onCopy={onCopy}
          onDownload={onDownload}
        />

        {/* 2. Status & Diagnostics Bar */}
        <ToolDiagnosticsBar
          valid={valid}
          error={error}
          value={input}
          onJumpToError={onJumpToError}
        />

        {/* 3. Prominent 100% Client-Side Privacy Strip */}
        {isClientSideOnly && <ClientSidePrivacyNotice />}

        {/* 4. Main Workspace Area with Collapsible Side Panels */}
        <div className="flex gap-4 min-h-[540px] relative">
          <LeftToolsPanel
            isOpen={isToolsPanelOpen}
            onClose={() => setIsToolsPanelOpen(false)}
            currentSlug={tool.slug}
          />

          <div className="flex-1 min-w-0">
            {children}
          </div>

          <RightHelpPanel
            isOpen={isHelpPanelOpen}
            onClose={() => setIsHelpPanelOpen(false)}
            toolSlug={tool.slug}
          />
        </div>

        {/* 5. Workspace Footer */}
        <WorkspaceFooter value={output || input} isClientSideOnly={isClientSideOnly} />
      </div>

      {/* 6. Related Tools & SEO Explanation */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-8">
        <RelatedTools currentSlug={tool.slug} />
        <ToolExplanation
          title={tool.name}
          description={tool.description || tool.shortDescription || "Practical developer tool."}
          howToUse={[
            "Paste or upload your raw payload into the input editor.",
            "Click Format, Minify, or Validate to process your data.",
            "View line-by-line syntax diagnostics if any errors occur.",
            "Copy or download the formatted result with 1-click.",
          ]}
          features={[
            "100% Client-Side Processing: Your data never leaves your browser.",
            "Line-by-line syntax validation and diagnostic error jumping.",
            "Monaco Code Editor with syntax highlighting and line numbers.",
            "One-click Copy, Sample JSON loading, and File Upload / Download.",
          ]}
          faqs={[
            {
              question: `Is ${tool.name} free to use?`,
              answer: `Yes! ${tool.name} is 100% free with no login or account required.`,
            },
            {
              question: "Is my data safe and private?",
              answer: "Absolutely. All processing happens locally in your web browser using client-side JavaScript. No data is sent to our servers.",
            },
          ]}
        />
      </div>
    </div>
  );
}
