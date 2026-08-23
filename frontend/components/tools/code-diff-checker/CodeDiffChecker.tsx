"use client";

import React, { useState, useMemo, useRef } from "react";
import { Tool } from "@/types/tools";
import ToolHeader from "@/components/tool/ToolHeader";
import RelatedTools from "@/components/tool/RelatedTools";
import ToolExplanation from "@/components/tool/ToolExplanation";
import FullScreenWorkspace from "@/components/tool/workspace/FullScreenWorkspace";
import CodeDiffToolbar from "./CodeDiffToolbar";
import CodeDiffControls, { ViewMode } from "./CodeDiffControls";
import CodeDiffWorkspaceEditors from "./CodeDiffWorkspaceEditors";
import DiffResultPanel from "./DiffResultPanel";
import DiffSummaryPanel from "./DiffSummaryPanel";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Maximize2 } from "lucide-react";
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
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

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

  if (isFullscreen) {
    return (
      <FullScreenWorkspace
        isOpen={true}
        onClose={() => setIsFullscreen(false)}
        title={tool.name}
        badge="Full Screen Workspace"
      >
        <div className="flex-1 flex flex-col space-y-4 min-h-0 overflow-y-auto w-full h-full pr-1">
          {/* Privacy Banner */}
          <div className="flex items-center gap-2 p-3 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs shrink-0">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="font-bold text-slate-100">100% Private Client-Side Code Diff Evaluation</span>
          </div>

          {/* Workspace Toolbar */}
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
            onToggleFullscreen={() => setIsFullscreen(false)}
            isFullscreen={true}
          />

          {/* Comparison Controls Bar */}
          <CodeDiffControls
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            options={options}
            onOptionsChange={setOptions}
          />

          {/* Main Dual Code Workspace & Side Summary Panel */}
          <div className="grid gap-4 lg:grid-cols-4 min-w-0 flex-1 min-h-0">
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

              <DiffResultPanel
                diffResult={diffResult}
                currentChangeIndex={currentChangeIndex}
                onSelectChangeIndex={setCurrentChangeIndex}
                onTakeRight={handleTakeRight}
                onTakeLeft={handleTakeLeft}
              />
            </div>

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
      </FullScreenWorkspace>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <ToolHeader tool={tool} />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsFullscreen(true)}
          className="h-9 px-3 text-xs font-medium gap-1.5 self-start sm:self-auto shrink-0"
        >
          <Maximize2 className="w-4 h-4" />
          <span>Full Screen Workspace</span>
        </Button>
      </div>

      {/* 2. Privacy Notice Banner */}
      <div className="flex items-start gap-3 p-3.5 px-4 rounded-2xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
        <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-bold text-foreground">100% Client-Side Privacy Guarantee</div>
          <div className="opacity-90 leading-relaxed text-slate-600 dark:text-slate-400">
            🔒 Code difference analysis is calculated locally in browser memory. Zero code uploaded or stored on TechWebCode servers.
          </div>
        </div>
      </div>

      <div className="space-y-4 w-full min-w-0">
        {/* 3. Workspace Toolbar */}
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
          onToggleFullscreen={() => setIsFullscreen(true)}
          isFullscreen={false}
        />

        {/* 4. Comparison Controls Bar */}
        <CodeDiffControls
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          options={options}
          onOptionsChange={setOptions}
        />

        {/* 5. Main Dual Code Workspace & Side Summary Panel */}
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

            <DiffResultPanel
              diffResult={diffResult}
              currentChangeIndex={currentChangeIndex}
              onSelectChangeIndex={setCurrentChangeIndex}
              onTakeRight={handleTakeRight}
              onTakeLeft={handleTakeLeft}
            />
          </div>

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

      {/* 6. Related Tools & SEO Explanation */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-8">
        <RelatedTools currentSlug={tool.slug} />
        <ToolExplanation
          title={tool.name}
          description={tool.description || tool.shortDescription || "Online code difference checker."}
          howToUse={[
            "Paste original code on the left and modified code on the right.",
            "Choose your view mode: Side-by-Side, Unified git diff, Split, or Word-level diff.",
            "Use hunk transfer buttons (← / →) to apply individual changes.",
            "Export git diff files or copy differences with 1-click.",
          ]}
          features={[
            "100% Client-Side Evaluation: Zero code sent to external servers.",
            "Side-by-side dual Monaco code editor with synchronized scrolling.",
            "Word-level difference highlighting and line hunk merging.",
            "Export options for git diff text, original code, modified code, and JSON summary.",
          ]}
          faqs={[
            {
              question: "Is my code secure and private?",
              answer: "Yes! All diff calculations run locally in your browser memory. No code is uploaded to any server.",
            },
          ]}
        />
      </div>
    </div>
  );
}
