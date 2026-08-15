"use client";

import React, { useState, useEffect, useRef } from "react";
import ToolHeader from "@/components/tool/ToolHeader";
import CodeEditor from "@/components/tool/CodeEditor";
import ToolExplanation from "@/components/tool/ToolExplanation";
import RelatedTools from "@/components/tool/RelatedTools";
import { Tool } from "@/types/tools";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Check,
  Download,
  Upload,
  FileCode,
  Trash2,
  Sparkles,
  Minimize2,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  tool: Tool;
}

const SAMPLE_JSON = `{
  "app": "TechWebCode",
  "category": "Developer Tools",
  "active": true,
  "features": [
    "JSON Formatter",
    "JSON Validator",
    "JSON Minifier"
  ],
  "stats": {
    "users": 25000,
    "rating": 4.9
  }
}`;

export default function JsonFormatter({ tool }: Props) {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState<number>(2);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format JSON
  const handleFormat = (text: string = input, space: number = indent) => {
    if (!text.trim()) {
      setOutput("");
      setStatus("idle");
      setErrorMessage("");
      return;
    }

    try {
      const parsed = JSON.parse(text);
      setOutput(JSON.stringify(parsed, null, space));
      setStatus("success");
      setErrorMessage("");
    } catch (err: any) {
      setOutput("");
      setStatus("error");
      setErrorMessage(err.message || "Invalid JSON syntax");
    }
  };

  // Minify JSON
  const handleMinify = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setStatus("success");
      setErrorMessage("");
      toast.success("Minified JSON payload!");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Invalid JSON syntax");
    }
  };

  // Validate JSON
  const handleValidate = () => {
    if (!input.trim()) return;
    try {
      JSON.parse(input);
      setStatus("success");
      setErrorMessage("");
      toast.success("Valid JSON structure!");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Invalid JSON syntax");
      toast.error("Invalid JSON syntax");
    }
  };

  // Auto-format on input or indent change
  useEffect(() => {
    handleFormat(input, indent);
  }, [input, indent]);

  // Keyboard shortcut listener: Ctrl+Enter / Cmd+Enter -> Format
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleFormat(input, indent);
        toast.info("JSON Formatted (Ctrl+Enter)");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [input, indent]);

  // File Upload Handler
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

  // File Download Handler
  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded formatted.json");
  };

  // Copy Handler
  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied formatted JSON to clipboard!");
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

      {/* Main Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-sm">
        {/* Left Actions: Format, Minify, Validate, Indentation */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => handleFormat(input, indent)}
            className="h-9 px-4 text-xs font-semibold gap-2 shadow-sm focus-visible:ring-2 focus-visible:ring-primary"
            title="Format JSON (Ctrl+Enter)"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Format</span>
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-primary-foreground/80 bg-primary-foreground/15 rounded border border-primary-foreground/20 ml-1">
              Ctrl+Enter
            </kbd>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleMinify}
            className="h-9 text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Minimize2 className="w-3.5 h-3.5 mr-1.5" />
            <span>Minify</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleValidate}
            className="h-9 text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
            <span>Validate</span>
          </Button>

          <div className="h-4 w-px bg-border mx-1 hidden sm:block" />

          {/* Indent Selector */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-semibold text-muted-foreground mr-1">Indent:</span>
            {[2, 4, 8].map((spaces) => (
              <Button
                key={spaces}
                type="button"
                variant={indent === spaces ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setIndent(spaces)}
                className="h-7 text-xs px-2 font-mono"
              >
                {spaces}s
              </Button>
            ))}
          </div>
        </div>

        {/* Right Actions: Sample, Upload, Copy, Download, Clear */}
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setInput(SAMPLE_JSON);
              toast.info("Loaded sample JSON");
            }}
            className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
            title="Load Sample JSON"
          >
            <FileCode className="w-3.5 h-3.5 mr-1.5" />
            <span>Sample</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
            title="Upload JSON File"
          >
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            <span>Upload</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!output}
            onClick={handleCopy}
            className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-40"
            title="Copy Formatted JSON"
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
            title="Download formatted.json"
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

      {/* Validation Status / Error Banner */}
      {status === "error" && errorMessage && (
        <div className="flex items-start gap-3 p-4 rounded-xl border bg-rose-500/10 border-rose-500/30 text-rose-500 font-mono text-xs shadow-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-rose-500">Invalid JSON Syntax</div>
            <div className="mt-1 opacity-90 leading-relaxed">{errorMessage}</div>
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="flex items-center gap-2 p-3 px-4 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-500 font-semibold text-xs shadow-xs">
          <CheckCircle2 className="w-4 h-4" />
          <span>Valid JSON Syntax</span>
        </div>
      )}

      {/* Editors Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CodeEditor
          title="Raw / Unformatted JSON"
          badge="Raw Input"
          value={input}
          onChange={setInput}
          language="json"
          placeholder="Paste your unformatted JSON payload here..."
          height="420px"
          onCopy={() => {
            navigator.clipboard.writeText(input);
            toast.success("Copied raw input!");
          }}
        />

        <CodeEditor
          title="Formatted JSON Result"
          badge="Formatted"
          value={output}
          readOnly
          language="json"
          placeholder="Formatted JSON result will appear here..."
          height="420px"
          onCopy={handleCopy}
          onDownload={handleDownload}
        />
      </div>

      {/* SEO Rich Explanation Content */}
      <ToolExplanation
        title="JSON Formatter & Beautifier"
        description="JSON (JavaScript Object Notation) is the standard data format for modern web APIs, microservices, and databases. Our free online JSON Formatter allows software engineers to format, validate, beautify, and inspect JSON payloads instantly in the browser."
        howToUse={[
          "Paste your unformatted JSON data into the left code editor, or click Upload to select a .json file.",
          "Select your preferred indentation spacing (2, 4, or 8 spaces). Formatting applies instantly.",
          "Check the validation indicator to confirm syntax validity. Any parsing errors will highlight exact error details.",
          "Click Copy to copy the formatted result, or click Download to save formatted.json to your computer.",
        ]}
        features={[
          "Instant client-side formatting with zero latency or API roundtrips.",
          "Monaco Code Editor integration with syntax highlighting, line numbers, and error detection.",
          "Minify option to strip whitespace for production payloads.",
          "File upload and download support for large JSON datasets.",
          "100% private: Data never leaves your web browser.",
        ]}
        faqs={[
          {
            question: "Why should I use a JSON Formatter?",
            answer:
              "Minified or raw API JSON responses are often printed on a single dense line, making them hard to read and debug. Formatting adds structured indentation and line breaks for effortless inspection.",
          },
          {
            question: "Is my JSON data secure when using TechWebCode?",
            answer:
              "Yes, absolutely! All JSON parsing, formatting, and minification runs entirely inside your browser's JavaScript engine. No data is transmitted to external servers.",
          },
          {
            question: "What happens if my JSON has syntax errors?",
            answer:
              "The tool identifies syntax errors with precise error messages so you can fix unquoted keys, trailing commas, or unmatched brackets instantly.",
          },
          {
            question: "Does formatting change the JSON data structure?",
            answer:
              "No. Formatting only adjusts whitespace and indentation to make the payload human-readable. Object key-value pairs and array values remain completely unchanged.",
          },
        ]}
      />

      {/* Interlinking Related Tools */}
      <RelatedTools currentSlug="json-formatter" />
    </div>
  );
}
