"use client";

import React, { useState } from "react";
import { Tool } from "@/types/tools";
import ToolWorkspaceHeader from "./ToolWorkspaceHeader";
import ToolDiagnosticsBar from "./ToolDiagnosticsBar";
import ClientSidePrivacyNotice from "./ClientSidePrivacyNotice";
import LeftToolsPanel from "./LeftToolsPanel";
import RightHelpPanel from "./RightHelpPanel";
import WorkspaceFooter from "./WorkspaceFooter";
import RelatedTools from "@/components/tool/RelatedTools";
import ToolExplanation from "@/components/tool/ToolExplanation";
import FullScreenWorkspace from "./FullScreenWorkspace";

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
  isFullscreen?: boolean;
  onToggleFullscreen?: (val?: boolean) => void;
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
  isFullscreen: controlledIsFullscreen,
  onToggleFullscreen: controlledOnToggleFullscreen,
  children,
}: ToolWorkspaceShellProps) {
  const [isToolsPanelOpen, setIsToolsPanelOpen] = useState(false);
  const [isHelpPanelOpen, setIsHelpPanelOpen] = useState(false);
  const [internalIsFullscreen, setInternalIsFullscreen] = useState(false);

  const isFullscreen = controlledIsFullscreen ?? internalIsFullscreen;
  const setIsFullscreen = (val: boolean) => {
    if (controlledOnToggleFullscreen) {
      controlledOnToggleFullscreen(val);
    } else {
      setInternalIsFullscreen(val);
    }
  };

  if (isFullscreen) {
    return (
      <FullScreenWorkspace
        isOpen={true}
        onClose={() => setIsFullscreen(false)}
        title={tool.name}
        badge="Full Screen Workspace"
      >
        <div className="flex-1 flex flex-col space-y-3 min-h-0 overflow-y-auto w-full h-full pr-1">
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

          <div className="flex-1 flex gap-4 min-h-0 overflow-hidden relative">
            <LeftToolsPanel
              isOpen={isToolsPanelOpen}
              onClose={() => setIsToolsPanelOpen(false)}
              currentSlug={tool.slug}
            />
            <div className="flex-1 min-w-0 h-full overflow-hidden">
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
      </FullScreenWorkspace>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Normal Inline Workspace Container */}
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
