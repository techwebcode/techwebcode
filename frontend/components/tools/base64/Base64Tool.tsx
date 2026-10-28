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

const SAMPLE_PLAIN = "TechWebCode — Free Online Developer Tools & Code Compilers 🚀 (Unicode: 你好世界, café)";
const SAMPLE_BASE64 = "VGVjaFdlYkNvZGUg4oCUIEZyZWUgT25saW5lIERldmVsb3BlciBUb29scyAmIENvZGUgQ29tcGlsZXJzIPCfmIAgKFVuaWNvZGU6IOS9oOWlv+S4lueVjCwgY2Fmw6kp";

/**
 * Encodes a UTF-8 string to RFC 4648 Base64 using standard TextEncoder.
 */
function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binString = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binString += String.fromCharCode(bytes[i]);
  }
  return btoa(binString);
}

/**
 * Decodes an RFC 4648 Base64 string to a UTF-8 string using standard TextDecoder.
 */
function base64ToUtf8(base64: string): string {
  const cleanBase64 = base64.replace(/\s+/g, "");
  if (!cleanBase64) return "";

  const binString = atob(cleanBase64);
  const bytes = Uint8Array.from(binString, (m) => m.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

export default function Base64Tool({ tool }: Props) {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState<string>(SAMPLE_PLAIN);
  const [output, setOutput] = useState<string>(() => utf8ToBase64(SAMPLE_PLAIN));
  const [status, setStatus] = useState<"idle" | "success" | "error">("success");
  const [errorMessage, setErrorMessage] = useState("");

  const processBase64 = useCallback((text: string, currentMode: "encode" | "decode") => {
    if (!text.trim()) {
      setOutput("");
      setStatus("idle");
      setErrorMessage("");
      return;
    }

    try {
      if (currentMode === "encode") {
        const encoded = utf8ToBase64(text);
        setOutput(encoded);
      } else {
        const decoded = base64ToUtf8(text);
        setOutput(decoded);
      }
      setStatus("success");
      setErrorMessage("");
    } catch (err: unknown) {
      setOutput("");
      setStatus("error");
      const rawMsg = err instanceof Error ? err.message : "Failed to process Base64 string";
      if (rawMsg.toLowerCase().includes("character") || rawMsg.toLowerCase().includes("atob")) {
        setErrorMessage("Invalid Base64 input: contains characters outside the standard Base64 alphabet (A-Z, a-z, 0-9, +, /, =).");
      } else if (rawMsg.toLowerCase().includes("utf-8") || rawMsg.toLowerCase().includes("encoding")) {
        setErrorMessage("The decoded binary data does not contain valid UTF-8 text sequences.");
      } else {
        setErrorMessage(rawMsg);
      }
    }
  }, []);

  const debouncedInput = useDebounce(input, 200);

  useEffect(() => {
    processBase64(debouncedInput, mode);
  }, [debouncedInput, mode, processBase64]);

  // Mode change handler
  const handleModeChange = (newMode: "encode" | "decode") => {
    setMode(newMode);
    // If input is still the previous mode sample, switch to the new mode sample
    if (input === SAMPLE_PLAIN && newMode === "decode") {
      setInput(SAMPLE_BASE64);
      processBase64(SAMPLE_BASE64, "decode");
    } else if (input === SAMPLE_BASE64 && newMode === "encode") {
      setInput(SAMPLE_PLAIN);
      processBase64(SAMPLE_PLAIN, "encode");
    } else {
      processBase64(input, newMode);
    }
  };

  // Swap Direction Handler
  const handleSwap = () => {
    const nextMode = mode === "encode" ? "decode" : "encode";
    const nextInput = output || (nextMode === "encode" ? SAMPLE_PLAIN : SAMPLE_BASE64);
    setMode(nextMode);
    setInput(nextInput);
    processBase64(nextInput, nextMode);
    toast.info(`Swapped to Base64 ${nextMode === "encode" ? "Encoder" : "Decoder"}`);
  };

  // Clear Handler
  const handleClear = () => {
    setInput("");
    setOutput("");
    setStatus("idle");
    setErrorMessage("");
    toast.info("Cleared editor input and output.");
  };

  // Load Example Handler
  const handleLoadExample = () => {
    const example = mode === "encode" ? SAMPLE_PLAIN : SAMPLE_BASE64;
    setInput(example);
    processBase64(example, mode);
    toast.info(`Loaded ${mode === "encode" ? "Plain Text" : "Base64"} example.`);
  };

  // Explicit Action Execution (e.g. clicking the primary button)
  const handleActionClick = () => {
    processBase64(input, mode);
    if (!input.trim()) {
      toast.info(`Please enter text to ${mode === "encode" ? "encode" : "decode"}.`);
    } else {
      toast.success(`Base64 ${mode === "encode" ? "encoded" : "decoded"} successfully!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <ToolHeader
        tool={tool}
        title="Base64 Encoder & Decoder"
        description="Encode text to Base64 or decode Base64 strings online with this free Base64 tool. Fast, simple, and easy to use."
      />

      {/* Mode Toolbar & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/40 p-3 rounded-2xl border border-border">
        {/* Segmented Control / Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/80 rounded-xl border border-border/60">
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
            Encode to Base64
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
            Decode from Base64
          </button>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleActionClick}
            className="h-8 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white gap-1.5 cursor-pointer"
            aria-label={mode === "encode" ? "Encode text to Base64" : "Decode Base64 string to text"}
          >
            <span>{mode === "encode" ? "Encode Text" : "Decode String"}</span>
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
            title="Load example text"
            aria-label="Load example"
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
          label={mode === "encode" ? "Plain Text Input (UTF-8)" : "Base64 Encoded Input"}
          value={input}
          onChange={setInput}
          placeholder={
            mode === "encode"
              ? "Type or paste plain text here to encode (supports all Unicode characters, emojis, and special symbols)..."
              : "Paste Base64 string here to decode (e.g. VGVjaFdlYkNvZGU=)..."
          }
          onLoadSample={handleLoadExample}
          onClear={handleClear}
        />

        <ToolOutput
          label={mode === "encode" ? "Base64 Encoded Result" : "Decoded Plain Text Result"}
          value={output}
          status={status}
          errorMessage={errorMessage}
          downloadFilename={mode === "encode" ? "encoded.b64" : "decoded.txt"}
        />
      </div>
    </div>
  );
}
