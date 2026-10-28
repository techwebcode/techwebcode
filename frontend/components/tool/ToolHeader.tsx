"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tool } from "@/types/tools";
import { useToolPage } from "./ToolPageContext";

interface Props {
  tool?: Tool;
  title?: string;
  description?: string;
}

export default function ToolHeader({
  tool,
  title,
  description,
}: Props) {
  const { inToolPageLayout } = useToolPage();

  // If already rendered inside ToolPageLayout, suppress duplicate header to enforce tool-first hierarchy
  if (inToolPageLayout) {
    return null;
  }

  const displayTitle = title || tool?.name || "Developer Tool";
  const displayDesc = description || tool?.description || tool?.shortDescription || "";

  return (
    <header className="space-y-4">
      {tool && (
        <div className="flex flex-wrap gap-2">
          {tool.featured && <Badge>Featured</Badge>}
          {tool.popular && <Badge variant="secondary">Popular</Badge>}
          {tool.isNew && <Badge variant="outline">New</Badge>}
        </div>
      )}

      <h1 className="text-3xl font-bold">{displayTitle}</h1>

      {displayDesc && (
        <p className="max-w-3xl text-sm text-muted-foreground">{displayDesc}</p>
      )}
    </header>
  );
}