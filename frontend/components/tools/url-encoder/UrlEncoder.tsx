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

const SAMPLE_PLAIN = "https://techwebcode.in/search?q=developer tools&category=web development";
const SAMPLE_ENCODED = "https%3A%2F%2Ftechwebcode.in%2Fsearch%3Fq%3Ddeveloper%20tools%26category%3Dweb%20development";

export default function UrlEncoder({ tool }: Props) {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [encodeType, setEncodeType] = useState<"component" | "full">("component");
  const [input, setInput] = useState(SAMPLE_PLAIN);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const processUrl = (text: string, currentMode: "encode" | "decode", type: "component" | "full") => {
    if (!text.trim()) {
      setOutput("");
      setStatus("idle");
      setErrorMsg("");
      return;
    }

    try {
      if (currentMode === "encode") {
        const result = type === "component" ? encodeURIComponent(text) : encodeURI(text);
        setOutput(result);
      } else {
        const result = type === "component" ? decodeURIComponent(text) : decodeURI(text);
        setOutput(result);
      }
      setStatus("success");
      setErrorMsg("");
    } catch (err: any) {
      setOutput("");
      setStatus("error");
      setErrorMsg(err.message || "Failed to process URL string");
    }
  };

  useEffect(() => {
    processUrl(input, mode, encodeType);
  }, [input, mode, encodeType]);

  const handleSwap = () => {
    const nextMode = mode === "encode" ? "decode" : "encode";
    setMode(nextMode);
    setInput(output || (nextMode === "encode" ? SAMPLE_PLAIN : SAMPLE_ENCODED));
    toast.info(`Swapped to URL ${nextMode === "encode" ? "Encoder" : "Decoder"}`);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setStatus("idle");
    setErrorMsg("");
  };

  return (
    <div className="space-y-6">
      <ToolHeader tool={tool} />

      {/* Toolbar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/40 p-3 rounded-2xl border border-border">
        <div className="flex flex-wrap items-center gap-2">
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
            URL Encode
          </Button>

          <Button
            type="button"
            variant={mode === "decode" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setMode("decode");
              setInput(SAMPLE_ENCODED);
            }}
            className="h-8 text-xs font-semibold"
          >
            URL Decode
          </Button>

          <div className="h-4 w-px bg-border mx-1 hidden sm:block" />

          {/* Encode Type Selection */}
          <Button
            type="button"
            variant={encodeType === "component" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setEncodeType("component")}
            className="h-8 text-xs text-muted-foreground"
          >
            Component Mode
          </Button>

          <Button
            type="button"
            variant={encodeType === "full" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setEncodeType("full")}
            className="h-8 text-xs text-muted-foreground"
          >
            Full URL Mode
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
            <span>Swap</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setInput(mode === "encode" ? SAMPLE_PLAIN : SAMPLE_ENCODED)}
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
          label={mode === "encode" ? "Raw URL / Component Input" : "Percent-Encoded String Input"}
          value={input}
          onChange={setInput}
          placeholder={mode === "encode" ? "Enter URL or query parameters to encode..." : "Enter percent-encoded string..."}
          onLoadSample={() => setInput(mode === "encode" ? SAMPLE_PLAIN : SAMPLE_ENCODED)}
        />

        <ToolOutput
          label={mode === "encode" ? "Percent-Encoded Output" : "Decoded Plain URL"}
          value={output}
          status={status}
          errorMessage={errorMsg}
          downloadFilename={mode === "encode" ? "encoded-url.txt" : "decoded-url.txt"}
        />
      </div>

      {/* SEO Rich Explanation Content */}
      <ToolExplanation
        title="URL Encoder & Decoder"
        description="URL encoding (also known as percent-encoding) converts characters into a format that can be transmitted over the Internet securely via HTTP GET query parameters. Reserved characters like spaces, question marks, and ampersands are replaced by '%20', '%3F', '%26'."
        howToUse={[
          "Select 'URL Encode' or 'URL Decode' mode.",
          "Choose 'Component Mode' (encodeURIComponent for query params) or 'Full URL Mode' (encodeURI for full links).",
          "Paste or type string into the input field.",
          "Click 'Swap' to quickly test reverse decoding.",
        ]}
        features={[
          "100% Client-Side percent-encoding with zero latency.",
          "Supports both encodeURIComponent (all special chars) and encodeURI (preserves URL scheme).",
          "One-click Swap Direction for instant verification.",
          "Download output result.",
        ]}
        faqs={[
          {
            question: "What is the difference between Component Mode and Full URL Mode?",
            answer:
              "Component Mode (encodeURIComponent) encodes all special characters including ':', '/', '?', and '&', making it ideal for query param values. Full URL Mode (encodeURI) preserves protocol and domain syntax (http://) while encoding spaces.",
          },
        ]}
      />

      {/* Interlinking Related Tools */}
      <RelatedTools currentSlug="url-encoder-decoder" />
    </div>
  );
}
