"use client";

import React, { useState } from "react";
import ToolGrid from "@/components/tool/ToolGrid";
import ToolHero from "@/components/tool/ToolHero";
import ToolSearch from "@/components/tool/ToolSearch";
import ToolCategories from "@/components/tool/ToolCategories";
import Container from "@/components/layout/Container";
import { useTools, useToolCategories } from "@/hooks/useTools";
import { Tool, ToolCategory } from "@/types/tools";
import { AlertCircle, Sparkles, Wrench } from "lucide-react";

interface ToolsDirectoryClientProps {
  initialTools: Tool[];
  initialCategories: ToolCategory[];
}

export default function ToolsDirectoryClient({
  initialTools,
  initialCategories,
}: ToolsDirectoryClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const { data: categoriesData } = useToolCategories();
  const categories = Array.isArray(categoriesData) && categoriesData.length > 0
    ? categoriesData
    : initialCategories;

  const filters: Record<string, unknown> = {};
  if (search.trim()) filters.search = search.trim();
  if (selectedCategory) filters.category = selectedCategory;

  const { data, isLoading, error } = useTools(filters);

  // If live query returned data, use it; otherwise seamlessly fall back to initialTools
  const rawTools: Tool[] = Array.isArray(data) && data.length > 0 ? data : initialTools;

  // Filter tools client-side if live query hasn't replaced them or during search/category change
  const tools = rawTools.filter((t) => {
    if (selectedCategory) {
      const toolCategorySlug = t.category?.slug || t.category?.name?.toLowerCase().replace(/\s+/g, "-");
      if (toolCategorySlug !== selectedCategory) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = t.name.toLowerCase().includes(q);
      const matchDesc = (t.description || t.shortDescription || "").toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    return true;
  });

  const featuredTools = tools.filter((t) => t.featured || t.popular);
  const regularTools = tools.filter((t) => !t.featured && !t.popular);

  return (
    <>
      {/* Hero Section with Search */}
      <ToolHero onSearch={setSearch} />

      <Container className="py-8 lg:py-10 space-y-8">
        {/* Filter Controls & Categories */}
        <div className="space-y-4">
          <ToolSearch value={search} onSearch={setSearch} />
          <ToolCategories
            categories={categories}
            activeCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Error State (only shown if backend errored AND no fallback tools) */}
        {error && tools.length === 0 && (
          <div className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-rose-500 text-sm font-semibold">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>Failed to fetch developer tools from backend server.</span>
          </div>
        )}

        {/* Empty State */}
        {tools.length === 0 && !isLoading ? (
          <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground space-y-2">
            <Wrench className="w-8 h-8 mx-auto text-muted-foreground/60" />
            <h4 className="font-bold text-foreground">No Developer Tools Found</h4>
            <p className="text-xs">Try adjusting your search query or category filter.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Featured & Popular Tools Section */}
            {featuredTools.length > 0 && !selectedCategory && !search && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Featured & Popular Tools</span>
                </h3>
                <ToolGrid tools={featuredTools} />
              </div>
            )}

            {/* All Developer Tools Section */}
            <div className="space-y-4">
              {featuredTools.length > 0 && !selectedCategory && !search && (
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  All Developer Tools
                </h3>
              )}
              <ToolGrid tools={regularTools.length > 0 ? regularTools : tools} />
            </div>
          </div>
        )}
      </Container>
    </>
  );
}
