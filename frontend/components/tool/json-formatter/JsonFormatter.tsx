"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { X } from "lucide-react";

import ToolLayout from "@/components/tool/ToolLayout";
import ToolHeader from "@/components/tool/ToolHeader";
import JsonFormatterToolbar from "./JsonFormatterToolbar";
import JsonStatus from "./JsonStatus";
import CodeEditor from "./CodeEditor";
import { Button } from "@/components/ui/button";

import { formatJson, minifyJson, validateJson, repairJson, downloadJsonFile } from "./json.utils";
import SAMPLE_JSON from "./JsonSample";
import { Tool } from "@/types/tools";

interface Props {
  tool: Tool;
}

export default function JsonFormatter({ tool }: Props) {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState("2");
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [validation, setValidation] = useState<{ valid: boolean; error?: string }>({ valid: true });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!input.trim()) {
      setValidation({ valid: false });
      setOutput("");
      return;
    }

    const res = validateJson(input);
    setValidation(res);

    if (res.valid) {
      try {
        const indentVal = indent === "tab" ? "tab" : parseInt(indent, 10);
        setOutput(formatJson(input, indentVal));
      } catch {
        // Fallback
      }
    }
  }, [input, indent]);

  // Escape key exits expanded mode & prevent body scroll
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      }
    }
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded]);

  function handleFormat() {
    if (!input.trim()) {
      toast.error("Please enter JSON to format");
      return;
    }
    try {
      const indentVal = indent === "tab" ? "tab" : parseInt(indent, 10);
      const formatted = formatJson(input, indentVal);
      setOutput(formatted);
      setValidation({ valid: true });
      toast.success("JSON Formatted Successfully");
    } catch (e) {
      setValidation({ valid: false, error: (e as Error).message });
      toast.error("Invalid JSON syntax");
    }
  }

  function handleMinify() {
    if (!input.trim()) {
      toast.error("Please enter JSON to minify");
      return;
    }
    try {
      const minified = minifyJson(input);
      setOutput(minified);
      setValidation({ valid: true });
      toast.success("JSON Minified Successfully");
    } catch (e) {
      setValidation({ valid: false, error: (e as Error).message });
      toast.error("Invalid JSON syntax");
    }
  }

  function handleAutoFix() {
    if (!input.trim()) return;
    try {
      const repaired = repairJson(input);
      setInput(repaired);
      setOutput(repaired);
      setValidation({ valid: true });
      toast.success("Auto-fixed missing commas, quotes, and syntax errors!");
    } catch (e) {
      toast.error(`Auto-fix failed: ${(e as Error).message}`);
    }
  }

  function handleLoadSample() {
    setInput(SAMPLE_JSON);
    toast.info("Sample JSON Loaded");
  }

  function handleFileUpload(content: string) {
    setInput(content);
    toast.success("JSON File Loaded");
  }

  function handleDownload() {
    const textToDownload = output || input;
    if (!textToDownload.trim()) {
      toast.error("No JSON content to download");
      return;
    }
    downloadJsonFile("formatted-data.json", textToDownload);
    toast.success("JSON File Downloaded");
  }

  async function handleCopy() {
    const textToCopy = output || input;
    if (!textToCopy.trim()) {
      toast.error("No content to copy");
      return;
    }
    await navigator.clipboard.writeText(textToCopy);
    toast.success("Copied to Clipboard");
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setValidation({ valid: false });
    toast.info("Editor Cleared");
  }

  const editorHeight = isExpanded ? "calc(100vh - 240px)" : "520px";

  const fullscreenOverlay = isExpanded && mounted ? createPortal(
    <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-[999999] w-screen h-screen bg-slate-50 dark:bg-zinc-950 p-6 flex flex-col space-y-4 overflow-hidden text-foreground opacity-100 shadow-2xl">
      {/* Expanded Header Bar */}
      <div className="flex items-center justify-between border-b pb-4 mb-2">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg tracking-tight text-foreground">
            JSON Formatter & Validator
          </span>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            Fullscreen Mode
          </span>
        </div>

        <div className="flex items-center gap-3">
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border bg-muted px-2 py-0.5 text-[10px] font-mono font-medium text-muted-foreground">
            ESC to exit
          </kbd>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="rounded-xl gap-2 text-xs font-medium border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <X className="h-4 w-4" />
            Exit Fullscreen
          </Button>
        </div>
      </div>

      <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
        <JsonFormatterToolbar
          onFormat={handleFormat}
          onMinify={handleMinify}
          onAutoFix={handleAutoFix}
          onLoadSample={handleLoadSample}
          onFileUpload={handleFileUpload}
          onDownload={handleDownload}
          onCopy={handleCopy}
          onClear={handleClear}
          onToggleExpand={() => setIsExpanded(false)}
          isExpanded={true}
          indent={indent}
          onIndentChange={setIndent}
        />

        <JsonStatus valid={validation.valid} error={validation.error} value={input} />

        {/* Grid Editors Filling Full Screen */}
        <div className="flex-1 grid gap-4 lg:grid-cols-2 min-h-0">
          <div className="flex flex-col space-y-2 h-full">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Input JSON</span>
              <span>Raw Editor</span>
            </div>
            <CodeEditor
              language="json"
              value={input}
              onChange={setInput}
              height={editorHeight}
            />
          </div>

          <div className="flex flex-col space-y-2 h-full">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Formatted Output</span>
              <span>Read-Only View</span>
            </div>
            <CodeEditor
              language="json"
              value={output}
              onChange={() => {}}
              readOnly
              height={editorHeight}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <ToolLayout>
      <ToolHeader tool={tool} />

      {fullscreenOverlay}

      {/* Standard In-Page Mode */}
      <div className="space-y-4">
        <JsonFormatterToolbar
          onFormat={handleFormat}
          onMinify={handleMinify}
          onAutoFix={handleAutoFix}
          onLoadSample={handleLoadSample}
          onFileUpload={handleFileUpload}
          onDownload={handleDownload}
          onCopy={handleCopy}
          onClear={handleClear}
          onToggleExpand={() => setIsExpanded(true)}
          isExpanded={false}
          indent={indent}
          onIndentChange={setIndent}
        />

        <JsonStatus valid={validation.valid} error={validation.error} value={input} />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Input JSON</span>
              <span>Raw Editor</span>
            </div>
            <CodeEditor
              language="json"
              value={input}
              onChange={setInput}
              height="520px"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Formatted Output</span>
              <span>Read-Only View</span>
            </div>
            <CodeEditor
              language="json"
              value={output}
              onChange={() => {}}
              readOnly
              height="520px"
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}