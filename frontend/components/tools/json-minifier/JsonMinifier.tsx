"use client";

import React, { useState, useEffect, useRef } from "react";
import ToolHeader from "@/components/tool/ToolHeader";
import CodeEditor from "@/components/tool/CodeEditor";
import ToolExplanation from "@/components/tool/ToolExplanation";
import RelatedTools from "@/components/tool/RelatedTools";
import { Tool } from "@/types/tools";
import { Button } from "@/components/ui/button";
import {
  Minimize2,
  Copy,
  Check,
  Download,
  Upload,
  FileCode,
  Trash2,
  AlertCircle,
  TrendingDown,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  tool: Tool;
}

const SAMPLE_FORMATTED = `{
  "title": "JSON Minifier Tool",
  "environment": "production",
  "optimization": {
    "stripWhitespace": true,
    "stripComments": true,
    "compressionRatio": "High"
  },
  "tags": [
    "developer-tools",
    "json-compression",
    "web-performance"
  ]
}`;

export default function JsonMinifier({ tool }: Props) {
  const [input, setInput] = useState(SAMPLE_FORMATTED);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [stats, setStats] = useState<{ rawSize: number; minSize: number; savedPercent: number }>({
    rawSize: 0,
    minSize: 0,
    savedPercent: 0,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const minifyBtnRef = useRef<HTMLButtonElement>(null);

  const minifyJson = (text: string = input) => {
    if (!text.trim()) {
      setOutput("");
      setStatus("idle");
      setErrorMessage("");
      setStats({ rawSize: 0, minSize: 0, savedPercent: 0 });
      return;
    }

    try {
      const parsed = JSON.parse(text);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setStatus("success");
      setErrorMessage("");

      // Calculate Compression Metrics
      const rawBytes = new Blob([text]).size;
      const minBytes = new Blob([minified]).size;
      const saved = rawBytes > 0 ? Math.max(0, Math.round(((rawBytes - minBytes) / rawBytes) * 100)) : 0;
      setStats({ rawSize: rawBytes, minSize: minBytes, savedPercent: saved });
    } catch (err: any) {
      setOutput("");
      setStatus("error");
      setErrorMessage(err.message || "Invalid JSON payload structure");
      setStats({ rawSize: 0, minSize: 0, savedPercent: 0 });
    }
  };

  useEffect(() => {
    minifyJson(input);
  }, [input]);

  // Keyboard shortcut listener: Ctrl+Enter / Cmd+Enter -> Minify JSON
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        minifyJson(input);
        toast.info("JSON Minified (Ctrl+Enter)");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [input]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInput(content);
        toast.success(`Loaded ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "minified.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded minified.json");
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied minified JSON to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearClick = () => {
    if (input.trim() || output.trim()) {
      setShowClearConfirm(true);
    } else {
      executeClear();
    }
  };

  const executeClear = () => {
    setInput("");
    setOutput("");
    setStatus("idle");
    setErrorMessage("");
    setShowClearConfirm(false);
    toast.info("Cleared JSON editor");
  };

  return (
    <div className="space-y-6">
      <ToolHeader tool={tool} />

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".json,application/json,text/plain"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-sm">
        {/* Left Actions: Primary Minify, Load Sample, Upload */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            ref={minifyBtnRef}
            type="button"
            size="sm"
            onClick={() => minifyJson(input)}
            className="h-9 px-4 text-xs font-semibold gap-2 shadow-sm focus-visible:ring-2 focus-visible:ring-primary"
            title="Minify JSON (Ctrl+Enter)"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Minify JSON</span>
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-primary-foreground/80 bg-primary-foreground/15 rounded border border-primary-foreground/20 ml-1">
              Ctrl+Enter
            </kbd>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setInput(SAMPLE_FORMATTED);
              toast.info("Loaded sample JSON");
            }}
            className="h-9 text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
            title="Load sample formatted JSON"
          >
            <FileCode className="w-3.5 h-3.5 mr-1.5" />
            <span>Load Sample</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-9 text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
            title="Upload .json file"
          >
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            <span>Upload File</span>
          </Button>
        </div>

        {/* Right Actions: Copy, Download, Clear */}
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!output}
            onClick={handleCopy}
            className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-40"
            title="Copy Minified JSON"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 mr-1.5" />
            )}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!output}
            onClick={handleDownload}
            className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-40"
            title="Download minified.json"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            <span>Download</span>
          </Button>

          <div className="h-4 w-px bg-border mx-1" />

          {showClearConfirm ? (
            <div className="flex items-center gap-1.5 bg-destructive/10 p-1 rounded-lg border border-destructive/20 animate-in fade-in">
              <span className="text-[11px] font-medium text-destructive px-1.5">Clear?</span>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={executeClear}
                className="h-7 px-2.5 text-[11px] font-semibold"
              >
                Clear
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowClearConfirm(false)}
                className="h-7 w-7 p-0 text-muted-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearClick}
              disabled={!input && !output}
              className="h-9 px-2.5 text-xs text-muted-foreground hover:text-destructive focus-visible:ring-2 focus-visible:ring-destructive disabled:opacity-40"
              title="Clear JSON Editor"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="sr-only">Clear</span>
            </Button>
          )}
        </div>
      </div>

      {/* Compression Metrics Banner */}
      {status === "success" && stats.rawSize > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 px-4 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-500 text-xs font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 shrink-0" />
            <span>Payload Size Reduced by {stats.savedPercent}% ({stats.rawSize - stats.minSize} bytes saved)</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="text-muted-foreground">Original: <strong className="text-foreground">{stats.rawSize} B</strong></span>
            <span className="text-muted-foreground">→</span>
            <span className="text-emerald-400 font-bold">Minified: {stats.minSize} B</span>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {status === "error" && errorMessage && (
        <div className="flex items-start gap-3 p-4 rounded-xl border bg-rose-500/10 border-rose-500/30 text-rose-500 font-mono text-xs shadow-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-rose-500">Invalid JSON Syntax</div>
            <div className="mt-1 opacity-90 leading-relaxed">{errorMessage}</div>
          </div>
        </div>
      )}

      {/* Editors Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CodeEditor
          title="Raw Formatted Input"
          badge="Input"
          value={input}
          onChange={setInput}
          language="json"
          placeholder="Paste formatted JSON payload here to compress..."
          height="420px"
          onCopy={() => {
            navigator.clipboard.writeText(input);
            toast.success("Copied raw input!");
          }}
        />

        <CodeEditor
          title="Minified Compact Output"
          badge="Minified"
          value={output}
          readOnly
          language="json"
          placeholder="Minified single-line JSON output will appear here..."
          height="420px"
          onCopy={handleCopy}
          onDownload={handleDownload}
        />
      </div>

      {/* SEO Rich Explanation Content */}
      <ToolExplanation
        title="JSON Minifier & Compressor"
        description="JSON minification removes unnecessary whitespace, tabs, and line breaks from your JSON payloads, reducing file size and accelerating API network response times."
        howToUse={[
          "Paste your formatted JSON payload into the left code editor, or upload a .json file.",
          "Click Minify JSON (or press Ctrl+Enter) to compress the payload instantly into a single compact line.",
          "Check the Compression Metrics banner to see exact bytes saved and percentage reduction.",
          "Click Copy to copy the compressed string, or Download to save minified.json.",
        ]}
        features={[
          "Instant single-line compression stripping spaces, indentation, and newlines.",
          "Detailed payload size analytics (Original size, Minified size, Bytes saved).",
          "File upload and minified .json file download support.",
          "100% Client-Side execution ensuring total data privacy.",
        ]}
        faqs={[
          {
            question: "Why is JSON minification important for web APIs?",
            answer:
              "Minifying JSON payloads strips unnecessary whitespace and line breaks, reducing payload bandwidth consumption by up to 50% and speeding up network response times over mobile connections.",
          },
          {
            question: "Does minifying JSON alter data keys or values?",
            answer:
              "No. Minification only removes structural whitespace outside string literals. All object keys, array items, numbers, and string values remain completely unchanged.",
          },
          {
            question: "Can minified JSON be un-minified later?",
            answer:
              "Yes! You can paste any minified single-line JSON string into our JSON Formatter tool at any time to restore formatted indentation and line breaks.",
          },
          {
            question: "Does minifying JSON affect browser parsing performance?",
            answer:
              "Yes. Smaller JSON string sizes parse faster in JavaScript engines and require less memory overhead when deserializing API responses.",
          },
        ]}
      />

      {/* Interlinking Related Tools */}
      <RelatedTools currentSlug="json-minifier" />
    </div>
  );
}
