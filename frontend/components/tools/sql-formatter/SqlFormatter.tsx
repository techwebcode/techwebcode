"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import ToolHeader from "@/components/tool/ToolHeader";
import CodeEditor from "@/components/tool/CodeEditor";
import { Tool } from "@/types/tools";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  CheckCircle2,
  Minimize2,
  Copy,
  Check,
  Download,
  Upload,
  Trash2,
  Settings2,
  FileCode,
  AlertCircle,
  Database,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import {
  SqlDialect,
  SQL_DIALECTS,
  SqlFormatOptions,
  DEFAULT_FORMAT_OPTIONS,
  SqlValidationResult,
  formatSqlQuery,
  minifySqlQuery,
  validateSqlQuery,
  SAMPLE_SQL_QUERIES,
} from "./sqlEngine";
import SqlValidationPanel from "./SqlValidationPanel";

interface Props {
  tool: Tool;
}

export default function SqlFormatter({ tool }: Props) {
  const [dialect, setDialect] = useState<SqlDialect>("sql");
  const [formatOptions, setFormatOptions] = useState<SqlFormatOptions>(DEFAULT_FORMAT_OPTIONS);
  const [showSettings, setShowSettings] = useState(false);

  // Initial code populated with standard sample
  const [input, setInput] = useState<string>(SAMPLE_SQL_QUERIES.sql.sql);
  const [output, setOutput] = useState<string>(
    () => formatSqlQuery(SAMPLE_SQL_QUERIES.sql.sql, DEFAULT_FORMAT_OPTIONS).formatted || SAMPLE_SQL_QUERIES.sql.sql
  );
  const [formatError, setFormatError] = useState<string>("");
  const [validationResult, setValidationResult] = useState<SqlValidationResult | null>(null);

  const [lastAction, setLastAction] = useState<"format" | "validate" | "minify" | "idle">("idle");
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format SQL Action (Primary Visual Action)
  const handleFormat = useCallback(
    (sqlText: string = input, opts: SqlFormatOptions = formatOptions) => {
      if (!sqlText.trim()) {
        toast.info("Please enter or paste a SQL query first.");
        setOutput("");
        setFormatError("");
        return;
      }

      const { formatted, error } = formatSqlQuery(sqlText, { ...opts, dialect });

      if (error) {
        setFormatError(error);
        setOutput(sqlText);
        toast.error("Formatting failed for selected dialect. Check query syntax.");
      } else {
        setFormatError("");
        setOutput(formatted);
        toast.success(`SQL formatted (${SQL_DIALECTS[dialect].name})`);
      }

      setLastAction("format");
    },
    [input, formatOptions, dialect]
  );

  // Validate SQL Action (Secondary Action)
  const handleValidate = (sqlText: string = input, activeDialect: SqlDialect = dialect) => {
    if (!sqlText.trim()) {
      toast.info("Please enter or paste a SQL query first to validate.");
      setValidationResult(null);
      return;
    }

    const result = validateSqlQuery(sqlText, activeDialect);
    setValidationResult(result);
    setLastAction("validate");

    if (result.isValid) {
      toast.success(`Valid SQL syntax (${SQL_DIALECTS[activeDialect].name})`);
    } else {
      toast.error(
        `Syntax error detected at line ${result.error?.line || 1}, col ${result.error?.column || 1}`
      );
    }
  };

  // Minify SQL Action (Secondary Action)
  const handleMinify = (sqlText: string = input) => {
    if (!sqlText.trim()) {
      toast.info("Please enter or paste a SQL query first to minify.");
      setOutput("");
      return;
    }

    const { minified, error } = minifySqlQuery(sqlText);

    if (error) {
      toast.error(error);
    } else {
      setOutput(minified);
      setFormatError("");
      toast.success("SQL query minified!");
    }

    setLastAction("minify");
  };

  // Keyboard shortcut listener: Cmd+Enter / Ctrl+Enter -> Format SQL
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleFormat();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleFormat]);

  // Load dialect-specific sample query
  const handleLoadSample = (targetDialect: SqlDialect = dialect) => {
    const sample = SAMPLE_SQL_QUERIES[targetDialect] || SAMPLE_SQL_QUERIES.sql;
    setInput(sample.sql);
    setFormatError("");
    setValidationResult(null);

    const { formatted } = formatSqlQuery(sample.sql, { ...formatOptions, dialect: targetDialect });
    setOutput(formatted || sample.sql);
    toast.info(`Loaded sample query for ${SQL_DIALECTS[targetDialect].name}`);
  };

  // Handle dialect switch
  const handleDialectChange = (newDialect: SqlDialect) => {
    setDialect(newDialect);
    setFormatOptions((prev) => ({ ...prev, dialect: newDialect }));

    // If input is still one of the sample queries, switch to that dialect's sample
    const isCurrentSample = Object.values(SAMPLE_SQL_QUERIES).some((s) => s.sql === input);
    if (isCurrentSample) {
      handleLoadSample(newDialect);
    } else if (input.trim()) {
      // Re-run format or validation if active
      if (lastAction === "format" || lastAction === "idle") {
        handleFormat(input, { ...formatOptions, dialect: newDialect });
      } else if (lastAction === "validate") {
        handleValidate(input, newDialect);
      }
    }
  };

  // Copy output handler
  const handleCopy = () => {
    const textToCopy = output || input;
    if (!textToCopy.trim()) {
      toast.info("No SQL to copy.");
      return;
    }
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success("SQL copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Download SQL file handler
  const handleDownload = () => {
    const textToDownload = output || input;
    if (!textToDownload.trim()) {
      toast.info("No SQL to download.");
      return;
    }
    const filename = lastAction === "minify" ? "query.min.sql" : "query.formatted.sql";
    const blob = new Blob([textToDownload], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filename}`);
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInput(content);
        setValidationResult(null);
        handleFormat(content, formatOptions);
        toast.success(`Loaded ${file.name}`);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Clear handler
  const handleClear = () => {
    setInput("");
    setOutput("");
    setFormatError("");
    setValidationResult(null);
    setLastAction("idle");
    toast.info("Cleared editor input and output.");
  };

  const inputStats = {
    chars: input.length,
    lines: input ? input.split("\n").length : 0,
  };

  const outputStats = {
    chars: output.length,
    lines: output ? output.split("\n").length : 0,
  };

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <ToolHeader
        tool={tool}
        title="SQL Formatter & Validator"
        description="Format, validate, and minify SQL queries online."
      />

      {/* Main Action Bar & Dialect Controls */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Primary & Secondary Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Format SQL (Primary Action) */}
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => handleFormat()}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-sm gap-1.5 h-9 px-4 cursor-pointer"
              title="Format SQL Query (⌘+Enter / Ctrl+Enter)"
              aria-label="Format SQL Query"
            >
              <Sparkles className="w-4 h-4" />
              <span>Format SQL</span>
            </Button>

            {/* Validate SQL (Secondary Action) */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleValidate()}
              className="gap-1.5 h-9 px-3.5 text-foreground hover:bg-muted cursor-pointer font-medium"
              title="Validate SQL Syntax"
              aria-label="Validate SQL Syntax"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Validate SQL</span>
            </Button>

            {/* Minify SQL (Secondary Action) */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleMinify()}
              className="gap-1.5 h-9 px-3.5 text-foreground hover:bg-muted cursor-pointer font-medium"
              title="Minify SQL Query"
              aria-label="Minify SQL Query"
            >
              <Minimize2 className="w-4 h-4 text-cyan-500" />
              <span>Minify SQL</span>
            </Button>

            {/* Formatting Settings Toggle */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className={`gap-1.5 h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer ${
                showSettings ? "bg-muted text-foreground" : ""
              }`}
              title="Formatting Configuration Options"
              aria-label="Toggle Formatting Settings"
            >
              <Settings2 className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
              {showSettings ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>

          {/* Quick Input Utility Actions */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <input
              ref={fileInputRef}
              type="file"
              accept=".sql,.txt"
              className="hidden"
              onChange={handleFileUpload}
              aria-label="Upload SQL File"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1 px-2.5 cursor-pointer"
              title="Upload .sql file"
              aria-label="Upload SQL file"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleLoadSample()}
              className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1 px-2.5 cursor-pointer"
              title="Load Example Query"
              aria-label="Load Example Query"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Example</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 text-xs text-muted-foreground hover:text-destructive gap-1 px-2.5 cursor-pointer"
              title="Clear Editor"
              aria-label="Clear Editor"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </Button>
          </div>
        </div>

        {/* Dialect Selector Bar */}
        <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-border/60">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mr-1">
            <Database className="w-3.5 h-3.5 text-blue-500" />
            Dialect:
          </span>

          {(Object.keys(SQL_DIALECTS) as SqlDialect[]).map((dKey) => {
            const config = SQL_DIALECTS[dKey];
            const isSelected = dialect === dKey;
            return (
              <button
                key={dKey}
                type="button"
                onClick={() => handleDialectChange(dKey)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-blue-600/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-transparent"
                }`}
                title={config.description}
                aria-pressed={isSelected}
              >
                {config.name}
              </button>
            );
          })}
        </div>

        {/* Collapsible Formatting Settings */}
        {showSettings && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-3 bg-muted/30 rounded-xl border border-border/60 text-xs animate-in fade-in duration-100">
            {/* Indentation */}
            <div>
              <label className="font-semibold text-foreground block mb-1.5">Indentation Width</label>
              <div className="flex items-center gap-1.5">
                {[
                  { label: "2 Spaces", val: 2 },
                  { label: "4 Spaces", val: 4 },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => {
                      const updated = { ...formatOptions, tabWidth: opt.val };
                      setFormatOptions(updated);
                      handleFormat(input, updated);
                    }}
                    className={`px-2.5 py-1 rounded-md text-xs cursor-pointer border ${
                      formatOptions.tabWidth === opt.val
                        ? "bg-blue-600 text-white border-blue-600 font-semibold"
                        : "bg-card text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Keyword Casing */}
            <div>
              <label className="font-semibold text-foreground block mb-1.5">Keyword Casing</label>
              <div className="flex items-center gap-1.5">
                {[
                  { label: "UPPER", val: "upper" as const },
                  { label: "lower", val: "lower" as const },
                  { label: "Preserve", val: "preserve" as const },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => {
                      const updated = { ...formatOptions, keywordCase: opt.val };
                      setFormatOptions(updated);
                      handleFormat(input, updated);
                    }}
                    className={`px-2.5 py-1 rounded-md text-xs cursor-pointer border ${
                      formatOptions.keywordCase === opt.val
                        ? "bg-blue-600 text-white border-blue-600 font-semibold"
                        : "bg-card text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dialect Info */}
            <div>
              <label className="font-semibold text-foreground block mb-1.5">Active Dialect Quoting</label>
              <span className="text-muted-foreground font-mono bg-card px-2 py-1 rounded border border-border inline-block">
                {SQL_DIALECTS[dialect].identifierQuote}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Two-Column Editor Workspace */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: SQL Input */}
        <div className="flex flex-col space-y-2">
          <CodeEditor
            title="SQL Input Query"
            badge={SQL_DIALECTS[dialect].name}
            language="sql"
            value={input}
            onChange={(val) => {
              setInput(val);
              // Reset validation result on typing so stale state isn't shown
              if (validationResult) setValidationResult(null);
            }}
            placeholder="Paste or type raw SQL queries here (SELECT, INSERT, UPDATE, CTEs, etc.)..."
            height="460px"
          />

          {/* Input Footer Status */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono px-1">
            <span>
              {inputStats.lines} lines • {inputStats.chars.toLocaleString()} chars
            </span>
            <span className="hidden sm:inline">Press ⌘+Enter to Format</span>
          </div>
        </div>

        {/* Right Column: SQL Output & Validation */}
        <div className="flex flex-col space-y-2">
          {/* Validation Panel (Displayed prominently when validation was run) */}
          {validationResult && (
            <SqlValidationPanel validationResult={validationResult} />
          )}

          {/* Formatter Error Banner (if any) */}
          {formatError && (
            <div className="bg-rose-500/10 text-rose-400 text-xs font-mono p-3 rounded-xl border border-rose-500/20 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold block">Formatting Warning:</span>
                <span className="break-all">{formatError}</span>
              </div>
            </div>
          )}

          {/* Output Code Editor */}
          <CodeEditor
            title={lastAction === "minify" ? "Minified SQL Result" : "Formatted SQL Result"}
            badge={lastAction === "minify" ? "MINIFIED" : "FORMATTED"}
            language="sql"
            value={output || input}
            readOnly
            height={validationResult ? "320px" : "460px"}
            onCopy={handleCopy}
            onDownload={handleDownload}
          />

          {/* Output Footer Status */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono px-1">
            <span>
              {outputStats.lines} lines • {outputStats.chars.toLocaleString()} chars
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className="hover:text-foreground text-blue-500 font-semibold cursor-pointer flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy Output"}</span>
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="hover:text-foreground cursor-pointer flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .sql</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
