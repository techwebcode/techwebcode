"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { X } from "lucide-react";

import ToolLayout from "@/components/tool/ToolLayout";
import ToolHeader from "@/components/tool/ToolHeader";
import YamlFormatterToolbar from "./YamlFormatterToolbar";
import YamlStatus from "./YamlStatus";
import CodeEditor from "../json-formatter/CodeEditor";
import { Button } from "@/components/ui/button";

import {
  formatYaml,
  validateYaml,
  decodeK8sSecrets,
  encodeK8sSecrets,
  yamlToJson,
  downloadYamlFile,
} from "./yaml.utils";
import SAMPLE_YAML from "./YamlSample";
import { Tool } from "@/types/tools";

interface Props {
  tool: Tool;
}

export default function YamlFormatter({ tool }: Props) {
  const [input, setInput] = useState(SAMPLE_YAML);
  const [output, setOutput] = useState("");
  const [outputLanguage, setOutputLanguage] = useState("yaml");
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

    const res = validateYaml(input);
    setValidation(res);

    if (res.valid) {
      try {
        const indentVal = parseInt(indent, 10);
        setOutput(formatYaml(input, indentVal));
        setOutputLanguage("yaml");
      } catch {
        // Fallback
      }
    }
  }, [input, indent]);

  // Body scroll lock & Escape key
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
      toast.error("Please enter YAML to format");
      return;
    }
    try {
      const indentVal = parseInt(indent, 10);
      const formatted = formatYaml(input, indentVal);
      setOutput(formatted);
      setOutputLanguage("yaml");
      setValidation({ valid: true });
      toast.success("YAML Formatted Successfully");
    } catch (e) {
      setValidation({ valid: false, error: (e as Error).message });
      toast.error("Invalid YAML syntax");
    }
  }

  function handleDecodeSecrets() {
    if (!input.trim()) {
      toast.error("Please enter YAML to decode secrets");
      return;
    }
    try {
      const decoded = decodeK8sSecrets(input);
      setOutput(decoded);
      setOutputLanguage("yaml");
      setValidation({ valid: true });
      toast.success("Base64 K8s Secrets Decoded Successfully");
    } catch (e) {
      toast.error(`Secret decoding failed: ${(e as Error).message}`);
    }
  }

  function handleEncodeSecrets() {
    if (!input.trim()) {
      toast.error("Please enter YAML to encode secrets");
      return;
    }
    try {
      const encoded = encodeK8sSecrets(input);
      setOutput(encoded);
      setOutputLanguage("yaml");
      setValidation({ valid: true });
      toast.success("Plaintext Secrets Encoded to Base64");
    } catch (e) {
      toast.error(`Secret encoding failed: ${(e as Error).message}`);
    }
  }

  function handleToJson() {
    if (!input.trim()) {
      toast.error("Please enter YAML content");
      return;
    }
    try {
      const jsonStr = yamlToJson(input);
      setOutput(jsonStr);
      setOutputLanguage("json");
      toast.success("Converted YAML to JSON");
    } catch (e) {
      toast.error(`YAML to JSON failed: ${(e as Error).message}`);
    }
  }

  function handleLoadSample() {
    setInput(SAMPLE_YAML);
    toast.info("Sample K8s Secret YAML Loaded");
  }

  function handleFileUpload(content: string) {
    setInput(content);
    toast.success("YAML File Loaded");
  }

  function handleDownload() {
    const textToDownload = output || input;
    if (!textToDownload.trim()) {
      toast.error("No content to download");
      return;
    }
    const ext = outputLanguage === "json" ? "data.json" : "formatted-config.yaml";
    downloadYamlFile(ext, textToDownload);
    toast.success("File Downloaded");
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
            YAML Formatter & Kubernetes Secret Tool
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
        <YamlFormatterToolbar
          onFormat={handleFormat}
          onDecodeSecrets={handleDecodeSecrets}
          onEncodeSecrets={handleEncodeSecrets}
          onToJson={handleToJson}
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

        <YamlStatus valid={validation.valid} error={validation.error} value={input} />

        {/* Grid Editors Filling Full Screen */}
        <div className="flex-1 grid gap-4 lg:grid-cols-2 min-h-0">
          <div className="flex flex-col space-y-2 h-full">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Input YAML</span>
              <span>Raw Editor</span>
            </div>
            <CodeEditor
              language="yaml"
              value={input}
              onChange={setInput}
              height={editorHeight}
            />
          </div>

          <div className="flex flex-col space-y-2 h-full">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Result ({outputLanguage.toUpperCase()})</span>
              <span>Output View</span>
            </div>
            <CodeEditor
              language={outputLanguage}
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
        <YamlFormatterToolbar
          onFormat={handleFormat}
          onDecodeSecrets={handleDecodeSecrets}
          onEncodeSecrets={handleEncodeSecrets}
          onToJson={handleToJson}
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

        <YamlStatus valid={validation.valid} error={validation.error} value={input} />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Input YAML</span>
              <span>Raw Editor</span>
            </div>
            <CodeEditor
              language="yaml"
              value={input}
              onChange={setInput}
              height="520px"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Result ({outputLanguage.toUpperCase()})</span>
              <span>Output View</span>
            </div>
            <CodeEditor
              language={outputLanguage}
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
