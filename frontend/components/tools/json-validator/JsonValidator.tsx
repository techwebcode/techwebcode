"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";
import ToolHeader from "@/components/tool/ToolHeader";
import CodeEditor from "@/components/tool/CodeEditor";
import ToolExplanation from "@/components/tool/ToolExplanation";
import RelatedTools from "@/components/tool/RelatedTools";
import { Tool } from "@/types/tools";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCode,
  Trash2,
  Check,
  Copy,
  X,
  ArrowRight,
  Maximize2,
  ShieldCheck,
  Sparkles,
  Layers,
  Key,
  Database,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import {
  analyzeJsonSyntaxError,
  calculateJsonStats,
  findDuplicateKeys,
  DuplicateKeyError,
  JsonValidationResult,
} from "./jsonValidator.utils";
import FullScreenWorkspace from "@/components/tool/workspace/FullScreenWorkspace";

interface Props {
  tool: Tool;
}

const SAMPLE_VALID = `{
  "status": "success",
  "code": 200,
  "api_version": "v2.4",
  "data": {
    "user_id": 10842,
    "username": "rajat_engineer",
    "email": "rajat@techwebcode.in",
    "verified": true,
    "roles": ["developer", "admin"],
    "settings": {
      "theme": "dark",
      "notifications": {
        "email": true,
        "slack": false
      }
    }
  }
}`;

const SAMPLE_TRAILING_COMMA = `{
  "application": "TechWebCode",
  "framework": "Next.js 16",
  "version": "1.0.0",
  "modules": [
    "json-validator",
    "json-formatter",
  ],
}`;

const SAMPLE_UNQUOTED_KEY = `{
  status: "error",
  code: 400,
  "message": "Unquoted key names violate RFC 8259"
}`;

const SAMPLE_DUPLICATE_KEY = `{
  "id": 101,
  "service": "authentication",
  "endpoint": "/api/v1/login",
  "timeout_ms": 5000,
  "service": "duplicate-overwritten-service",
  "active": true
}`;

export default function JsonValidator({ tool }: Props) {
  const [input, setInput] = useState<string>(SAMPLE_VALID);
  const [strictDuplicateCheck, setStrictDuplicateCheck] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const debouncedInput = useDebounce(input, 250);

  // Diagnostic engine computation with debouncing for fast typing
  const validationResult: JsonValidationResult = useMemo(() => {
    if (!debouncedInput.trim()) {
      return { isValid: null };
    }

    try {
      const parsed = JSON.parse(debouncedInput);
      const stats = calculateJsonStats(parsed, debouncedInput);

      // Duplicate key detection in strict mode
      let duplicateKeys: DuplicateKeyError[] = [];
      if (strictDuplicateCheck) {
        duplicateKeys = findDuplicateKeys(debouncedInput);
      }

      return {
        isValid: true,
        stats,
        duplicateKeys,
      };
    } catch (err: any) {
      const { line, column, suggestion, lineSnippet, pointerSnippet } =
        analyzeJsonSyntaxError(debouncedInput, err);

      return {
        isValid: false,
        errorTitle: "Invalid JSON Syntax Structure",
        errorMessage: err.message || "Failed to parse JSON string.",
        line,
        column,
        suggestion,
        lineSnippet,
        pointerSnippet,
      };
    }
  }, [debouncedInput, strictDuplicateCheck]);

  // Keyboard shortcut listener: Ctrl+Enter / Cmd+Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        toast.info(
          validationResult.isValid === true
            ? "Valid RFC 8259 JSON verified!"
            : "Syntax errors detected in JSON."
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [validationResult]);

  const handleClearClick = () => {
    if (input.trim()) {
      setShowClearConfirm(true);
    } else {
      executeClear();
    }
  };

  const executeClear = () => {
    setInput("");
    setShowClearConfirm(false);
    toast.info("Cleared JSON editor");
  };

  const handleCopy = () => {
    if (!input) return;
    navigator.clipboard.writeText(input);
    setCopied(true);
    toast.success("Copied JSON payload to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to format byte sizes
  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(2)} KB`;
  };

  const renderWorkspace = () => (
    <div className="space-y-4">
      {/* 1. Main Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-xs">
        {/* Left: Samples & Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => {
              setInput(SAMPLE_VALID);
              toast.info("Loaded valid RFC 8259 sample");
            }}
            className="h-8.5 px-3.5 text-xs font-semibold gap-1.5 shadow-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Valid Sample</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setInput(SAMPLE_TRAILING_COMMA);
              toast.info("Loaded trailing comma syntax error");
            }}
            className="h-8.5 text-xs font-medium text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/10"
          >
            <span>Trailing Comma</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setInput(SAMPLE_UNQUOTED_KEY);
              toast.info("Loaded unquoted key syntax error");
            }}
            className="h-8.5 text-xs font-medium text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/10"
          >
            <span>Unquoted Key</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setInput(SAMPLE_DUPLICATE_KEY);
              toast.info("Loaded duplicate key sample");
            }}
            className="h-8.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/10"
          >
            <span>Duplicate Key</span>
          </Button>
        </div>

        {/* Right Controls: Strict Toggle, Copy, Clear, Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Strict Duplicate Check Toggle */}
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none px-2 py-1 rounded-lg border border-border/60 hover:bg-muted/40">
            <input
              type="checkbox"
              checked={strictDuplicateCheck}
              onChange={(e) => setStrictDuplicateCheck(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
            />
            <span className="hidden sm:inline">Strict Duplicate Key Check</span>
            <span className="sm:hidden">Strict</span>
          </label>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!input}
            onClick={handleCopy}
            className="h-8.5 px-3 text-xs text-muted-foreground hover:text-foreground"
            title="Copy JSON Payload"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 mr-1.5" />
            )}
            <span>{copied ? "Copied" : "Copy"}</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-8.5 px-2.5 text-xs text-muted-foreground hover:text-foreground"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </Button>

          {showClearConfirm ? (
            <div className="flex items-center gap-1 bg-destructive/10 p-1 rounded-lg border border-destructive/20 animate-in fade-in">
              <span className="text-[11px] font-medium text-destructive px-1">Clear?</span>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={executeClear}
                className="h-6.5 px-2 text-[11px] font-semibold"
              >
                Yes
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowClearConfirm(false)}
                className="h-6.5 w-6.5 p-0 text-muted-foreground"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearClick}
              disabled={!input}
              className="h-8.5 px-2.5 text-xs text-muted-foreground hover:text-destructive disabled:opacity-40"
              title="Clear JSON Editor"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* 2. Diagnostic & Status Banners */}
      {validationResult.isValid === true && (
        <div className="space-y-2.5 animate-in fade-in-50 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-sm text-emerald-700 dark:text-emerald-300">
                    Valid RFC 8259 JSON
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white uppercase tracking-wider">
                    Syntax OK
                  </span>
                </div>
                <div className="text-xs text-emerald-800 dark:text-emerald-300/80 mt-0.5">
                  Input payload parsed cleanly without syntax errors.
                </div>
              </div>
            </div>

            {/* 1-Click Cross-Link Shortcuts */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/tools/json-formatter"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Format / Beautify this JSON →</span>
              </Link>
            </div>
          </div>

          {/* Diagnostic Metadata Stats Pills */}
          {validationResult.stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl border border-border/80 bg-card/60 flex items-center gap-3">
                <Database className="w-4 h-4 text-blue-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    File Size
                  </div>
                  <div className="text-xs font-mono font-bold text-foreground truncate">
                    {formatBytes(validationResult.stats.sizeBytes)}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-border/80 bg-card/60 flex items-center gap-3">
                <Key className="w-4 h-4 text-emerald-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Total Keys
                  </div>
                  <div className="text-xs font-mono font-bold text-foreground truncate">
                    {validationResult.stats.totalKeys} keys
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-border/80 bg-card/60 flex items-center gap-3">
                <Layers className="w-4 h-4 text-purple-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Max Nesting Depth
                  </div>
                  <div className="text-xs font-mono font-bold text-foreground truncate">
                    Level {validationResult.stats.depth}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-border/80 bg-card/60 flex items-center gap-3">
                <FileCode className="w-4 h-4 text-amber-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Root Structure
                  </div>
                  <div className="text-xs font-mono font-bold text-foreground truncate">
                    {validationResult.stats.rootType}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Strict Mode Duplicate Key Warnings */}
          {validationResult.duplicateKeys && validationResult.duplicateKeys.length > 0 && (
            <div className="p-3.5 px-4 rounded-xl border bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
                <span>Strict Mode Warning: Duplicate Object Key Detected!</span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">
                Standard JavaScript <code className="font-mono">JSON.parse</code> will silently overwrite earlier duplicate values with the last one:
              </p>
              <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
                {validationResult.duplicateKeys.map((dup, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 font-semibold"
                  >
                    &quot;{dup.key}&quot; (Line {dup.line})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Invalid Syntax Error Visualizer */}
      {validationResult.isValid === false && (
        <div className="p-4 rounded-2xl border bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-100 space-y-3 animate-in fade-in-50 duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-400 shrink-0">
                <XCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="font-extrabold text-sm text-rose-700 dark:text-rose-300">
                  {validationResult.errorTitle}
                </div>
                <div className="text-xs text-rose-800 dark:text-rose-300/80 font-mono mt-0.5">
                  {validationResult.errorMessage}
                </div>
              </div>
            </div>

            {validationResult.line && (
              <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-mono text-xs font-bold shrink-0">
                Line {validationResult.line}, Col {validationResult.column}
              </span>
            )}
          </div>

          {/* Visual Offending Line Snippet Pointer */}
          {validationResult.lineSnippet && (
            <div className="p-3 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto border border-rose-500/30">
              <div className="text-[10px] text-slate-400 select-none pb-1 border-b border-slate-800">
                Offending Line {validationResult.line}:
              </div>
              <div className="pt-2 text-rose-300 whitespace-pre">
                {validationResult.lineSnippet}
              </div>
              {validationResult.pointerSnippet && (
                <div className="text-amber-400 font-black whitespace-pre select-none">
                  {validationResult.pointerSnippet}
                </div>
              )}
            </div>
          )}

          {/* Suggestion Fix Advice */}
          {validationResult.suggestion && (
            <div className="text-xs leading-relaxed text-rose-800 dark:text-rose-300/90 pt-1 flex items-start gap-1.5">
              <span className="font-bold shrink-0">Suggested Fix:</span>
              <span>{validationResult.suggestion}</span>
            </div>
          )}
        </div>
      )}

      {/* 3. Code Editor */}
      <CodeEditor
        title="JSON Payload to Validate"
        badge={
          validationResult.isValid === true
            ? "RFC 8259 Valid"
            : validationResult.isValid === false
            ? `Syntax Error (Line ${validationResult.line || 1})`
            : "Empty Payload"
        }
        value={input}
        onChange={setInput}
        language="json"
        placeholder="Paste JSON string here to validate syntax against RFC 8259..."
        height="450px"
        onCopy={handleCopy}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <ToolHeader tool={tool} />

      {/* Main Workspace */}
      {renderWorkspace()}

      {/* Fullscreen Workspace Modal */}
      {isFullscreen && (
        <FullScreenWorkspace
          isOpen={isFullscreen}
          onClose={() => setIsFullscreen(false)}
          title="JSON Syntax Validator & Diagnostics"
          badge="100% Client-Side"
        >
          <div className="p-4 sm:p-8 max-w-6xl mx-auto">{renderWorkspace()}</div>
        </FullScreenWorkspace>
      )}

      {/* Educational Guide & FAQs */}
      <ToolExplanation
        title="RFC 8259 JSON Syntax Validator & Linting"
        description="JSON validation ensures that configuration manifests, API payloads, and database records strictly comply with RFC 8259 and ECMA-404 specifications. TechWebCode provides deep syntax diagnostics, exact line numbers, and strict duplicate key checks directly inside browser RAM."
        howToUse={[
          "Paste or type your JSON string into the editor above.",
          "Check the live diagnostic banner. If syntax errors exist, the exact offending line, column, and pointer visualizer highlight the error immediately.",
          "If valid, inspect payload metadata (size, keys count, nesting depth) and click 'Format / Beautify this JSON →' to format with indentation.",
          "Enable 'Strict Duplicate Key Check' to detect duplicate object keys that standard JSON parser might silently overwrite.",
        ]}
        features={[
          "Strict RFC 8259 validation with real-time error position detection.",
          "Visual line and column error pointer highlighting the exact offending character.",
          "Strict Mode Duplicate Object Key Detection to prevent silent data corruption.",
          "Payload structural metadata: File Size, Total Key Count, Nesting Depth, and Root Type.",
          "1-Click direct cross-link to JSON Formatter & Beautifier.",
          "100% Client-Side execution guarantees complete privacy — zero data sent to servers.",
        ]}
        faqs={[
          {
            question: "What is RFC 8259 JSON compliance?",
            answer:
              "RFC 8259 is the official IETF standard defining the JavaScript Object Notation (JSON) Data Interchange Format. It mandates strict syntax rules including double quotes for property keys and strings, no trailing commas, and precise Unicode escape sequences.",
          },
          {
            question: "Why does the validator flag duplicate keys?",
            answer:
              "Standard JavaScript JSON.parse will silently overwrite earlier duplicate keys with the last key-value pair, which often causes subtle data loss bugs. TechWebCode's strict check detects and warns you about duplicates across object scopes.",
          },
          {
            question: "Are trailing commas permitted in JSON?",
            answer:
              "No. Unlike JavaScript object literals, trailing commas after the last array item or object property are strictly invalid in RFC 8259 JSON.",
          },
          {
            question: "Can I format my valid JSON directly after validating?",
            answer:
              "Yes! Once your JSON validates with zero errors, a 1-click shortcut button 'Format / Beautify this JSON →' appears to format it with custom indentation.",
          },
        ]}
      />

      {/* Interlinking Related Developer Tools */}
      <RelatedTools currentSlug="json-validator" />
    </div>
  );
}
