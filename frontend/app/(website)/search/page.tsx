"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/common/SectionHeading";
import ArticleGrid from "@/components/article/ArticleGrid";
import ToolGrid from "@/components/tool/ToolGrid";
import { useLatestArticles } from "@/hooks/useLatestArticles";
import { useTools } from "@/hooks/useTools";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Newspaper, Wrench } from "lucide-react";
import { Article } from "@/types/article";
import { Tool } from "@/types/tools";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(query);
  const [activeTab, setActiveTab] = useState<"all" | "articles" | "tools">("all");

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  const { data: articlesData, isLoading: articlesLoading } = useLatestArticles();
  const { data: toolsData, isLoading: toolsLoading } = useTools();

  const allArticles: Article[] = (articlesData as unknown as { data: Article[] })?.data ?? (Array.isArray(articlesData) ? articlesData : []);
  const allTools: Tool[] = Array.isArray(toolsData) ? toolsData : [];

  const matchedArticles = allArticles.filter((art) =>
    !searchTerm ||
    art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (art.excerpt && art.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const matchedTools = allTools.filter((tool) =>
    !searchTerm ||
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tool.description && tool.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const isLoading = articlesLoading || toolsLoading;

  return (
    <Container className="py-16 space-y-10">
      <SectionHeading
        title="Search Results"
        description={query ? `Showing results for "${query}"` : "Search articles and developer tools across TechWebCode."}
      />

      {/* Search Input Form */}
      <form onSubmit={handleSearchSubmit} className="flex gap-3 max-w-xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tutorials, articles, tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 rounded-xl"
          />
        </div>
        <Button type="submit" className="h-11 rounded-xl px-6">
          Search
        </Button>
      </form>

      {/* Tabs */}
      <div className="flex justify-center border-b pb-4 gap-4">
        <Button
          variant={activeTab === "all" ? "default" : "ghost"}
          onClick={() => setActiveTab("all")}
          className="rounded-xl"
        >
          All Results ({matchedArticles.length + matchedTools.length})
        </Button>
        <Button
          variant={activeTab === "articles" ? "default" : "ghost"}
          onClick={() => setActiveTab("articles")}
          className="rounded-xl gap-2"
        >
          <Newspaper className="h-4 w-4" />
          Articles ({matchedArticles.length})
        </Button>
        <Button
          variant={activeTab === "tools" ? "default" : "ghost"}
          onClick={() => setActiveTab("tools")}
          className="rounded-xl gap-2"
        >
          <Wrench className="h-4 w-4" />
          Tools ({matchedTools.length})
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-52 rounded-2xl border animate-pulse bg-muted/60" />
          ))}
        </div>
      ) : (
        <div className="space-y-12">
          {/* Tools Section */}
          {(activeTab === "all" || activeTab === "tools") && matchedTools.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
                Developer Tools ({matchedTools.length})
              </h3>
              <ToolGrid tools={matchedTools} />
            </div>
          )}

          {/* Articles Section */}
          {(activeTab === "all" || activeTab === "articles") && matchedArticles.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-primary" />
                Articles & Tutorials ({matchedArticles.length})
              </h3>
              <ArticleGrid articles={matchedArticles} />
            </div>
          )}

          {matchedArticles.length === 0 && matchedTools.length === 0 && (
            <div className="rounded-2xl border py-16 text-center text-muted-foreground">
              No articles or tools found matching &quot;{query}&quot;. Try searching for another keyword.
            </div>
          )}
        </div>
      )}
    </Container>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<Container className="py-16 text-center">Loading search...</Container>}>
      <SearchContent />
    </Suspense>
  );
}
