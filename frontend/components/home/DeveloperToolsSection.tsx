"use client";

import React from "react";
import SectionHeading from "./SectionHeading";
import ToolGrid from "@/components/tool/ToolGrid";
import { useFeaturedTools } from "@/hooks/useTools";
import { Tool } from "@/types/tools";

const fallbackTools: Tool[] = [
  {
    id: 1,
    name: "JSON Formatter",
    slug: "json-formatter",
    description: "Format, validate and beautify JSON instantly with 2, 4, or 8 space indentations.",
    shortDescription: "Format, validate and beautify JSON instantly.",
    icon: "FileCode",
    featured: true,
  },
  {
    id: 2,
    name: "JSON Validator",
    slug: "json-validator",
    description: "Validate JSON syntax against RFC 8259 specifications and pinpoint parse errors.",
    shortDescription: "Validate JSON syntax and pinpoint parse errors.",
    icon: "CheckCircle2",
    featured: true,
  },
  {
    id: 3,
    name: "JSON Minifier",
    slug: "json-minifier",
    description: "Compress JSON into a single line string to reduce bandwidth and API latency.",
    shortDescription: "Compress JSON into a single line string.",
    icon: "Minimize2",
    featured: true,
  },
  {
    id: 4,
    name: "JWT Decoder",
    slug: "jwt-decoder",
    description: "Decode Base64 JSON Web Tokens to inspect Header, Payload claims, and expiration.",
    shortDescription: "Decode Base64 JSON Web Tokens securely.",
    icon: "Key",
    featured: true,
  },
  {
    id: 5,
    name: "Base64 Encoder / Decoder",
    slug: "base64",
    description: "Encode text strings into Base64 format or decode Base64 back to plain text.",
    shortDescription: "Encode and decode Base64 strings.",
    icon: "ArrowLeftRight",
    featured: true,
  },
  {
    id: 6,
    name: "UUID Generator",
    slug: "uuid-generator",
    description: "Generate cryptographically secure v4 UUIDs individually or in bulk.",
    shortDescription: "Generate random v4 UUIDs in bulk.",
    icon: "RefreshCw",
    featured: true,
  },
];

export default function DeveloperToolsSection() {
  const { data, isLoading } = useFeaturedTools();

  const apiTools: Tool[] = Array.isArray(data) ? data : [];
  const displayTools = apiTools.length > 0 ? apiTools.slice(0, 6) : fallbackTools;

  return (
    <section className="py-16 bg-muted/20 border-y border-border">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Developer Tools"
          description="Fast, free tools to solve everyday development problems."
          href="/tools"
          actionLabel="View All Tools"
        />

        <div className="mt-10">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-44 rounded-2xl border animate-pulse bg-card/60"
                />
              ))}
            </div>
          ) : (
            <ToolGrid tools={displayTools} />
          )}
        </div>
      </div>
    </section>
  );
}