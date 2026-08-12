"use client";

import { Search } from "lucide-react";

interface HeroSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function HeroSearch({
  placeholder = "Search tutorials, tools, technologies...",
  onSearch,
}: HeroSearchProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const query = form.get("query")?.toString().trim() ?? "";

    if (!query) return;

    if (onSearch) {
      onSearch(query);
      return;
    }

    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 rounded-xl border bg-background p-2 shadow-sm"
    >
      <Search className="ml-2 h-5 w-5 text-muted-foreground" />

      <input
        name="query"
        type="text"
        placeholder={placeholder}
        className="flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
      />

      <button
        type="submit"
        className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
      >
        Search
      </button>
    </form>
  );
}