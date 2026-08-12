"use client";

import React, { useState, useEffect } from "react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolInput from "@/components/tool/ToolInput";
import ToolOutput from "@/components/tool/ToolOutput";
import ToolExplanation from "@/components/tool/ToolExplanation";
import RelatedTools from "@/components/tool/RelatedTools";
import { Tool } from "@/types/tools";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  tool: Tool;
}

const SAMPLE_PLAIN = "TechWebCode - Free Developer Tools Platform!";
const SAMPLE_BASE64 = "VGVjaFdlYkNvZGUgLSBGcmVlIERldmVsb3BlciBUb29scyBQbGF0Zm9ybSE=";

export default function Base64Tool({ tool }: Props) {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState(SAMPLE_PLAIN);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const processBase64 = (text: string, currentMode: "encode" | "decode") => {
    if (!text.trim()) {
      setOutput("");
      setStatus("idle");
      setErrorMessage("");
      return;
    }

    try {
      if (currentMode === "encode") {
        // UTF-8 safe base64 encoding
        const encoded = btoa(unescape(encodeURIComponent(text)));
        setOutput(encoded);
      } else {
        // UTF-8 safe base64 decoding
        const decoded = decodeURIComponent(escape(atob(text.trim())));
        setOutput(decoded);
      }
      setStatus("success");
      setErrorMessage("");
    } catch (err: any) {
      setOutput("");
      setStatus("error");
      setErrorMessage(err.message || "Failed to process Base64 string");
    }
  };

  useEffect(() => {
    processBase64(input, mode);
  }, [input, mode]);

  // Swap Direction Handler
  const handleSwap = () => {
    const nextMode = mode === "encode" ? "decode" : "encode";
    setMode(nextMode);
    setInput(output || (nextMode === "encode" ? SAMPLE_PLAIN : SAMPLE_BASE64));
    toast.info(`Swapped to Base64 ${nextMode === "encode" ? "Encoder" : "Decoder"}`);
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

      {/* Mode Toolbar & Swap Direction */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/40 p-3 rounded-2xl border border-border">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={mode === "encode" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setMode("encode");
              setInput(SAMPLE_PLAIN);
            }}
            className="h-8 text-xs font-semibold"
          >
            Encode to Base64
          </Button>

          <Button
            type="button"
            variant={mode === "decode" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setMode("decode");
              setInput(SAMPLE_BASE64);
            }}
            className="h-8 text-xs font-semibold"
          >
            Decode from Base64
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSwap}
            className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1.5"
            title="Swap Direction"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Swap Direction</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              setInput(mode === "encode" ? SAMPLE_PLAIN : SAMPLE_BASE64)
            }
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            <FileText className="w-3.5 h-3.5 mr-1" />
            <span>Sample</span>
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

      {/* Grid: Input vs Output */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolInput
          label={mode === "encode" ? "Plain Text Input" : "Base64 Encoded Input"}
          value={input}
          onChange={setInput}
          placeholder={
            mode === "encode"
              ? "Type or paste plain text here to encode..."
              : "Paste Base64 string here to decode..."
          }
          onLoadSample={() =>
            setInput(mode === "encode" ? SAMPLE_PLAIN : SAMPLE_BASE64)
          }
        />

        <ToolOutput
          label={mode === "encode" ? "Base64 Result" : "Plain Text Result"}
          value={output}
          status={status}
          errorMessage={errorMessage}
          downloadFilename={mode === "encode" ? "encoded.b64" : "decoded.txt"}
        />
      </div>

      {/* SEO Rich Explanation Content */}
      <ToolExplanation
        title="Base64 Encoder & Decoder"
        description="Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It is widely used in web development for encoding HTTP headers, basic authorization tokens, data URLs, and API payloads."
        howToUse={[
          "Select 'Encode to Base64' or 'Decode from Base64' using the mode selector.",
          "Type or paste your text into the left input area.",
          "The output updates automatically in real-time.",
          "Click Swap Direction to quickly convert output back to input for double-checking.",
        ]}
        features={[
          "UTF-8 Unicode string support guaranteeing accurate handling of special characters and emojis.",
          "Instant client-side encoding and decoding with zero server latency.",
          "One-click Swap Direction for bi-directional workflow.",
          "Download output to text or .b64 file.",
        ]}
        faqs={[
          {
            question: "Is Base64 encoding a form of encryption?",
            answer:
              "No. Base64 is an encoding scheme designed for data transport, not data security. Anyone can decode a Base64 string. Sensitive data should be encrypted using AES or RSA before encoding.",
          },
        ]}
      />

      {/* Interlinking Related Tools */}
      <RelatedTools currentSlug="base64" />
    </div>
  );
}
