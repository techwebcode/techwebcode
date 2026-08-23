"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Tool } from "@/types/tools";
import ToolHeader from "@/components/tool/ToolHeader";
import RelatedTools from "@/components/tool/RelatedTools";
import ToolExplanation from "@/components/tool/ToolExplanation";
import FullScreenWorkspace from "@/components/tool/workspace/FullScreenWorkspace";
import ToolWorkspaceHeader from "@/components/tool/workspace/ToolWorkspaceHeader";
import ToolDiagnosticsBar from "@/components/tool/workspace/ToolDiagnosticsBar";
import ClientSidePrivacyNotice from "@/components/tool/workspace/ClientSidePrivacyNotice";
import EditorOutputWorkspace from "@/components/tool/workspace/EditorOutputWorkspace";
import { Button } from "@/components/ui/button";
import { Maximize2, ShieldCheck } from "lucide-react";

import { formatJson, minifyJson, validateJson, downloadJsonFile } from "./json.utils";
import SAMPLE_JSON from "./JsonSample";

interface Props {
  tool: Tool;
}

export default function JsonFormatter({ tool }: Props) {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState("2");
  const [validation, setValidation] = useState<{ valid: boolean; error?: string }>({ valid: true });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isToolsPanelOpen, setIsToolsPanelOpen] = useState(false);
  const [isHelpPanelOpen, setIsHelpPanelOpen] = useState(false);

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

  function handleValidate() {
    if (!input.trim()) {
      toast.error("Please enter JSON to validate");
      return;
    }
    const res = validateJson(input);
    setValidation(res);
    if (res.valid) {
      toast.success("JSON syntax is valid!");
    } else {
      toast.error(`Invalid JSON: ${res.error || "Syntax error"}`);
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

  function handleSwap() {
    if (!output.trim()) return;
    const prevInput = input;
    setInput(output);
    setOutput(prevInput);
    toast.info("Swapped Input & Output");
  }

  if (isFullscreen) {
    return (
      <FullScreenWorkspace
        isOpen={true}
        onClose={() => setIsFullscreen(false)}
        title={tool.name}
        badge="Full Screen Workspace"
      >
        <div className="flex-1 flex flex-col space-y-3 min-h-0 overflow-y-auto w-full h-full pr-1">
          {/* Workspace Action Toolbar */}
          <ToolWorkspaceHeader
            title={tool.name}
            isToolsPanelOpen={isToolsPanelOpen}
            onToggleToolsPanel={() => setIsToolsPanelOpen(!isToolsPanelOpen)}
            isHelpPanelOpen={isHelpPanelOpen}
            onToggleHelpPanel={() => setIsHelpPanelOpen(!isHelpPanelOpen)}
            isFullscreen={true}
            onToggleFullscreen={() => setIsFullscreen(false)}
            onFormat={handleFormat}
            onMinify={handleMinify}
            onValidate={handleValidate}
            indent={indent}
            onIndentChange={setIndent}
            onLoadSample={handleLoadSample}
            onFileUpload={handleFileUpload}
            onCopy={handleCopy}
            onDownload={handleDownload}
          />

          {/* Diagnostics Status Bar */}
          <ToolDiagnosticsBar
            valid={validation.valid}
            error={validation.error}
            value={input}
          />

          {/* Privacy Guarantee Strip */}
          <ClientSidePrivacyNotice />

          {/* Main Dual Editor Workspace Container */}
          <div className="flex-1 min-h-0 w-full overflow-hidden flex flex-col">
            <EditorOutputWorkspace
              input={input}
              output={output}
              onInputChange={setInput}
              language="json"
              inputTitle="RAW / UNFORMATTED JSON"
              outputTitle="FORMATTED JSON RESULT"
              inputBadge="Input"
              outputBadge="Output"
              height="calc(100vh - 280px)"
              onSwap={handleSwap}
              onCopyOutput={handleCopy}
              onDownloadOutput={handleDownload}
            />
          </div>
        </div>
      </FullScreenWorkspace>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* 1. Header Toolbar in Normal Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <ToolHeader tool={tool} />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsFullscreen(true)}
          className="h-9 px-3 text-xs font-medium gap-1.5 self-start sm:self-auto shrink-0"
        >
          <Maximize2 className="w-4 h-4" />
          <span>Full Screen Workspace</span>
        </Button>
      </div>

      {/* 2. Privacy Guarantee Notice */}
      <ClientSidePrivacyNotice />

      {/* 3. Action Toolbar */}
      <ToolWorkspaceHeader
        title={tool.name}
        isToolsPanelOpen={isToolsPanelOpen}
        onToggleToolsPanel={() => setIsToolsPanelOpen(!isToolsPanelOpen)}
        isHelpPanelOpen={isHelpPanelOpen}
        onToggleHelpPanel={() => setIsHelpPanelOpen(!isHelpPanelOpen)}
        isFullscreen={false}
        onToggleFullscreen={() => setIsFullscreen(true)}
        onFormat={handleFormat}
        onMinify={handleMinify}
        onValidate={handleValidate}
        indent={indent}
        onIndentChange={setIndent}
        onLoadSample={handleLoadSample}
        onFileUpload={handleFileUpload}
        onCopy={handleCopy}
        onDownload={handleDownload}
      />

      {/* 4. Diagnostics Status Bar */}
      <ToolDiagnosticsBar
        valid={validation.valid}
        error={validation.error}
        value={input}
      />

      {/* 5. Dual Editor Workspace */}
      <EditorOutputWorkspace
        input={input}
        output={output}
        onInputChange={setInput}
        language="json"
        inputTitle="RAW / UNFORMATTED JSON"
        outputTitle="FORMATTED JSON RESULT"
        inputBadge="Input"
        outputBadge="Output"
        height="520px"
        onSwap={handleSwap}
        onCopyOutput={handleCopy}
        onDownloadOutput={handleDownload}
      />

      {/* 6. Related Tools & SEO Explanation */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-8">
        <RelatedTools currentSlug={tool.slug} />
        <ToolExplanation
          title={tool.name}
          description={tool.description || tool.shortDescription || "Format and beautify JSON online."}
          howToUse={[
            "Paste or upload your raw payload into the input editor.",
            "Click Format, Minify, or Validate to process your JSON data.",
            "Inspect syntax error messages if your JSON is invalid.",
            "1-click Copy or Download the formatted JSON result.",
          ]}
          features={[
            "100% Client-Side Processing: Your data never leaves your browser.",
            "Line-by-line syntax validation and diagnostic error jumping.",
            "Monaco Code Editor with syntax highlighting and line numbers.",
            "One-click Copy, Sample JSON loading, and File Upload / Download.",
          ]}
          faqs={[
            {
              question: `Is ${tool.name} free to use?`,
              answer: `Yes! ${tool.name} is 100% free with no login or account required.`,
            },
            {
              question: "Is my data safe and private?",
              answer: "Absolutely. All processing happens locally in your web browser using client-side JavaScript. No data is sent to our servers.",
            },
          ]}
        />
      </div>
    </div>
  );
}