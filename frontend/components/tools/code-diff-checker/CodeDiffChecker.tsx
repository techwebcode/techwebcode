"use client";

import React, { useState, useMemo, useRef } from "react";
import { Tool } from "@/types/tools";
import ToolWorkspaceShell from "@/components/tool/workspace/ToolWorkspaceShell";
import CodeDiffToolbar from "./CodeDiffToolbar";
import CodeDiffControls, { ViewMode } from "./CodeDiffControls";
import CodeDiffWorkspaceEditors from "./CodeDiffWorkspaceEditors";
import DiffResultPanel from "./DiffResultPanel";
import DiffSummaryPanel from "./DiffSummaryPanel";
import {
  DiffOptions,
  SAMPLE_ORIGINAL_CODE,
  SAMPLE_MODIFIED_CODE,
  detectLanguage,
  computeDiff,
  applyHunkTransfer,
  swapFullFiles,
  takeAllHunks,
  ChangeBlock,
} from "./diff.utils";
import { toast } from "sonner";

interface CodeDiffCheckerProps {
  tool: Tool;
}

export default function CodeDiffChecker({ tool }: CodeDiffCheckerProps) {
  const [original, setOriginal] = useState<string>(SAMPLE_ORIGINAL_CODE);
  const [modified, setModified] = useState<string>(SAMPLE_MODIFIED_CODE);
  const [viewMode, setViewMode] = useState<ViewMode>("side-by-side");
  const [currentChangeIndex, setCurrentChangeIndex] = useState<number>(0);

  const [options, setOptions] = useState<DiffOptions>({
    ignoreWhitespace: false,
    ignoreCase: false,
    ignoreComments: false,
    ignoreBlankLines: false,
    wordDiff: false,
    language: "auto",
  });

  const origEditorRef = useRef<any>(null);
  const modEditorRef = useRef<any>(null);

  // Automatically detect language if set to "auto"
  const activeLanguage = useMemo(() => {
    if (options.language !== "auto") return options.language;
    return detectLanguage(original || modified);
  }, [options.language, original, modified]);

  // Compute live pure client-side diff
  const diffResult = useMemo(() => {
    return computeDiff(original, modified, options);
  }, [original, modified, options]);

  const activeHunk = useMemo(() => {
    if (diffResult.changes.length === 0) return null;
    const safeIdx = Math.min(currentChangeIndex, diffResult.changes.length - 1);
    return diffResult.changes[safeIdx] || null;
  }, [diffResult.changes, currentChangeIndex]);

  // Hunk Transfer Handlers
  const handleTakeRight = (block: ChangeBlock) => {
    const { newOriginal } = applyHunkTransfer(original, modified, block, "takeRight");
    setOriginal(newOriginal);
    toast.success(`✓ Change #${block.id} applied from Modified → Original`);
  };

  const handleTakeLeft = (block: ChangeBlock) => {
    const { newModified } = applyHunkTransfer(original, modified, block, "takeLeft");
    setModified(newModified);
    toast.success(`✓ Change #${block.id} applied from Original → Modified`);
  };

  const handleSwap = () => {
    const { newOriginal, newModified } = swapFullFiles(original, modified);
    setOriginal(newOriginal);
    setModified(newModified);
    toast.success("✓ Files swapped successfully");
  };

  const handleTakeAllRight = () => {
    if (window.confirm("Are you sure you want to replace the Original document with the Modified document?")) {
      const { newOriginal } = takeAllHunks(original, modified, "takeRight");
      setOriginal(newOriginal);
      toast.success("✓ All changes merged into Original document");
    }
  };

  const handleTakeAllLeft = () => {
    if (window.confirm("Are you sure you want to replace the Modified document with the Original document?")) {
      const { newModified } = takeAllHunks(original, modified, "takeLeft");
      setModified(newModified);
      toast.success("✓ All changes merged into Modified document");
    }
  };

  const handleCompare = () => {
    toast.info("Diff updated");
  };

  const handleNew = () => {
    setOriginal("");
    setModified("");
    setCurrentChangeIndex(0);
  };

  const handleLoadSample = () => {
    setOriginal(SAMPLE_ORIGINAL_CODE);
    setModified(SAMPLE_MODIFIED_CODE);
    setCurrentChangeIndex(0);
  };

  const handleClear = () => {
    setOriginal("");
    setModified("");
    setCurrentChangeIndex(0);
  };

  const handleCopyOriginal = () => {
    navigator.clipboard.writeText(original);
    toast.success("Original code copied!");
  };

  const handleCopyModified = () => {
    navigator.clipboard.writeText(modified);
    toast.success("Modified code copied!");
  };

  const handleCopyDiff = () => {
    const gitDiffText = diffResult.lines
      .map((l) => {
        if (l.type === "added") return `+ ${l.content}`;
        if (l.type === "removed") return `- ${l.content}`;
        if (l.type === "modified") return `- ${l.originalContent}\n+ ${l.modifiedContent}`;
        return `  ${l.content}`;
      })
      .join("\n");

    navigator.clipboard.writeText(gitDiffText);
    toast.success("Unified diff copied!");
  };

  const handleDownloadDiff = () => {
    const gitDiffText = diffResult.lines
      .map((l) => {
        if (l.type === "added") return `+ ${l.content}`;
        if (l.type === "removed") return `- ${l.content}`;
        if (l.type === "modified") return `- ${l.originalContent}\n+ ${l.modifiedContent}`;
        return `  ${l.content}`;
      })
      .join("\n");

    const blob = new Blob([gitDiffText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code-diff-${new Date().toISOString().slice(0, 10)}.diff`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportOriginal = () => {
    const blob = new Blob([original], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `original-code.${activeLanguage}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportModified = () => {
    const blob = new Blob([modified], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `modified-code.${activeLanguage}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJsonSummary = () => {
    const summaryObj = {
      language: activeLanguage,
      stats: diffResult.stats,
      changes: diffResult.changes,
    };
    const blob = new Blob([JSON.stringify(summaryObj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `diff-summary-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolWorkspaceShell
      tool={tool}
      valid={!diffResult.stats.isIdentical || (original === "" && modified === "")}
      input={original}
      output={modified}
      indent="2"
      onIndentChange={() => {}}
      onFormat={handleCompare}
      onMinify={() => {}}
      onValidate={handleCompare}
      onLoadSample={handleLoadSample}
      onFileUpload={(content) => setOriginal(content)}
      onCopy={handleCopyDiff}
      onDownload={handleDownloadDiff}
      isClientSideOnly={true}
    >
      <div className="space-y-4 w-full min-w-0">
        {/* 1. Workspace Toolbar */}
        <CodeDiffToolbar
          onCompare={handleCompare}
          onNew={handleNew}
          onLoadSample={handleLoadSample}
          onUploadOriginal={(content) => setOriginal(content)}
          onUploadModified={(content) => setModified(content)}
          onSwap={handleSwap}
          onTakeAllRight={handleTakeAllRight}
          onTakeAllLeft={handleTakeAllLeft}
          onClear={handleClear}
          onExportDiff={handleCopyDiff}
          onExportOriginal={handleExportOriginal}
          onExportModified={handleExportModified}
          onExportJsonSummary={handleExportJsonSummary}
          onToggleFullscreen={() => {}}
          isFullscreen={false}
        />

        {/* 2. Comparison Controls Bar */}
        <CodeDiffControls
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          options={options}
          onOptionsChange={setOptions}
        />

        {/* 3. Main Dual Code Workspace & Side Summary Panel */}
        <div className="grid gap-4 lg:grid-cols-4 min-w-0">
          <div className="lg:col-span-3 min-w-0 space-y-4">
            <CodeDiffWorkspaceEditors
              original={original}
              modified={modified}
              onOriginalChange={setOriginal}
              onModifiedChange={setModified}
              language={activeLanguage}
              viewMode={viewMode}
              diffResult={diffResult}
              onSwap={handleSwap}
              onCopyOriginal={handleCopyOriginal}
              onCopyModified={handleCopyModified}
              activeHunk={activeHunk}
              origEditorRef={origEditorRef}
              modEditorRef={modEditorRef}
            />

            {/* 4. Diff Result & Change Navigation Panel */}
            <DiffResultPanel
              diffResult={diffResult}
              currentChangeIndex={currentChangeIndex}
              onSelectChangeIndex={setCurrentChangeIndex}
              onTakeRight={handleTakeRight}
              onTakeLeft={handleTakeLeft}
            />
          </div>

          {/* Right Summary & Quick Actions Sidebar */}
          <div className="lg:col-span-1 min-w-0">
            <DiffSummaryPanel
              stats={diffResult.stats}
              onCopyDiff={handleCopyDiff}
              onDownloadDiff={handleDownloadDiff}
              onCopyOriginal={handleCopyOriginal}
              onCopyModified={handleCopyModified}
            />
          </div>
        </div>
      </div>
    </ToolWorkspaceShell>
  );
}
