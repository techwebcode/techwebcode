"use client";

import React, { useState, useEffect } from "react";
import ToolHeader from "@/components/tool/ToolHeader";
import CodeEditor from "@/components/tool/CodeEditor";
import ToolExplanation from "@/components/tool/ToolExplanation";
import RelatedTools from "@/components/tool/RelatedTools";
import { Tool } from "@/types/tools";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, FileCode, Trash2, Check, Copy } from "lucide-react";
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
      setErrorDetails(err.message || "Invalid JSON syntax");
    }
  };

  useEffect(() => {
    validateJson(input);
  }, [input]);

  const handleClear = () => {
    setInput("");
    setIsValid(null);
    setErrorDetails("");
  };

  const handleCopy = () => {
    if (!input) return;
    navigator.clipboard.writeText(input);
    setCopied(true);
    toast.success("Copied input to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <ToolHeader tool={tool} />

      {/* Main Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/40 p-3 rounded-2xl border border-border">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => validateJson(input)}
            className="h-8 text-xs font-semibold gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Validate JSON</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setInput(SAMPLE_VALID);
              toast.info("Loaded valid sample JSON");
            }}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            <FileCode className="w-3.5 h-3.5 mr-1" />
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
            className="h-8 text-xs text-rose-500 border-rose-500/20 hover:bg-rose-500/10"
          >
            <XCircle className="w-3.5 h-3.5 mr-1" />
            <span>Invalid Sample</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!input}
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
            onClick={handleClear}
            className="h-8 text-xs text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            <span>Clear</span>
          </Button>
        </div>
      </div>

      {/* Validation Status Banners */}
      {isValid === true && (
        <div className="flex items-center gap-3 p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-500 font-semibold text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Valid JSON Structure! Zero syntax errors detected in input payload.</span>
        </div>
      )}

      {isValid === false && (
        <div className="flex items-start gap-3 p-4 rounded-xl border bg-rose-500/10 border-rose-500/30 text-rose-500 font-semibold text-sm">
          <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <div>Invalid JSON Syntax Detected</div>
            <div className="mt-1 font-mono text-xs opacity-90">{errorDetails}</div>
          </div>
        </div>
      )}

      {/* Code Editor */}
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
          JSON Payload to Validate
        </span>
        <CodeEditor
          value={input}
          onChange={setInput}
          language="json"
          placeholder="Paste JSON string here to validate syntax..."
          height="420px"
        />
      </div>

      {/* SEO Rich Explanation Content */}
      <ToolExplanation
        title="JSON Syntax Validator"
        description="JSON validation ensures that configuration files, API requests, and web service payloads strictly adhere to the RFC 8259 JSON specification before deployment or processing."
        howToUse={[
          "Paste your JSON payload into the code editor above.",
          "Click the Validate JSON button (or type directly to trigger instant validation).",
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
