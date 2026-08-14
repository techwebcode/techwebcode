"use client";

import React, { useState, useEffect, useCallback } from "react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolOutput from "@/components/tool/ToolOutput";
import ToolExplanation from "@/components/tool/ToolExplanation";
import RelatedTools from "@/components/tool/RelatedTools";
import { Tool } from "@/types/tools";
import { Button } from "@/components/ui/button";
import { RefreshCw, Sparkles } from "lucide-react";

interface Props {
  tool: Tool;
}

export default function UuidGenerator({ tool }: Props) {
  const [count, setCount] = useState<number>(5);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [hyphens, setHyphens] = useState<boolean>(true);
  const [uuids, setUuids] = useState<string>("");

  // Secure Cryptographic UUID v4 Generation
  const generateSecureUuidV4 = () => {
    if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
      const buffer = new Uint8Array(16);
      window.crypto.getRandomValues(buffer);

      // Set RFC 4122 variant & version 4 bits
      buffer[6] = (buffer[6] & 0x0f) | 0x40; // Version 4
      buffer[8] = (buffer[8] & 0x3f) | 0x80; // Variant 10xx

      const hex = Array.from(buffer, (byte) => byte.toString(16).padStart(2, "0")).join("");
      return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20)}`;
    }

    // Fallback pseudo-random
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const handleGenerate = useCallback(() => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      let u = generateSecureUuidV4();
      if (!hyphens) u = u.replace(/-/g, "");
      if (uppercase) u = u.toUpperCase();
      list.push(u);
    }
    setUuids(list.join("\n"));
  }, [count, uppercase, hyphens]);

  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  return (
    <div className="space-y-6">
      <ToolHeader tool={tool} />

      {/* Generator Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-muted/40 p-4 rounded-2xl border border-border">
        <div className="flex flex-wrap items-center gap-6">
          {/* Quantity */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Quantity:</span>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="h-8 text-xs bg-background border border-border rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-primary font-medium"
            >
              {[1, 5, 10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "UUID" : "UUIDs"}
                </option>
              ))}
            </select>
          </div>

          {/* Uppercase Toggle */}
          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary"
            />
            <span>Uppercase (A-F)</span>
          </label>

          {/* Hyphen Toggle */}
          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={hyphens}
              onChange={(e) => setHyphens(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary"
            />
            <span>Include Hyphens (-)</span>
          </label>
        </div>

        <Button
          type="button"
          onClick={handleGenerate}
          size="sm"
          className="h-8 text-xs font-semibold gap-1.5 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Generate New UUIDs</span>
        </Button>
      </div>

      {/* Generated Output List */}
      <ToolOutput
        label={`Generated UUID v4 List (${count})`}
        value={uuids}
        status="success"
        downloadFilename="uuids.txt"
        minHeight="min-h-[320px]"
      />

      {/* SEO Rich Explanation Content */}
      <ToolExplanation
        title="UUID / GUID v4 Generator"
        description="A UUID (Universally Unique Identifier) or GUID (Globally Unique Identifier) is a 128-bit number used to identify information in computer systems with practically zero probability of collision. Version 4 UUIDs are generated using random or pseudo-random numbers."
        howToUse={[
          "Select the number of UUIDs you want to generate (from 1 to 100).",
          "Toggle Uppercase or Include Hyphens based on your database or API requirements.",
          "Click Generate New UUIDs to generate fresh cryptographically secure identifiers.",
          "Click Copy or Download to save your generated UUID list.",
        ]}
        features={[
          "Cryptographically secure randomness powered by browser window.crypto.getRandomValues().",
          "Bulk generation supporting up to 100 UUIDs per batch.",
          "Formatting options for uppercase casing and hyphenation removal.",
          "Download generated list to uuids.txt.",
        ]}
        faqs={[
          {
            question: "What is the probability of a UUID v4 collision?",
            answer:
              "The probability of generating two duplicate UUID v4 identifiers is virtually zero. You would need to generate 1 billion UUIDs per second for 85 years to have a 50% chance of a single collision.",
          },
          {
            question: "What is the standard structure of a Version 4 UUID?",
            answer:
              "A standard UUID v4 contains 32 hexadecimal characters arranged in 5 groups separated by hyphens (`8-4-4-4-12`), for example: `f47ac10b-58cc-4372-a567-0e02b2c3d479`.",
          },
          {
            question: "What is the difference between a UUID and a GUID?",
            answer:
              "UUID (Universally Unique Identifier) is the open RFC 4122 standard. GUID (Globally Unique Identifier) is Microsoft's terminology for the exact same 128-bit structure. They are functionally identical.",
          },
          {
            question: "What are common developer use cases for UUIDs?",
            answer:
              "UUIDs are used as primary keys in distributed databases (MongoDB, PostgreSQL, MySQL), API request tracking IDs, OAuth state tokens, microservice correlation IDs, and file upload filenames.",
          },
        ]}
      />

      {/* Interlinking Related Tools */}
      <RelatedTools currentSlug="uuid-generator" />
    </div>
  );
}
