"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Command,
  ArrowRight,
  Clock,
  Sparkles,
  Terminal,
  Code2,
  FileCode,
  CheckCircle2,
  Minimize2,
  Database,
  FileText,
  ArrowLeftRight,
  ArrowRightLeft,
  Key,
  RefreshCw,
  ShieldCheck,
  Link as LinkIcon,
  X,
  History,
  Wrench,
  LucideIcon,
  Layers,
} from "lucide-react";
import { TOOL_NAV_CATEGORIES } from "@/constants/navigationData";

export interface SearchItem {
  id: string;
  name: string;
  category: string;
  description: string;
  href: string;
  icon: LucideIcon;
  badge?: "FEATURED" | "NEW" | "WASM" | "CLIENT";
  synonyms: string[];
}

// Complete searchable catalog with developer synonyms
const SEARCHABLE_ITEMS: SearchItem[] = [
  // 16 Tools
  {
    id: "json-formatter",
    name: "JSON Formatter & Beautifier",
    category: "JSON & Data",
    description: "Format, beautify, and inspect JSON payloads with 2/4 space indentation.",
    href: "/tools/json-formatter",
    icon: FileCode,
    badge: "FEATURED",
    synonyms: ["json", "pretty", "beautify", "indent", "format", "parse", "object", "tree", "json viewer"],
  },
  {
    id: "json-validator",
    name: "JSON Validator",
    category: "JSON & Data",
    description: "Validate JSON syntax with line-and-column error highlighting and strict duplicate checks.",
    href: "/tools/json-validator",
    icon: CheckCircle2,
    synonyms: ["json", "validate", "lint", "syntax", "rfc8259", "error", "check", "verify", "linter"],
  },
  {
    id: "json-minifier",
    name: "JSON Minifier",
    category: "JSON & Data",
    description: "Compact JSON payloads to reduce bandwidth and payload size.",
    href: "/tools/json-minifier",
    icon: Minimize2,
    synonyms: ["json", "minify", "compress", "strip", "compact", "whitespace", "size", "uglify"],
  },
  {
    id: "code-diff-checker",
    name: "Code Difference Checker",
    category: "JSON & Data",
    description: "Compare code versions side-by-side with split and unified diff highlighting.",
    href: "/tools/code-diff-checker",
    icon: ArrowLeftRight,
    badge: "NEW",
    synonyms: ["diff", "compare", "code", "merge", "changes", "side by side", "hunk", "patch", "git diff"],
  },
  {
    id: "jwt-decoder",
    name: "JWT Decoder",
    category: "Security & Crypto",
    description: "Inspect JSON Web Token headers, claims, signature, and expiration.",
    href: "/tools/jwt-decoder",
    icon: Key,
    synonyms: ["jwt", "token", "decode", "bearer", "auth", "claims", "payload", "header", "exp", "sign", "verify"],
  },
  {
    id: "base64",
    name: "Base64 Encoder & Decoder",
    category: "Security & Crypto",
    description: "Encode text to Base64 format or decode back to UTF-8 text.",
    href: "/tools/base64",
    icon: ArrowRightLeft,
    synonyms: ["base64", "btoa", "atob", "encode", "decode", "binary", "ascii", "string", "radix64"],
  },
  {
    id: "sha1-hash-generator",
    name: "SHA-1 Hash Generator",
    category: "Security & Crypto",
    description: "Generate 40-character SHA-1 cryptographic hash digests instantly.",
    href: "/tools/sha1-hash-generator",
    icon: Key,
    badge: "NEW",
    synonyms: ["sha1", "sha-1", "hash", "digest", "crypto", "checksum", "security", "integrity"],
  },
  {
    id: "uuid-generator",
    name: "UUID / GUID Generator",
    category: "Security & Crypto",
    description: "Generate cryptographically secure RFC 4122 Version 4 UUIDs.",
    href: "/tools/uuid-generator",
    icon: RefreshCw,
    synonyms: ["uuid", "guid", "v4", "unique", "random", "generator", "rfc4122", "identifier"],
  },
  {
    id: "yaml-formatter",
    name: "YAML Formatter & Kubernetes Secret",
    category: "DevOps & Cloud",
    description: "Format YAML manifests and encode/decode Kubernetes Secrets safely.",
    href: "/tools/yaml-formatter",
    icon: FileText,
    synonyms: ["yaml", "yml", "k8s", "kubernetes", "secret", "manifest", "helm", "format", "base64 secret"],
  },
  {
    id: "deployment-config-doctor",
    name: "Deployment Config Doctor",
    category: "DevOps & Cloud",
    description: "Audit Dockerfiles, Kubernetes manifests, and Compose files for security & syntax.",
    href: "/tools/deployment-config-doctor",
    icon: ShieldCheck,
    badge: "NEW",
    synonyms: ["doctor", "docker", "dockerfile", "k8s", "helm", "deployment", "env", "audit", "security", "lint"],
  },
  {
    id: "api-contract-checker",
    name: "API Contract Checker",
    category: "DevOps & Cloud",
    description: "Detect breaking changes in OpenAPI specs and JSON payload responses.",
    href: "/tools/api-contract-checker",
    icon: ArrowRightLeft,
    badge: "NEW",
    synonyms: ["api", "contract", "openapi", "swagger", "breaking change", "schema", "rest", "endpoint"],
  },
  {
    id: "regex-tester",
    name: "Regex Tester & Explainer",
    category: "Regex & SQL",
    description: "Test regular expressions with real-time match highlighting and plain-English breakdown.",
    href: "/tools/regex-tester",
    icon: Code2,
    badge: "FEATURED",
    synonyms: ["regex", "regexp", "regular expression", "pattern", "test", "match", "replace", "cheat sheet"],
  },
  {
    id: "sql-formatter",
    name: "SQL Formatter & Validator",
    category: "Regex & SQL",
    description: "Format, validate, and minify SQL queries online with dialect-aware AST parsing.",
    href: "/tools/sql-formatter",
    icon: Database,
    synonyms: [
      "sql",
      "query",
      "database",
      "mysql",
      "postgres",
      "postgresql",
      "sqlite",
      "tsql",
      "sql server",
      "format",
      "validate",
      "syntax",
      "minify",
      "beautify",
      "uppercase",
    ],
  },
  {
    id: "url-encoder-decoder",
    name: "URL Encoder & Decoder",
    category: "Web Utilities",
    description: "Percent-encode and decode URL query parameters and special characters.",
    href: "/tools/url-encoder-decoder",
    icon: LinkIcon,
    synonyms: ["url", "uri", "percent", "escape", "encode", "decode", "query string", "param"],
  },
  {
    id: "timestamp-converter",
    name: "Unix Timestamp Converter",
    category: "Web Utilities",
    description: "Convert Unix Epoch seconds/milliseconds to UTC, ISO 8601, and local time.",
    href: "/tools/timestamp-converter",
    icon: Clock,
    synonyms: ["timestamp", "unix", "epoch", "time", "date", "utc", "gmt", "iso", "millis", "seconds"],
  },
  {
    id: "comma-separator",
    name: "Comma Separator",
    category: "Web Utilities",
    description: "Convert lists to comma-separated values with trimming and deduplication.",
    href: "/tools/comma-separator",
    icon: FileText,
    badge: "NEW",
    synonyms: ["comma", "csv", "separator", "list", "delimit", "split", "join", "dedupe", "array"],
  },

  // Code Compilers / Playground
  {
    id: "playground-python",
    name: "Python Online Compiler",
    category: "Code Playground",
    description: "Client-side WebAssembly Python execution powered by Pyodide with zero server latency.",
    href: "/playground/python",
    icon: Terminal,
    badge: "WASM",
    synonyms: ["python", "py", "wasm", "webassembly", "run", "compiler", "pyodide", "code runner"],
  },
  {
    id: "playground-javascript",
    name: "JavaScript Playground",
    category: "Code Playground",
    description: "Run modern ES6+ JavaScript directly in browser with console log interception.",
    href: "/playground/javascript",
    icon: Terminal,
    badge: "CLIENT",
    synonyms: ["javascript", "js", "run", "compiler", "node", "console", "es6"],
  },
  {
    id: "playground-typescript",
    name: "TypeScript Playground",
    category: "Code Playground",
    description: "Compile and run TypeScript in-browser with live type checking.",
    href: "/playground/typescript",
    icon: Terminal,
    badge: "CLIENT",
    synonyms: ["typescript", "ts", "types", "compiler", "run"],
  },
  {
    id: "playground-go",
    name: "Go (Golang) Compiler",
    category: "Code Playground",
    description: "Run Go code client-side via WebAssembly compiler.",
    href: "/playground/go",
    icon: Terminal,
    badge: "WASM",
    synonyms: ["go", "golang", "wasm", "run", "compiler"],
  },
  {
    id: "playground-rust",
    name: "Rust Playground",
    category: "Code Playground",
    description: "Write and execute Rust programs with compiler diagnostic feedback.",
    href: "/playground/rust",
    icon: Terminal,
    badge: "CLIENT",
    synonyms: ["rust", "rs", "cargo", "run", "compiler"],
  },
  {
    id: "playground-sql",
    name: "SQL Playground (SQLite WASM)",
    category: "Code Playground",
    description: "Interactive SQLite WebAssembly database sandbox — create tables and run queries.",
    href: "/playground/sql",
    icon: Database,
    badge: "WASM",
    synonyms: ["sql", "sqlite", "database", "query", "wasm", "tables", "run"],
  },
  {
    id: "playground-html",
    name: "HTML5 / CSS / JS Live Editor",
    category: "Code Playground",
    description: "Live responsive web frontend viewport preview with multi-tab code editor.",
    href: "/playground/html",
    icon: Code2,
    badge: "CLIENT",
    synonyms: ["html", "css", "web", "dom", "preview", "live", "frontend"],
  },
  {
    id: "playground-c",
    name: "C Online Compiler",
    category: "Code Playground",
    description: "Compile and execute C code with standard library I/O.",
    href: "/playground/c",
    icon: Terminal,
    synonyms: ["c", "gcc", "clang", "compile", "run"],
  },
  {
    id: "playground-cpp",
    name: "C++ Online Compiler",
    category: "Code Playground",
    description: "Compile modern C++ with STL support and execution output.",
    href: "/playground/cpp",
    icon: Terminal,
    synonyms: ["cpp", "c++", "clang++", "stl", "compile", "run"],
  },
  {
    id: "playground-java",
    name: "Java Online Compiler",
    category: "Code Playground",
    description: "Run Java classes with standard in/out terminal logging.",
    href: "/playground/java",
    icon: Terminal,
    synonyms: ["java", "jvm", "compiler", "run"],
  },
];

const RECENT_TOOLS_KEY = "techwebcode_recent_tools";
const MAX_RECENT = 4;

export default function CommandSearchDialog() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const [isMac, setIsMac] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Detect Mac vs Windows/Linux for keyboard symbol
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  // Load recently used tools from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_TOOLS_KEY);
      if (stored) {
        setRecentSlugs(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, [isOpen]);

  // Global keydown listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-search", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-search", handleCustomOpen);
    };
  }, [isOpen]);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Record a visited tool to recent history
  const recordRecentTool = useCallback((id: string) => {
    try {
      setRecentSlugs((prev) => {
        const updated = [id, ...prev.filter((item) => item !== id)].slice(0, MAX_RECENT);
        localStorage.setItem(RECENT_TOOLS_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch {
      // ignore
    }
  }, []);

  const clearRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      localStorage.removeItem(RECENT_TOOLS_KEY);
      setRecentSlugs([]);
    } catch {
      // ignore
    }
  };

  // Find recent tools
  const recentItems = useMemo(() => {
    return recentSlugs
      .map((slug) => SEARCHABLE_ITEMS.find((item) => item.id === slug))
      .filter((item): item is SearchItem => Boolean(item));
  }, [recentSlugs]);

  // Filter items matching query
  const filteredItems = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    return SEARCHABLE_ITEMS.filter((item) => {
      if (item.name.toLowerCase().includes(q)) return true;
      if (item.description.toLowerCase().includes(q)) return true;
      if (item.category.toLowerCase().includes(q)) return true;
      return item.synonyms.some((syn) => syn.toLowerCase().includes(q) || q.includes(syn));
    });
  }, [query]);

  // The active list being displayed for arrow-key navigation
  const activeItems = useMemo(() => {
    if (query.trim()) return filteredItems;
    // When query is empty, allow navigating through recents and featured
    const popular = SEARCHABLE_ITEMS.filter((item) => item.badge === "FEATURED" || item.badge === "WASM").slice(0, 5);
    return [...recentItems, ...popular.filter((p) => !recentItems.some((r) => r.id === p.id))];
  }, [query, filteredItems, recentItems]);

  // Reset selected index when active items change
  useEffect(() => {
    setSelectedIndex(0);
  }, [activeItems.length, query]);

  // Keyboard navigation through search results
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (activeItems.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % activeItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + activeItems.length) % activeItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = activeItems[selectedIndex];
      if (target) {
        handleSelect(target);
      }
    }
  };

  const handleSelect = (item: SearchItem) => {
    recordRecentTool(item.id);
    setIsOpen(false);
    router.push(item.href);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Search tools and code compilers"
    >
      <div
        className="w-full max-w-2xl bg-card border border-border/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-border/60 bg-muted/20">
          <Search className="w-5 h-5 text-muted-foreground mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search 16+ tools & 12 compilers (e.g., json, jwt, regex, wasm, diff)..."
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-sm focus:outline-none"
            aria-label="Search query"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 hover:text-foreground text-muted-foreground transition-colors mr-2 cursor-pointer"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-muted-foreground bg-muted rounded border border-border select-none shrink-0">
            ESC
          </kbd>
        </div>

        {/* Results / Navigation Body */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 space-y-4">
          {/* Query has matching items */}
          {query.trim() && filteredItems.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Matching Tools & Compilers ({filteredItems.length})
              </div>
              {filteredItems.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                        : "text-foreground hover:bg-muted/50 border border-transparent"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm truncate">{item.name}</span>
                        {item.badge && (
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                              item.badge === "WASM"
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : item.badge === "NEW"
                                ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                                : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        <span className="text-[11px] text-muted-foreground ml-auto hidden sm:inline">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                    <ArrowRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected ? "translate-x-0.5 text-blue-500" : "opacity-0"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* Zero results Empty State */}
          {query.trim() && filteredItems.length === 0 && (
            <div className="py-12 px-6 text-center space-y-4">
              <div className="inline-flex p-3 rounded-full bg-muted/60 text-muted-foreground">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-foreground">
                  No tools matching &ldquo;{query}&rdquo;
                </h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                  Try searching for a category, file format, or developer keyword like JSON, JWT, Regex, SQL, or WASM.
                </p>
              </div>

              {/* Suggestions chips */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 max-w-md mx-auto">
                {["JSON Formatter", "JWT Decoder", "Regex Tester", "Code Diff", "Python WASM", "SQL Formatter"].map(
                  (suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setQuery(suggestion)}
                      className="px-2.5 py-1 text-xs rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors cursor-pointer border border-border"
                    >
                      {suggestion}
                    </button>
                  )
                )}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/tools");
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-500 font-semibold cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Browse Full Tools Catalog (16 Utilities)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Empty Query: Display Recently Used & Featured Shortcuts */}
          {!query.trim() && (
            <div className="space-y-4">
              {/* Recently Used Tools (if any) */}
              {recentItems.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-3 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5" />
                      Recently Used
                    </span>
                    <button
                      type="button"
                      onClick={clearRecent}
                      className="text-[10px] text-muted-foreground hover:text-foreground font-normal lowercase hover:underline cursor-pointer"
                    >
                      clear
                    </button>
                  </div>

                  {recentItems.map((item, idx) => {
                    const Icon = item.icon;
                    const isSelected = idx === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                            : "text-foreground hover:bg-muted/50 border border-transparent"
                        }`}
                      >
                        <div
                          className={`p-1.5 rounded-lg shrink-0 ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-sm truncate">{item.name}</span>
                          <span className="text-[11px] text-muted-foreground ml-2">
                            {item.category}
                          </span>
                        </div>
                        <ArrowRight
                          className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                            isSelected ? "translate-x-0.5 text-blue-500" : "opacity-0"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Popular Tools */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Popular Tools & Compilers
                </div>
                {SEARCHABLE_ITEMS.filter((item) => item.badge === "FEATURED" || item.badge === "WASM")
                  .slice(0, 5)
                  .map((item, idx) => {
                    const globalIdx = recentItems.length + idx;
                    const Icon = item.icon;
                    const isSelected = globalIdx === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                            : "text-foreground hover:bg-muted/50 border border-transparent"
                        }`}
                      >
                        <div
                          className={`p-1.5 rounded-lg shrink-0 ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-sm truncate">{item.name}</span>
                          <span className="text-[11px] text-muted-foreground ml-2">
                            {item.category}
                          </span>
                        </div>
                        {item.badge && (
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                              item.badge === "WASM"
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>

              {/* Direct Link to Full Catalog */}
              <div className="pt-2 border-t border-border/40 px-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/tools");
                  }}
                  className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-500 font-semibold cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Browse Full Tools Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/playground");
                  }}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Multi-Language Playground</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Shortcut Legend */}
        <div className="flex items-center justify-between px-4 py-2 bg-muted/40 border-t border-border/60 text-[11px] text-muted-foreground select-none">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px]">↓</kbd>
              <span className="ml-1">to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px]">↵</kbd>
              <span className="ml-1">to select</span>
            </span>
          </div>
          <span className="hidden sm:inline text-muted-foreground/80">
            {isMac ? "⌘K" : "Ctrl+K"} anytime to search
          </span>
        </div>
      </div>
    </div>
  );
}

