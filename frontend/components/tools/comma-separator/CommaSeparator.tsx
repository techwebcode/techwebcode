"use client";

import React, { useState, useMemo } from "react";
import ToolHeader from "@/components/tool/ToolHeader";
import { Tool } from "@/types/tools";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Copy,
  Check,
  Trash2,
  Sparkles,
  Maximize2,
  ArrowLeftRight,
  Download,
  Filter,
  SlidersHorizontal,
  CheckSquare,
  Square,
} from "lucide-react";
import { toast } from "sonner";
import {
  SeparatorType,
  QuoteType,
  SortType,
  ConversionDirection,
  ListFormatterOptions,
  formatList,
  SAMPLE_FRUITS,
  SAMPLE_NUMERIC_IDS,
  SAMPLE_COMMA_TEXT,
} from "./commaSeparator.utils";
import FullScreenWorkspace from "@/components/tool/workspace/FullScreenWorkspace";

interface Props {
  tool: Tool;
}

export default function CommaSeparator({ tool }: Props) {
  const [input, setInput] = useState<string>(SAMPLE_FRUITS);
  const [direction, setDirection] = useState<ConversionDirection>("list-to-delimited");
  const [separatorType, setSeparatorType] = useState<SeparatorType>("comma");
  const [customSeparator, setCustomSeparator] = useState<string>(",");
  const [spaceAfterSeparator, setSpaceAfterSeparator] = useState<boolean>(true);
  const [quoteType, setQuoteType] = useState<QuoteType>("none");
  const [trimWhitespace, setTrimWhitespace] = useState<boolean>(true);
  const [removeEmpty, setRemoveEmpty] = useState<boolean>(true);
  const [removeDuplicates, setRemoveDuplicates] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<SortType>("none");

  const [copied, setCopied] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const options: ListFormatterOptions = useMemo(
    () => ({
      direction,
      separatorType,
      customSeparator,
      spaceAfterSeparator,
      quoteType,
      trimWhitespace,
      removeEmpty,
      removeDuplicates,
      sortOrder,
    }),
    [
      direction,
      separatorType,
      customSeparator,
      spaceAfterSeparator,
      quoteType,
      trimWhitespace,
      removeEmpty,
      removeDuplicates,
      sortOrder,
    ]
  );

  const result = useMemo(() => {
    return formatList(input, options);
  }, [input, options]);

  const handleCopy = () => {
    if (!result.output) return;
    navigator.clipboard.writeText(result.output);
    setCopied(true);
    toast.success("Output copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result.output) return;
    const blob = new Blob([result.output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = direction === "list-to-delimited" ? "comma-separated.txt" : "list-items.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded formatted file!");
  };

  const handleSwap = () => {
    if (!result.output) {
      toast.info("No output to swap into input.");
      return;
    }
    setInput(result.output);
    setDirection((prev) =>
      prev === "list-to-delimited" ? "delimited-to-list" : "list-to-delimited"
    );
    toast.success("Swapped output into input and reversed direction!");
  };

  const handleClear = () => {
    setInput("");
    toast.info("Input cleared");
  };

  const renderWorkspaceContent = () => (
    <div className="space-y-6">
      {/* 1. Client-Side Privacy Notice */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-emerald-500/25 bg-emerald-500/5 text-xs text-foreground">
        <div className="flex items-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            <strong>100% Client-Side:</strong> Your input is processed locally in your browser and is not sent to TechWebCode servers.
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground font-mono bg-background/80 px-2 py-0.5 rounded border">
          Zero Network Overhead
        </span>
      </div>

      {/* 2. Direction Switcher & Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-muted/40 border">
        {/* Direction Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-background border text-xs">
          <button
            type="button"
            onClick={() => setDirection("list-to-delimited")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              direction === "list-to-delimited"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            List ➔ Comma-Separated
          </button>
          <button
            type="button"
            onClick={() => setDirection("delimited-to-list")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              direction === "delimited-to-list"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Comma-Separated ➔ List
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSwap}
            className="gap-1.5 text-xs rounded-xl"
            title="Move output to input and reverse conversion direction"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-blue-500" />
            <span>Swap Direction</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setInput(direction === "list-to-delimited" ? SAMPLE_FRUITS : SAMPLE_COMMA_TEXT);
            }}
            className="gap-1 text-xs rounded-xl"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Sample: Fruits</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setInput(SAMPLE_NUMERIC_IDS);
              setDirection("list-to-delimited");
            }}
            className="gap-1 text-xs rounded-xl hidden md:inline-flex"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Sample: IDs</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="gap-1 text-xs rounded-xl text-muted-foreground hover:text-rose-500"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="gap-1 text-xs rounded-xl ml-auto sm:ml-0"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fullscreen</span>
          </Button>
        </div>
      </div>

      {/* 3. Settings & Options Panel */}
      <div className="rounded-2xl border bg-card p-4 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b pb-2.5">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Formatting & Delimiter Options</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-center text-xs">
          {/* Separator Type */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Delimiter</label>
            <select
              value={separatorType}
              onChange={(e) => setSeparatorType(e.target.value as SeparatorType)}
              className="w-full h-9 rounded-xl border border-input bg-background px-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary text-xs"
            >
              <option value="comma">Comma ( , )</option>
              <option value="semicolon">Semicolon ( ; )</option>
              <option value="pipe">Pipe ( | )</option>
              <option value="space">Space</option>
              <option value="tab">Tab ( \t )</option>
              <option value="custom">Custom Character</option>
            </select>
          </div>

          {/* Custom Delimiter (if chosen) */}
          {separatorType === "custom" && (
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Custom String</label>
              <input
                type="text"
                value={customSeparator}
                onChange={(e) => setCustomSeparator(e.target.value)}
                placeholder="e.g. :: or ->"
                className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          {/* Quote Wrapping */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Item Quotes (SQL / JSON)</label>
            <select
              value={quoteType}
              onChange={(e) => setQuoteType(e.target.value as QuoteType)}
              disabled={direction === "delimited-to-list"}
              className="w-full h-9 rounded-xl border border-input bg-background px-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary text-xs disabled:opacity-50"
            >
              <option value="none">No Quotes (raw values)</option>
              <option value="single">Single Quotes (&apos;value&apos;)</option>
              <option value="double">Double Quotes (&quot;value&quot;)</option>
              <option value="backtick">Backticks (`value`)</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Sort Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortType)}
              className="w-full h-9 rounded-xl border border-input bg-background px-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary text-xs"
            >
              <option value="none">Preserve Original Order</option>
              <option value="asc">Alphabetical (A ➔ Z)</option>
              <option value="desc">Reverse (Z ➔ A)</option>
            </select>
          </div>
        </div>

        {/* Checkbox Cleanup Toggles */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 border-t text-xs">
          {direction === "list-to-delimited" && separatorType !== "space" && separatorType !== "tab" && (
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <button
                type="button"
                role="checkbox"
                aria-checked={spaceAfterSeparator}
                onClick={() => setSpaceAfterSeparator(!spaceAfterSeparator)}
                className="text-primary hover:opacity-80"
              >
                {spaceAfterSeparator ? (
                  <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                ) : (
                  <Square className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              <span className="text-foreground font-medium">Space after separator (e.g. &quot;a, b&quot;)</span>
            </label>
          )}

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <button
              type="button"
              role="checkbox"
              aria-checked={trimWhitespace}
              onClick={() => setTrimWhitespace(!trimWhitespace)}
              className="text-primary hover:opacity-80"
            >
              {trimWhitespace ? (
                <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              ) : (
                <Square className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            <span className="text-foreground font-medium">Trim item whitespace</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <button
              type="button"
              role="checkbox"
              aria-checked={removeEmpty}
              onClick={() => setRemoveEmpty(!removeEmpty)}
              className="text-primary hover:opacity-80"
            >
              {removeEmpty ? (
                <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              ) : (
                <Square className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            <span className="text-foreground font-medium">Remove empty lines/items</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <button
              type="button"
              role="checkbox"
              aria-checked={removeDuplicates}
              onClick={() => setRemoveDuplicates(!removeDuplicates)}
              className="text-primary hover:opacity-80"
            >
              {removeDuplicates ? (
                <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              ) : (
                <Square className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            <span className="text-foreground font-medium">Remove duplicates</span>
          </label>
        </div>
      </div>

      {/* 4. Live Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border bg-card p-3 text-center space-y-1">
          <span className="text-xs text-muted-foreground font-medium">Total Items</span>
          <p className="text-lg font-bold text-foreground font-mono">{result.totalItems}</p>
        </div>
        <div className="rounded-xl border bg-card p-3 text-center space-y-1">
          <span className="text-xs text-muted-foreground font-medium">Characters</span>
          <p className="text-lg font-bold text-foreground font-mono">{result.characterCount}</p>
        </div>
        <div className="rounded-xl border bg-card p-3 text-center space-y-1">
          <span className="text-xs text-muted-foreground font-medium">Duplicates Removed</span>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400 font-mono">
            {result.duplicatesRemoved}
          </p>
        </div>
        <div className="rounded-xl border bg-card p-3 text-center space-y-1">
          <span className="text-xs text-muted-foreground font-medium">Empty Filtered</span>
          <p className="text-lg font-bold text-muted-foreground font-mono">{result.emptyItemsRemoved}</p>
        </div>
      </div>

      {/* 5. Main Two-Column / Stacked Workspace */}
      <div className="grid gap-6 lg:grid-cols-2 items-start">
        {/* Input Card */}
        <div className="flex flex-col rounded-2xl border bg-card shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {direction === "list-to-delimited" ? "Input List (One per line)" : "Input Delimited Text"}
            </span>

            <span className="text-[11px] font-mono text-muted-foreground">
              {input.length} chars
            </span>
          </div>

          <div className="p-4 space-y-2">
            <label htmlFor="comma-separator-input" className="sr-only">
              {direction === "list-to-delimited" ? "Multi-line list input" : "Delimited text input"}
            </label>
            <textarea
              id="comma-separator-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                direction === "list-to-delimited"
                  ? "Paste multi-line items here...\napple\nbanana\norange"
                  : "Paste comma-separated text here...\napple, banana, orange"
              }
              rows={10}
              className="w-full resize-y rounded-xl border border-input bg-background p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between px-4 py-2.5 bg-muted/20 border-t text-xs text-muted-foreground">
            <span>Input direction: {direction === "list-to-delimited" ? "Newlines ➔ Delimited" : "Delimited ➔ Newlines"}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Output Result Card */}
        <div className="flex flex-col rounded-2xl border bg-card shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {direction === "list-to-delimited" ? "Delimited Result" : "List Result (One per line)"}
              </span>
              <span className="rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-bold">
                {result.totalItems} Items
              </span>
            </div>

            <span className="text-[11px] font-mono text-muted-foreground">
              {result.characterCount} chars
            </span>
          </div>

          <div className="p-4 space-y-4">
            <label htmlFor="comma-separator-output" className="sr-only">
              Formatted delimited output
            </label>
            <textarea
              id="comma-separator-output"
              readOnly
              value={result.output}
              placeholder="Formatted output will appear here..."
              rows={10}
              className="w-full resize-y rounded-xl border border-input bg-muted/20 p-3 text-sm font-mono focus:outline-none leading-relaxed text-foreground select-all"
            />

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button
                type="button"
                onClick={handleCopy}
                disabled={!result.output}
                className="flex-1 rounded-xl gap-1.5 font-bold text-xs h-10"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied to Clipboard!" : "Copy Result"}</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleDownload}
                disabled={!result.output}
                className="rounded-xl gap-1.5 text-xs h-10"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </Button>
            </div>
          </div>

          <div className="px-4 py-2.5 bg-muted/20 border-t text-[11px] text-muted-foreground flex items-center justify-between">
            <span>Delimiter: {separatorType}</span>
            <span>Quotes: {quoteType}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <ToolHeader
        tool={tool}
        title="Comma Separator"
        description="Quickly convert lists into comma-separated values, format delimited text, remove duplicates, and reverse comma-separated strings back to newlines with 100% client-side privacy."
      />

      {/* Main Workspace */}
      {renderWorkspaceContent()}

      {/* Fullscreen Modal View */}
      {isFullscreen && (
        <FullScreenWorkspace
          isOpen={isFullscreen}
          onClose={() => setIsFullscreen(false)}
          title="Comma Separator & List Formatter"
          badge="100% Client-Side"
        >
          <div className="p-4 sm:p-8 max-w-6xl mx-auto">
            {renderWorkspaceContent()}
          </div>
        </FullScreenWorkspace>
      )}
    </div>
  );
}
