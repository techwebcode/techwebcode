"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Command,
  ArrowRight,
  FileCode,
  CheckCircle2,
  Minimize2,
  Code2,
  Database,
  FileText,
  ArrowRightLeft,
  ShieldCheck,
  ArrowLeftRight,
  Key,
  Link as LinkIcon,
  RefreshCw,
  Clock,
  Wrench,
  LucideIcon,
} from "lucide-react";
import { TOOL_NAV_CATEGORIES, ToolNavItem } from "@/constants/navigationData";

const ICON_MAP: Record<string, LucideIcon> = {
  FileCode,
  CheckCircle2,
  Minimize2,
  Code2,
  Database,
  FileText,
  ArrowRightLeft,
  ShieldCheck,
  ArrowLeftRight,
  Key,
  Link: LinkIcon,
  LinkIcon,
  RefreshCw,
  Clock,
  Wrench,
};

function resolveIcon(icon: any): LucideIcon {
  if (typeof icon === "function") return icon;
  if (typeof icon === "object" && icon !== null) return icon as LucideIcon;
  if (typeof icon === "string" && ICON_MAP[icon]) return ICON_MAP[icon];
  return Wrench;
}

interface HeroSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function HeroSearch({
  placeholder = "Search developer tools...",
  onSearch,
}: HeroSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isMac, setIsMac] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce user input to prevent excessive recalculations
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 150);
    return () => clearTimeout(handler);
  }, [query]);

  // Flatten all tools with their parent category name
  const allTools = useMemo(() => {
    const list: { tool: ToolNavItem; category: string }[] = [];
    TOOL_NAV_CATEGORIES.forEach((cat) => {
      cat.tools.forEach((t) => {
        list.push({ tool: t, category: cat.title });
      });
    });
    return list;
  }, []);

  // Filtered tools matching current debounced search query
  const matches = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase().trim();
    return allTools
      .filter(
        (item) =>
          item.tool.name.toLowerCase().includes(q) ||
          item.tool.description.toLowerCase().includes(q) ||
          item.tool.slug.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [debouncedQuery, allTools]);

  // Detect platform for shortcut symbol (⌘ vs Ctrl)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
    }
  }, []);

  // Global ⌘ K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectTool = (href: string) => {
    setIsOpen(false);
    setQuery("");
    setDebouncedQuery("");
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
      return;
    }

    if (!matches.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < matches.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : matches.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0 && selectedIndex < matches.length) {
      e.preventDefault();
      handleSelectTool(matches[selectedIndex].tool.href);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (selectedIndex >= 0 && selectedIndex < matches.length) {
      handleSelectTool(matches[selectedIndex].tool.href);
      return;
    }

    if (matches.length > 0) {
      handleSelectTool(matches[0].tool.href);
      return;
    }

    if (onSearch) {
      onSearch(query.trim());
      setIsOpen(false);
      return;
    }

    setIsOpen(false);
    router.push(`/tools?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <form
        onSubmit={handleSubmit}
        className="group relative flex items-center rounded-2xl border border-slate-300/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-2 shadow-lg transition-all duration-200 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/15 dark:focus-within:ring-blue-500/20"
      >
        <div className="flex items-center pl-3.5 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
          <Search className="h-5 w-5" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-3 py-2.5 text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
          aria-label="Search developer tools"
        />

        {/* Keyboard Shortcut Indicator */}
        <button
          type="button"
          onClick={() => inputRef.current?.focus()}
          className="hidden sm:flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 transition hover:bg-slate-200 dark:hover:bg-slate-700"
          title="Press ⌘K to search"
        >
          {isMac ? (
            <>
              <Command className="h-3 w-3" />
              <span>K</span>
            </>
          ) : (
            <span>Ctrl K</span>
          )}
        </button>

        <button
          type="submit"
          className="ml-2 rounded-xl bg-blue-600 dark:bg-blue-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-95 shrink-0"
        >
          Search
        </button>
      </form>

      {/* Live Auto-Suggest Results Dropdown */}
      {isOpen && matches.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-2xl animate-in fade-in-50 slide-in-from-top-1">
          <div className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/60 flex justify-between items-center">
            <span>Matching Developer Tools ({matches.length})</span>
            <span className="text-[10px] text-slate-400">Use ↑↓ keys to navigate</span>
          </div>

          <div className="mt-1 space-y-1">
            {matches.map(({ tool, category }, idx) => {
              const Icon = resolveIcon(tool.icon);
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={tool.slug}
                  type="button"
                  onClick={() => handleSelectTool(tool.href)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left ${
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                          {tool.name}
                        </span>
                        {tool.badge && (
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                              tool.badge === "NEW"
                                ? "bg-rose-500 text-white"
                                : "bg-amber-500 text-white"
                            }`}
                          >
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate leading-tight">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {category}
                    </span>
                    <ArrowRight
                      className={`h-4 w-4 transition-transform ${
                        isSelected
                          ? "text-blue-600 dark:text-blue-400 translate-x-0.5"
                          : "text-slate-300 dark:text-slate-600"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}