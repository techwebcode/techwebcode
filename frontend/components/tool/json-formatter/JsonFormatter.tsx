"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import ToolWorkspaceShell from "@/components/tool/workspace/ToolWorkspaceShell";
import EditorOutputWorkspace from "@/components/tool/workspace/EditorOutputWorkspace";

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
  const [validation, setValidation] = useState<{ valid: boolean; error?: string }>({ valid: true });

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

  return (
    <ToolWorkspaceShell
      tool={tool}
      valid={validation.valid}
      error={validation.error}
      input={input}
      output={output}
      indent={indent}
      onIndentChange={setIndent}
      onFormat={handleFormat}
      onMinify={handleMinify}
      onValidate={handleValidate}
      onLoadSample={handleLoadSample}
      onFileUpload={handleFileUpload}
      onCopy={handleCopy}
      onDownload={handleDownload}
    >
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
    </ToolWorkspaceShell>
  );
}