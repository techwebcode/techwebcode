"use client";

import React, { useState, useEffect, useRef } from "react";
import ToolHeader from "@/components/tool/ToolHeader";
import CodeEditor from "@/components/tool/CodeEditor";
import ToolExplanation from "@/components/tool/ToolExplanation";
import RelatedTools from "@/components/tool/RelatedTools";
import { Tool } from "@/types/tools";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, FileCode, Trash2, Check, Copy, X } from "lucide-react";
import { toast } from "sonner";

interface Props {
  tool: Tool;
}

const SAMPLE_VALID = `{
  "status": "success",
  "code": 200,
  "data": {
    "user": "developer",
    "roles": ["admin", "editor"]
  }
}`;

const SAMPLE_INVALID = `{
  "status": "error",
  code: 500,
  "message": "Missing quotes around key name",
}`;

export default function JsonValidator({ tool }: Props) {
  const [input, setInput] = useState(SAMPLE_VALID);
  const [isValid, setIsValid] = useState<boolean | null>(true);
  const [errorDetails, setErrorDetails] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const validateJson = (text: string = input) => {
    if (!text.trim()) {
      setIsValid(null);
      setErrorDetails("");
      return;
    }

    try {
      JSON.parse(text);
      setIsValid(true);
      setErrorDetails("");
    } catch (err: any) {
      setIsValid(false);
      setErrorDetails(err.message || "Invalid JSON syntax structure");
    }
  };

  useEffect(() => {
    validateJson(input);
  }, [input]);

  // Keyboard shortcut listener: Ctrl+Enter / Cmd+Enter -> Validate JSON
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        validateJson(input);
        toast.info("JSON Validated (Ctrl+Enter)");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [input]);

  const handleClearClick = () => {
    if (input.trim()) {
      setShowClearConfirm(true);
    } else {
      executeClear();
    }
  };

  const executeClear = () => {
    setInput("");
    setIsValid(null);
    setErrorDetails("");
    setShowClearConfirm(false);
    toast.info("Cleared JSON editor");
  };

  const handleCopy = () => {
    if (!input) return;
    navigator.clipboard.writeText(input);
    setCopied(true);
    toast.success("Copied input payload to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <ToolHeader tool={tool} />

      {/* Main Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-sm">
        {/* Left Actions: Validate, Valid Sample, Invalid Sample */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => validateJson(input)}
            className="h-9 px-4 text-xs font-semibold gap-2 shadow-sm focus-visible:ring-2 focus-visible:ring-primary"
            title="Validate JSON (Ctrl+Enter)"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Validate JSON</span>
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-primary-foreground/80 bg-primary-foreground/15 rounded border border-primary-foreground/20 ml-1">
              Ctrl+Enter
            </kbd>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setInput(SAMPLE_VALID);
              toast.info("Loaded valid sample JSON");
            }}
            className="h-9 text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
          >
            <FileCode className="w-3.5 h-3.5 mr-1.5" />
            <span>Valid Sample</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setInput(SAMPLE_INVALID);
              toast.info("Loaded invalid sample JSON");
            }}
            className="h-9 text-xs font-medium text-rose-500 border-rose-500/20 hover:bg-rose-500/10 hover:text-rose-600 focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            <XCircle className="w-3.5 h-3.5 mr-1.5" />
            <span>Invalid Sample</span>
          </Button>
        </div>

        {/* Right Actions: Copy, Clear */}
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!input}
            onClick={handleCopy}
            className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-40"
            title="Copy Input Payload"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 mr-1.5" />
            )}
            <span>{copied ? "Copied!" : "Copy"}</span>
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
              disabled={!input}
              className="h-9 px-2.5 text-xs text-muted-foreground hover:text-destructive focus-visible:ring-2 focus-visible:ring-destructive disabled:opacity-40"
              title="Clear JSON Editor"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="sr-only">Clear</span>
            </Button>
          )}
        </div>
      </div>

      {/* Validation Status Banners */}
      {isValid === true && (
        <div className="flex items-center gap-3 p-3.5 px-4 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-500 font-semibold text-xs shadow-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Valid JSON Structure! Zero syntax errors detected in input payload.</span>
        </div>
      )}

      {isValid === false && (
        <div className="flex items-start gap-3 p-4 rounded-xl border bg-rose-500/10 border-rose-500/30 text-rose-500 font-mono text-xs shadow-xs">
          <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-rose-500">Invalid JSON Syntax Detected</div>
            <div className="mt-1 opacity-90 leading-relaxed">{errorDetails}</div>
          </div>
        </div>
      )}

      {/* Code Editor */}
      <CodeEditor
        title="JSON Payload to Validate"
        badge={isValid === true ? "Valid" : isValid === false ? "Syntax Error" : "Payload"}
        value={input}
        onChange={setInput}
        language="json"
        placeholder="Paste JSON string here to validate syntax..."
        height="440px"
        onCopy={handleCopy}
      />

      {/* SEO Rich Explanation Content */}
      <ToolExplanation
        title="JSON Syntax Validator"
        description="JSON validation ensures that configuration files, API requests, and web service payloads strictly adhere to the RFC 8259 JSON specification before deployment or processing."
        howToUse={[
          "Paste your JSON payload into the code editor above.",
          "Click the Validate JSON button (or press Ctrl+Enter).",
          "Review the validation banner. If invalid, read the precise error message to fix missing quotes or trailing commas.",
        ]}
        features={[
          "Instant syntax validation against standard RFC 8259 specifications.",
          "Detailed parse error reporting identifying invalid tokens and unexpected characters.",
          "Monaco Code Editor integration with line numbers for rapid debugging.",
          "100% Client-Side execution guarantees complete data privacy.",
        ]}
        faqs={[
          {
            question: "What are the most common JSON validation errors?",
            answer:
              "The top JSON syntax errors include: unquoted key names (e.g. key: 'val' instead of \"key\": \"val\"), trailing commas after the last element in an array or object, single quotes instead of double quotes, and unescaped line breaks inside string values.",
          },
          {
            question: "Can JSON property keys use single quotes?",
            answer:
              "No. The RFC 8259 JSON specification strictly mandates double quotes (\"key\") for all object property names. Single quotes ('key') will cause a syntax error.",
          },
          {
            question: "Are trailing commas allowed in JSON arrays or objects?",
            answer:
              "No. Unlike JavaScript object literals, trailing commas after the final element in an array or object are invalid in standard JSON syntax.",
          },
          {
            question: "Does JSON validation send my payload to a server?",
            answer:
              "No. Validation executes 100% locally in your web browser using JavaScript's native engine. Your data remains completely private and secure.",
          },
        ]}
      />

      {/* Interlinking Related Tools */}
      <RelatedTools currentSlug="json-validator" />
    </div>
  );
}
