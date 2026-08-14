"use client";

import React, { useState, useEffect } from "react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolExplanation from "@/components/tool/ToolExplanation";
import RelatedTools from "@/components/tool/RelatedTools";
import { Tool } from "@/types/tools";
import { Button } from "@/components/ui/button";
import { Clock, Copy, Check, ArrowDownUp } from "lucide-react";
import { toast } from "sonner";

interface Props {
  tool: Tool;
}

export default function TimestampConverter({ tool }: Props) {
  const [currentEpochSec, setCurrentEpochSec] = useState<number>(Math.floor(Date.now() / 1000));
  
  // Tab Mode: Epoch -> Date vs Date -> Epoch
  const [mode, setMode] = useState<"epochToDate" | "dateToEpoch">("epochToDate");

  // Epoch -> Date State
  const [inputEpoch, setInputEpoch] = useState<string>(String(Math.floor(Date.now() / 1000)));
  const [humanDate, setHumanDate] = useState<string>("");
  const [isoDate, setIsoDate] = useState<string>("");
  const [utcDate, setUtcDate] = useState<string>("");

  // Date -> Epoch State
  const [inputDateStr, setInputDateStr] = useState<string>(new Date().toISOString().slice(0, 16));
  const [outputSec, setOutputSec] = useState<string>("");
  const [outputMs, setOutputMs] = useState<string>("");

  const [copiedKey, setCopiedKey] = useState<string>("");

  // Live Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEpochSec(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Epoch -> Date Converter
  const convertEpochToDate = (val: string) => {
    if (!val.trim()) {
      setHumanDate("");
      setIsoDate("");
      setUtcDate("");
      return;
    }

    let num = Number(val.trim());
    if (isNaN(num)) {
      setHumanDate("Invalid Number");
      setIsoDate("");
      setUtcDate("");
      return;
    }

    // Auto-detect milliseconds (13 digits) vs seconds (10 digits)
    if (val.trim().length >= 13) {
      num = Math.floor(num / 1000);
    }

    const d = new Date(num * 1000);
    if (isNaN(d.getTime())) {
      setHumanDate("Invalid Date");
      setIsoDate("");
      setUtcDate("");
      return;
    }

    setHumanDate(d.toLocaleString());
    setIsoDate(d.toISOString());
    setUtcDate(d.toUTCString());
  };

  // Date -> Epoch Converter
  const convertDateToEpoch = (dateVal: string) => {
    if (!dateVal.trim()) {
      setOutputSec("");
      setOutputMs("");
      return;
    }

    const d = new Date(dateVal);
    if (isNaN(d.getTime())) {
      setOutputSec("Invalid Date");
      setOutputMs("");
      return;
    }

    const ms = d.getTime();
    setOutputSec(String(Math.floor(ms / 1000)));
    setOutputMs(String(ms));
  };

  useEffect(() => {
    if (mode === "epochToDate") {
      convertEpochToDate(inputEpoch);
    } else {
      convertDateToEpoch(inputDateStr);
    }
  }, [inputEpoch, inputDateStr, mode]);

  const copyText = (text: string, key: string) => {
    if (!text || text.startsWith("Invalid")) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedKey(""), 2000);
  };

  return (
    <div className="space-y-6">
      <ToolHeader tool={tool} />

      {/* Live Epoch Widget */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border bg-gradient-to-r from-blue-950/30 via-background to-indigo-950/30 border-blue-500/20">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Current Unix Timestamp (Epoch Seconds)
            </div>
            <div className="text-2xl font-mono font-bold text-foreground mt-0.5">
              {currentEpochSec}
            </div>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => {
            const now = Math.floor(Date.now() / 1000);
            setInputEpoch(String(now));
            setInputDateStr(new Date().toISOString().slice(0, 16));
            toast.info("Set to current timestamp");
          }}
          size="sm"
          className="text-xs font-semibold"
        >
          <span>Set to Now</span>
        </Button>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center gap-2 bg-muted/40 p-2 rounded-2xl border border-border max-w-md">
        <Button
          type="button"
          variant={mode === "epochToDate" ? "default" : "ghost"}
          size="sm"
          onClick={() => setMode("epochToDate")}
          className="flex-1 text-xs font-semibold"
        >
          Timestamp → Human Date
        </Button>

        <Button
          type="button"
          variant={mode === "dateToEpoch" ? "default" : "ghost"}
          size="sm"
          onClick={() => setMode("dateToEpoch")}
          className="flex-1 text-xs font-semibold"
        >
          Human Date → Timestamp
        </Button>
      </div>

      {/* Mode 1: Epoch to Human Date */}
      {mode === "epochToDate" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Card */}
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Enter Unix Epoch Timestamp (Seconds or Milliseconds)
            </label>

            <input
              type="text"
              value={inputEpoch}
              onChange={(e) => setInputEpoch(e.target.value)}
              placeholder="e.g. 1700000000"
              className="w-full p-3.5 font-mono text-base bg-muted/20 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setInputEpoch(String(currentEpochSec))}
                className="text-xs flex-1"
              >
                Now ({currentEpochSec})
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setInputEpoch("1700000000")}
                className="text-xs flex-1"
              >
                Sample (1.7B)
              </Button>
            </div>
          </div>

          {/* Results Card */}
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Converted Date Results
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-muted/20 border border-border flex items-center justify-between">
                <div>
                  <span className="text-muted-foreground block text-[10px]">LOCAL TIME</span>
                  <span className="text-sm font-semibold text-foreground">{humanDate || "—"}</span>
                </div>
                <button
                  onClick={() => copyText(humanDate, "human")}
                  className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                >
                  {copiedKey === "human" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="p-3 rounded-lg bg-muted/20 border border-border flex items-center justify-between">
                <div>
                  <span className="text-muted-foreground block text-[10px]">ISO 8601 STRING</span>
                  <span className="text-sm font-semibold text-foreground">{isoDate || "—"}</span>
                </div>
                <button
                  onClick={() => copyText(isoDate, "iso")}
                  className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                >
                  {copiedKey === "iso" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="p-3 rounded-lg bg-muted/20 border border-border flex items-center justify-between">
                <div>
                  <span className="text-muted-foreground block text-[10px]">UTC STRING</span>
                  <span className="text-sm font-semibold text-foreground">{utcDate || "—"}</span>
                </div>
                <button
                  onClick={() => copyText(utcDate, "utc")}
                  className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                >
                  {copiedKey === "utc" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Human Date to Epoch */}
      {mode === "dateToEpoch" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Date Card */}
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Select or Type Date & Time
            </label>

            <input
              type="datetime-local"
              value={inputDateStr}
              onChange={(e) => setInputDateStr(e.target.value)}
              className="w-full p-3 font-mono text-sm bg-muted/20 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>

          {/* Results Card */}
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Generated Epoch Timestamps
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-muted/20 border border-border flex items-center justify-between">
                <div>
                  <span className="text-muted-foreground block text-[10px]">UNIX TIMESTAMP (SECONDS)</span>
                  <span className="text-base font-bold text-primary">{outputSec || "—"}</span>
                </div>
                <button
                  onClick={() => copyText(outputSec, "sec")}
                  className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                >
                  {copiedKey === "sec" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="p-3 rounded-lg bg-muted/20 border border-border flex items-center justify-between">
                <div>
                  <span className="text-muted-foreground block text-[10px]">UNIX TIMESTAMP (MILLISECONDS)</span>
                  <span className="text-base font-bold text-foreground">{outputMs || "—"}</span>
                </div>
                <button
                  onClick={() => copyText(outputMs, "ms")}
                  className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                >
                  {copiedKey === "ms" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO Rich Explanation Content */}
      <ToolExplanation
        title="Unix Epoch Timestamp Converter"
        description="Unix timestamp (Epoch time) measures time as the total number of seconds elapsed since 00:00:00 UTC on January 1, 1970 (the Unix Epoch). It is widely used in databases, HTTP caching headers, JWT expiration claims, and server logs."
        howToUse={[
          "Select 'Timestamp → Human Date' or 'Human Date → Timestamp' depending on your conversion direction.",
          "For Epoch timestamps, enter a 10-digit number (seconds) or 13-digit number (milliseconds). Automatic detection parses both formats.",
          "Review Local Time, ISO 8601 UTC string, and GMT formats.",
          "Click Set to Now to load the live system epoch timestamp.",
        ]}
        features={[
          "Live real-time Epoch clock ticker.",
          "Automatic 10-digit (seconds) vs 13-digit (milliseconds) detection.",
          "Bi-directional date picker to Unix epoch seconds and milliseconds conversion.",
          "One-click copy for all converted timestamp values.",
        ]}
        faqs={[
          {
            question: "What is a Unix Epoch timestamp?",
            answer:
              "A Unix Epoch timestamp is an integer counting the exact number of seconds that have elapsed since 00:00:00 UTC on January 1, 1970. It is used as the universal standard for date-time storage in databases and operating systems.",
          },
          {
            question: "How can I tell seconds from milliseconds in a timestamp?",
            answer:
              "Unix timestamps in seconds are 10 digits long (e.g. `1700000000`), while millisecond timestamps are 13 digits long (e.g. `1700000000000`). Our converter automatically detects and handles both formats.",
          },
          {
            question: "Does Unix time include timezones?",
            answer:
              "No. Unix timestamps are strictly based on Coordinated Universal Time (UTC) and do not contain timezone offsets. Local time display depends on your browser's geographic timezone setting.",
          },
          {
            question: "What is the Year 2038 Problem (Y2K38)?",
            answer:
              "The Year 2038 problem affects legacy 32-bit systems storing Unix time as a signed 32-bit integer, which will overflow on January 19, 2038. Modern 64-bit operating systems handle dates thousands of years into the future without issue.",
          },
        ]}
      />

      {/* Interlinking Related Tools */}
      <RelatedTools currentSlug="timestamp-converter" />
    </div>
  );
}
