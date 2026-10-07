"use client";

import React, { useState, useEffect, useCallback } from "react";
import ToolHeader from "@/components/tool/ToolHeader";
import { Tool } from "@/types/tools";
import { Button } from "@/components/ui/button";
import {
  ShieldAlert,
  ShieldCheck,
  Copy,
  Check,
  Trash2,
  Sparkles,
  Maximize2,
  Hash,
  Download,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { calculateSha1, getByteCount } from "./sha1.utils";
import FullScreenWorkspace from "@/components/tool/workspace/FullScreenWorkspace";

interface Props {
  tool: Tool;
}

const SAMPLE_TEXT_1 = "hello";
const SAMPLE_TEXT_2 = "TechWebCode - Free Developer Tools Platform";

export default function Sha1HashGenerator({ tool }: Props) {
  const [input, setInput] = useState<string>(SAMPLE_TEXT_1);
  const [hash, setHash] = useState<string>("");
  const [isUppercase, setIsUppercase] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Compute hash reactively
  const generateHash = useCallback(async (text: string) => {
    setIsGenerating(true);
    try {
      const result = await calculateSha1(text);
      setHash(result);
    } catch {
      toast.error("Failed to compute SHA-1 hash.");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  useEffect(() => {
    generateHash(input);
  }, [input, generateHash]);

  const displayHash = isUppercase ? hash.toUpperCase() : hash.toLowerCase();
  const charCount = input.length;
  const byteCount = getByteCount(input);

  const handleCopy = () => {
    if (!displayHash) return;
    navigator.clipboard.writeText(displayHash);
    setCopied(true);
    toast.success("SHA-1 hash copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!displayHash) return;
    const blob = new Blob([displayHash], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sha1-hash.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded sha1-hash.txt");
  };

  const handleClear = () => {
    setInput("");
    toast.info("Input cleared");
  };

  const renderWorkspaceContent = () => (
    <div className="space-y-6">
      {/* 1. Security Advisory Banner */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 text-amber-950 dark:text-amber-200 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-700 dark:text-amber-300">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>Cryptographic Security Advisory</span>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed text-amber-900/90 dark:text-amber-200/90">
          SHA-1 is not recommended for new security-sensitive applications because practical collision attacks exist. For modern cryptographic use cases, prefer SHA-256 or stronger algorithms.
        </p>
        <p className="text-xs leading-relaxed text-amber-800/80 dark:text-amber-300/80 font-medium">
          Note: SHA-1 is a one-way hash function, not encryption. A hash cannot be decrypted back into the original text.
        </p>
      </div>

      {/* 2. Client-Side Privacy Notice */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-emerald-500/25 bg-emerald-500/5 text-xs text-foreground">
        <div className="flex items-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            <strong>100% Client-Side:</strong> Your input is processed locally in your browser and is not sent to TechWebCode servers.
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground font-mono bg-background/80 px-2 py-0.5 rounded border">
          Web Crypto API
        </span>
      </div>

      {/* 3. Toolbar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-2 rounded-2xl bg-muted/40 border">
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            type="button"
            size="sm"
            onClick={() => generateHash(input)}
            disabled={isGenerating}
            className="gap-1.5 font-bold text-xs rounded-xl"
          >
            <Hash className="w-3.5 h-3.5" />
            <span>Generate SHA-1</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setInput(SAMPLE_TEXT_1)}
            className="gap-1 text-xs rounded-xl"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Sample: &quot;hello&quot;</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setInput(SAMPLE_TEXT_2)}
            className="gap-1 text-xs rounded-xl hidden sm:inline-flex"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Sample: Text</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="gap-1 text-xs rounded-xl text-muted-foreground hover:text-rose-500"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </Button>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="gap-1 text-xs rounded-xl"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fullscreen</span>
          </Button>
        </div>
      </div>

      {/* 4. Main Two-Column / Stacked Workspace */}
      <div className="grid gap-6 lg:grid-cols-2 items-start">
        {/* Input Card */}
        <div className="flex flex-col rounded-2xl border bg-card shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <span>Input Text</span>
            </span>

            <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
              <span>{charCount} chars</span>
              <span>•</span>
              <span>{byteCount} bytes (UTF-8)</span>
            </div>
          </div>

          <div className="p-4 space-y-2">
            <label htmlFor="sha1-input" className="sr-only">
              Plain text input for SHA-1 hash generation
            </label>
            <textarea
              id="sha1-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or paste arbitrary UTF-8 text here..."
              rows={8}
              className="w-full resize-y rounded-xl border border-input bg-background p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between px-4 py-2.5 bg-muted/20 border-t text-xs text-muted-foreground">
            <span className="text-[11px] flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-muted-foreground/80" />
              <span>Multi-line text & Unicode preserved</span>
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Output Hash Card */}
        <div className="flex flex-col rounded-2xl border bg-card shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                SHA-1 Digest
              </span>
              <span className="rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-bold">
                40 Hex Chars (160-bit)
              </span>
            </div>

            {/* Case Toggle */}
            <div className="flex items-center rounded-lg border bg-muted/40 p-0.5 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setIsUppercase(false)}
                className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${
                  !isUppercase
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                hex
              </button>
              <button
                type="button"
                onClick={() => setIsUppercase(true)}
                className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${
                  isUppercase
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                HEX
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div className="rounded-xl border bg-slate-950 p-4 font-mono text-sm leading-relaxed break-all text-emerald-400 select-all min-h-[96px] flex items-center shadow-inner">
              {displayHash || (
                <span className="text-slate-600 italic select-none">
                  Output hash will appear here...
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button
                type="button"
                onClick={handleCopy}
                disabled={!displayHash}
                className="flex-1 rounded-xl gap-1.5 font-bold text-xs h-10"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied to Clipboard!" : "Copy SHA-1 Hash"}</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleDownload}
                disabled={!displayHash}
                className="rounded-xl gap-1.5 text-xs h-10"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </Button>
            </div>
          </div>

          <div className="px-4 py-2.5 bg-muted/20 border-t text-[11px] text-muted-foreground flex items-center justify-between">
            <span>Algorithm: SHA-1 (FIPS PUB 180-4)</span>
            <span className="font-mono text-[10px]">Digest: 20 bytes</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <ToolHeader
        tool={tool}
        title="SHA-1 Hash Generator"
        description="Generate SHA-1 hashes from text instantly in your browser. Fast, free, and client-side with no data sent to TechWebCode servers."
      />

      {/* Main Workspace */}
      {renderWorkspaceContent()}

      {/* Fullscreen Modal View */}
      {isFullscreen && (
        <FullScreenWorkspace
          isOpen={isFullscreen}
          onClose={() => setIsFullscreen(false)}
          title="SHA-1 Hash Generator"
          badge="100% Client-Side"
        >
          <div className="p-4 sm:p-8 max-w-6xl mx-auto">
            {renderWorkspaceContent()}
          </div>
        </FullScreenWorkspace>
      )}
    </div>
  );
}
