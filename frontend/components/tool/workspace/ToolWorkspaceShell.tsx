"use client";

import React, { useState } from "react";
import { Tool } from "@/types/tools";
import ToolWorkspaceHeader from "./ToolWorkspaceHeader";
import ToolDiagnosticsBar from "./ToolDiagnosticsBar";
import ClientSidePrivacyNotice from "./ClientSidePrivacyNotice";
import LeftToolsPanel from "./LeftToolsPanel";
import RightHelpPanel from "./RightHelpPanel";
import WorkspaceFooter from "./WorkspaceFooter";
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
  typeLabel?: string;
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
  typeLabel,
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
            typeLabel={typeLabel}
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
          typeLabel={typeLabel}
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
    </div>
  );
}
