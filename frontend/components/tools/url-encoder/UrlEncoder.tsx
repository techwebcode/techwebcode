"use client";

import React, { useState, useEffect } from "react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolInput from "@/components/tool/ToolInput";
import ToolOutput from "@/components/tool/ToolOutput";
import { Tool } from "@/types/tools";
import { Button } from "@/components/ui/button";

interface Props {
  tool: Tool;
}

const SAMPLE_URL = "https://techwebcode.com/search?q=developer tools&category=web development";

export default function UrlEncoder({ tool }: Props) {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState(SAMPLE_URL);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const processUrl = (text: string, currentMode: "encode" | "decode") => {
    if (!text.trim()) {
      setOutput("");
      setStatus("idle");
      setErrorMsg("");
      return;
    }

    try {
      if (currentMode === "encode") {
        setOutput(encodeURIComponent(text));
      } else {
        setOutput(decodeURIComponent(text));
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
    processUrl(input, mode);
  }, [input, mode]);

  return (
    <div className="space-y-6">
      <ToolHeader
        title={tool.name || "URL Encoder / Decoder"}
        description={tool.description || "Encode query parameters and characters into percent-encoded URL format, or decode percent-encoded strings."}
      />

      {/* Mode Switcher */}
      <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-xl border border-border max-w-xs">
        <Button
          type="button"
          variant={mode === "encode" ? "default" : "ghost"}
          size="sm"
          onClick={() => {
            setMode("encode");
            setInput("https://techwebcode.com/search?q=developer tools&category=web development");
          }}
          className="flex-1 text-xs"
        >
          URL Encode
        </Button>
        <Button
          type="button"
          variant={mode === "decode" ? "default" : "ghost"}
          size="sm"
          onClick={() => {
            setMode("decode");
            setInput("https%3A%2F%2Ftechwebcode.com%2Fsearch%3Fq%3Ddeveloper%20tools%26category%3Dweb%20development");
          }}
          className="flex-1 text-xs"
        >
          URL Decode
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ToolInput
          label={mode === "encode" ? "Raw Input URL / Text" : "Encoded Percent-String"}
          value={input}
          onChange={setInput}
          placeholder={mode === "encode" ? "Enter URL to encode..." : "Enter percent-encoded string..."}
          onLoadSample={() => setInput(SAMPLE_URL)}
        />

        <ToolOutput
          label={mode === "encode" ? "Percent-Encoded Result" : "Decoded Plain URL"}
          value={output}
          status={status}
          errorMessage={errorMsg}
          downloadFilename="url-result.txt"
        />
      </div>
    </div>
  );
}
