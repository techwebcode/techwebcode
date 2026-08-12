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
  const [stats, setStats] = useState<{ rawSize: number; minSize: number; savedPercent: number }>({
    rawSize: 0,
    minSize: 0,
    savedPercent: 0,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setErrorMessage(err.message || "Invalid JSON payload");
      setStats({ rawSize: 0, minSize: 0, savedPercent: 0 });
    }
  };

  useEffect(() => {
    minifyJson(input);
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

  const handleClear = () => {
    setInput("");
    setOutput("");
    setStatus("idle");
    setErrorMessage("");
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

      {/* Main Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/40 p-3 rounded-2xl border border-border">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => minifyJson(input)}
            className="h-8 text-xs font-semibold gap-1.5"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Minify JSON</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setInput(SAMPLE_FORMATTED)}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            <FileCode className="w-3.5 h-3.5 mr-1" />
            <span>Load Sample</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            <Upload className="w-3.5 h-3.5 mr-1" />
            <span>Upload File</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!output}
            onClick={handleCopy}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!output}
            onClick={handleDownload}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            <span>Download</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-8 text-xs text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Compression Metrics Banner */}
      {status === "success" && stats.rawSize > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-500 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4" />
            <span>Payload Size Reduced by {stats.savedPercent}% ({stats.rawSize - stats.minSize} bytes saved)</span>
          </div>

          <div className="flex gap-4 text-muted-foreground font-mono text-[11px]">
            <span>Original: {stats.rawSize} B</span>
            <span>→</span>
            <span className="text-emerald-400 font-bold">Minified: {stats.minSize} B</span>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {status === "error" && errorMessage && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl border bg-rose-500/10 border-rose-500/30 text-rose-500 font-mono text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">JSON Syntax Error</div>
            <div className="mt-0.5 opacity-90">{errorMessage}</div>
          </div>
        </div>
      )}

      {/* Editors Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
            Raw Formatted Input
          </span>
          <CodeEditor
            value={input}
            onChange={setInput}
            language="json"
            placeholder="Paste formatted JSON here to compress..."
            height="380px"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
            Minified Compact Output
          </span>
          <CodeEditor
            value={output}
            readOnly
            language="json"
            placeholder="Minified single-line JSON output will appear here..."
            height="380px"
          />
        </div>
      </div>

      {/* SEO Rich Explanation Content */}
      <ToolExplanation
        title="JSON Minifier & Compressor"
        description="JSON minification removes unnecessary whitespace, tabs, and line breaks from your JSON payloads, reducing file size and accelerating API network response times."
        howToUse={[
          "Paste your formatted JSON payload into the left code editor, or upload a .json file.",
          "Minification compresses the string instantly into a single compact line.",
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
            question: "Why is JSON minification important for APIs?",
            answer:
              "Minifying JSON payloads reduces bandwidth consumption and speeds up API response parsing times, especially over mobile connections and high-volume REST/GraphQL endpoints.",
          },
        ]}
      />

      {/* Interlinking Related Tools */}
      <RelatedTools currentSlug="json-minifier" />
    </div>
  );
}
