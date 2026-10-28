"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolInput from "@/components/tool/ToolInput";
import ToolOutput from "@/components/tool/ToolOutput";
import { Tool } from "@/types/tools";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, FileText, Trash2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface Props {
  tool: Tool;
}

const SAMPLE_COMPONENT_PLAIN = "search query with spaces & special characters: \"hello\" + 'world' / 2026? 🚀";
const SAMPLE_COMPONENT_ENCODED = "search%20query%20with%20spaces%20%26%20special%20characters%3A%20%22hello%22%20%2B%20%27world%27%20%2F%202026%3F%20%F0%9F%9A%80";

const SAMPLE_FULL_PLAIN = "https://techwebcode.in/search?q=developer tools & category=web development 🚀";
const SAMPLE_FULL_ENCODED = "https://techwebcode.in/search?q=developer%20tools%20&%20category=web%20development%20%F0%9F%9A%80";

export default function UrlEncoder({ tool }: Props) {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [encodeScope, setEncodeScope] = useState<"component" | "full">("component");
  const [input, setInput] = useState<string>(SAMPLE_COMPONENT_PLAIN);
  const [output, setOutput] = useState<string>(() => encodeURIComponent(SAMPLE_COMPONENT_PLAIN));
  const [status, setStatus] = useState<"idle" | "success" | "error">("success");
  const [errorMsg, setErrorMsg] = useState("");

  const processUrl = useCallback(
    (text: string, currentMode: "encode" | "decode", scope: "component" | "full") => {
      if (!text.trim()) {
        setOutput("");
        setStatus("idle");
        setErrorMsg("");
        return;
      }

      try {
        let result = "";
        if (currentMode === "encode") {
          result = scope === "component" ? encodeURIComponent(text) : encodeURI(text);
        } else {
          result = scope === "component" ? decodeURIComponent(text) : decodeURI(text);
        }
        setOutput(result);
        setStatus("success");
        setErrorMsg("");
      } catch (err: unknown) {
        setOutput("");
        setStatus("error");
        const msg = err instanceof Error ? err.message : "Malformed URI sequence";
        if (msg.toLowerCase().includes("malformed")) {
          setErrorMsg(
            "Malformed percent-encoded URI: invalid escape sequence detected. Verify that percent characters (%) are followed by valid two-digit hexadecimal codes (e.g. %20 for space)."
          );
        } else {
          setErrorMsg(msg);
        }
      }
    },
    []
  );

  const debouncedInput = useDebounce(input, 200);

  useEffect(() => {
    processUrl(debouncedInput, mode, encodeScope);
  }, [debouncedInput, mode, encodeScope, processUrl]);

  // Mode change handler
  const handleModeChange = (newMode: "encode" | "decode") => {
    setMode(newMode);
    // Switch to corresponding sample if currently showing sample
    if (newMode === "decode") {
      if (input === SAMPLE_COMPONENT_PLAIN) {
        setInput(SAMPLE_COMPONENT_ENCODED);
        processUrl(SAMPLE_COMPONENT_ENCODED, "decode", encodeScope);
      } else if (input === SAMPLE_FULL_PLAIN) {
        setInput(SAMPLE_FULL_ENCODED);
        processUrl(SAMPLE_FULL_ENCODED, "decode", encodeScope);
      } else {
        processUrl(input, newMode, encodeScope);
      }
    } else {
      if (input === SAMPLE_COMPONENT_ENCODED) {
        setInput(SAMPLE_COMPONENT_PLAIN);
        processUrl(SAMPLE_COMPONENT_PLAIN, "encode", encodeScope);
      } else if (input === SAMPLE_FULL_ENCODED) {
        setInput(SAMPLE_FULL_PLAIN);
        processUrl(SAMPLE_FULL_PLAIN, "encode", encodeScope);
      } else {
        processUrl(input, newMode, encodeScope);
      }
    }
  };

  // Scope change handler (Component vs Full URL)
  const handleScopeChange = (newScope: "component" | "full") => {
    setEncodeScope(newScope);
    // If showing component sample, switch to full url sample and vice-versa
    if (newScope === "full" && (input === SAMPLE_COMPONENT_PLAIN || input === SAMPLE_COMPONENT_ENCODED)) {
      const sample = mode === "encode" ? SAMPLE_FULL_PLAIN : SAMPLE_FULL_ENCODED;
      setInput(sample);
      processUrl(sample, mode, "full");
    } else if (newScope === "component" && (input === SAMPLE_FULL_PLAIN || input === SAMPLE_FULL_ENCODED)) {
      const sample = mode === "encode" ? SAMPLE_COMPONENT_PLAIN : SAMPLE_COMPONENT_ENCODED;
      setInput(sample);
      processUrl(sample, mode, "component");
    } else {
      processUrl(input, mode, newScope);
    }
    toast.info(`Switched to ${newScope === "component" ? "Component Mode (encodeURIComponent)" : "Full URL Mode (encodeURI)"}`);
  };

  // Swap Direction Handler
  const handleSwap = () => {
    const nextMode = mode === "encode" ? "decode" : "encode";
    const defaultSample =
      encodeScope === "component"
        ? nextMode === "encode"
          ? SAMPLE_COMPONENT_PLAIN
          : SAMPLE_COMPONENT_ENCODED
        : nextMode === "encode"
        ? SAMPLE_FULL_PLAIN
        : SAMPLE_FULL_ENCODED;

    const nextInput = output || defaultSample;
    setMode(nextMode);
    setInput(nextInput);
    processUrl(nextInput, nextMode, encodeScope);
    toast.info(`Swapped to URL ${nextMode === "encode" ? "Encoder" : "Decoder"}`);
  };

  // Clear Handler
  const handleClear = () => {
    setInput("");
    setOutput("");
    setStatus("idle");
    setErrorMsg("");
    toast.info("Cleared editor input and output.");
  };

  // Load Example Handler
  const handleLoadExample = () => {
    let example = "";
    if (encodeScope === "component") {
      example = mode === "encode" ? SAMPLE_COMPONENT_PLAIN : SAMPLE_COMPONENT_ENCODED;
    } else {
      example = mode === "encode" ? SAMPLE_FULL_PLAIN : SAMPLE_FULL_ENCODED;
    }
    setInput(example);
    processUrl(example, mode, encodeScope);
    toast.info(`Loaded ${mode === "encode" ? "Plain" : "Percent-encoded"} ${encodeScope} example.`);
  };

  // Action Click Handler
  const handleActionClick = () => {
    processUrl(input, mode, encodeScope);
    if (!input.trim()) {
      toast.info(`Please enter text to ${mode === "encode" ? "encode" : "decode"}.`);
    } else {
      toast.success(`URL ${mode === "encode" ? "encoded" : "decoded"} successfully!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <ToolHeader
        tool={tool}
        title="URL Encoder & Decoder"
        description="Encode URLs or decode URL-encoded text online. Use this free URL encoding and decoding tool for quick, reliable results."
      />

      {/* Main Mode & Scope Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/40 p-3 rounded-2xl border border-border">
        <div className="flex flex-wrap items-center gap-2">
          {/* Segmented Control: Mode */}
          <div className="flex items-center gap-1 p-1 bg-muted/80 rounded-xl border border-border/60">
            <button
              type="button"
              onClick={() => handleModeChange("encode")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === "encode"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-pressed={mode === "encode"}
            >
              URL Encode
            </button>

            <button
              type="button"
              onClick={() => handleModeChange("decode")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === "decode"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-pressed={mode === "decode"}
            >
              URL Decode
            </button>
          </div>

          <div className="h-4 w-px bg-border mx-1 hidden sm:block" />

          {/* Segmented Control: Scope */}
          <div className="flex items-center gap-1 p-1 bg-muted/80 rounded-xl border border-border/60">
            <button
              type="button"
              onClick={() => handleScopeChange("component")}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                encodeScope === "component"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Encodes all reserved characters (encodeURIComponent) - ideal for query parameter values"
              aria-pressed={encodeScope === "component"}
            >
              Component Mode
            </button>

            <button
              type="button"
              onClick={() => handleScopeChange("full")}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                encodeScope === "full"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Preserves URL protocol, domain, and structure (encodeURI) - ideal for entire links"
              aria-pressed={encodeScope === "full"}
            >
              Full URL Mode
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Primary Action Button */}
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleActionClick}
            className="h-8 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white gap-1.5 cursor-pointer"
            aria-label={mode === "encode" ? "Encode URL string" : "Decode URL string"}
          >
            <span>{mode === "encode" ? "Encode URL" : "Decode URL"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSwap}
            className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1.5 cursor-pointer"
            title="Swap input and output values and switch mode"
            aria-label="Swap input and output direction"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Swap</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleLoadExample}
            className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1 cursor-pointer"
            title="Load sample URL"
            aria-label="Load sample"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Example</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-8 text-xs text-muted-foreground hover:text-destructive cursor-pointer"
            title="Clear all fields"
            aria-label="Clear all fields"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Grid: Input vs Output */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolInput
          label={
            mode === "encode"
              ? encodeScope === "component"
                ? "Query Parameter / Component Input"
                : "Full URL Input"
              : "Percent-Encoded String Input"
          }
          value={input}
          onChange={setInput}
          placeholder={
            mode === "encode"
              ? encodeScope === "component"
                ? "Enter query parameter or text to encode (e.g. search query & params)..."
                : "Enter full URL to encode (e.g. https://techwebcode.in/search?q=developer tools)..."
              : "Enter percent-encoded string (e.g. search%20query%26params)..."
          }
          onLoadSample={handleLoadExample}
          onClear={handleClear}
        />

        <ToolOutput
          label={
            mode === "encode"
              ? "Percent-Encoded Output Result"
              : encodeScope === "component"
              ? "Decoded Parameter Value"
              : "Decoded Full URL"
          }
          value={output}
          status={status}
          errorMessage={errorMsg}
          downloadFilename={mode === "encode" ? "encoded-url.txt" : "decoded-url.txt"}
        />
      </div>

      {/* Scope Explanation Banner */}
      <div className="p-3 bg-muted/30 rounded-xl border border-border/60 text-xs text-muted-foreground flex items-center justify-between flex-wrap gap-2">
        <span className="font-mono text-foreground font-semibold">
          Active JavaScript Engine: {encodeScope === "component" ? (mode === "encode" ? "encodeURIComponent()" : "decodeURIComponent()") : (mode === "encode" ? "encodeURI()" : "decodeURI()")}
        </span>
        <span>
          {encodeScope === "component"
            ? "Encodes all reserved delimiters (:, /, ?, #, &, =)—best for individual query string parameters."
            : "Preserves URL protocols, domain, and path structure (https://, /path, ?)—best for complete links."}
        </span>
      </div>
    </div>
  );
}
