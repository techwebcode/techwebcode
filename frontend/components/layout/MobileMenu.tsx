"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  ChevronDown,
  Wrench,
  Code2,
  Search,
  X,
  Sun,
  Moon,
  Monitor,
  ArrowRight,
  Sparkles,
  LucideIcon,
  FileCode,
  CheckCircle2,
  Minimize2,
  Database,
  FileText,
  ArrowRightLeft,
  ShieldCheck,
  ArrowLeftRight,
  Key,
  Link as LinkIcon,
  RefreshCw,
  Clock,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDynamicNavData } from "@/hooks/useDynamicNavData";
import { useTheme } from "next-themes";

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

function resolveToolIcon(icon: any): LucideIcon {
  if (typeof icon === "function") return icon;
  if (typeof icon === "object" && icon !== null && "$$typeof" in icon) return icon as LucideIcon;
  if (typeof icon === "string") {
    const found = ICON_MAP[icon] || ICON_MAP[icon.toLowerCase()];
    if (found) return found;
  }
  return Wrench;
}

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    "JSON & DATA": true,
  });

  const pathname = usePathname();
  const { toolCategories } = useDynamicNavData();
  const { theme, setTheme } = useTheme();

  // Close sheet on navigation
  useEffect(() => {
    setIsOpen(false);
    setSearchQuery("");
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleCategory = (catTitle: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [catTitle]: !prev[catTitle],
    }));
  };

  // Flatten tools for instant live search
  const allTools = useMemo(() => {
    return toolCategories.flatMap((g) =>
      g.tools.map((t) => ({ ...t, categoryTitle: g.title }))
    );
  }, [toolCategories]);

  // Real-time search filter
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return allTools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.categoryTitle?.toLowerCase().includes(q)
    );
  }, [allTools, searchQuery]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="inline-flex items-center justify-center rounded-xl p-2.5 min-h-[44px] min-w-[44px] text-foreground hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open navigation menu</span>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[320px] sm:w-[380px] p-0 flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800"
      >
        {/* Drawer Header */}
        <SheetHeader className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex flex-row items-center justify-between shrink-0">
          <SheetTitle className="text-left font-extrabold text-xl tracking-tight">
            <span className="text-blue-600">Tech</span>
            <span className="text-slate-900 dark:text-slate-100">WebCode</span>
          </SheetTitle>
        </SheetHeader>

        {/* Scrollable Drawer Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Convenient In-Drawer Tool Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search 16+ developer tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-8 text-xs font-medium rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* If Searching: Render Immediate Search Results */}
          {searchQuery.trim() ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                <span>
                  {searchResults.length > 0
                    ? `Found ${searchResults.length} tool${searchResults.length === 1 ? "" : "s"}`
                    : "No matching tools found"}
                </span>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-[11px]"
                >
                  Clear filter
                </button>
              </div>

              {searchResults.length > 0 ? (
                <div className="space-y-1.5">
                  {searchResults.map((tool) => {
                    const Icon = resolveToolIcon(tool.icon);
                    const isCurrentTool = pathname === tool.href;

                    return (
                      <Link
                        key={tool.slug}
                        href={tool.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-start gap-3 p-3 rounded-xl min-h-[48px] transition-all text-left ${
                          isCurrentTool
                            ? "bg-blue-50 dark:bg-blue-950/40 border border-blue-500/30 text-blue-600 dark:text-blue-400"
                            : "bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100"
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-semibold text-xs leading-tight">
                              {tool.name}
                            </span>
                            {tool.badge && (
                              <span
                                className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase shrink-0 ${
                                  tool.badge === "NEW"
                                    ? "bg-rose-500 text-white"
                                    : "bg-amber-500 text-white"
                                }`}
                              >
                                {tool.badge}
                              </span>
                            )}
                          </div>
                          {tool.description && (
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                              {tool.description}
                            </p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
                  <p>Try searching for JSON, JWT, Regex, SQL, Diff, or Base64.</p>
                  <Link
                    href="/tools"
                    onClick={() => setIsOpen(false)}
                    className="inline-block font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Browse all developer tools →
                  </Link>
                </div>
              )}
            </div>
          ) : (
            /* Standard Mobile Navigation Menu */
            <nav className="space-y-2" aria-label="Mobile Main Navigation">
              {/* Home */}
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-xl font-semibold text-sm min-h-[44px] transition-colors ${
                  pathname === "/"
                    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold"
                    : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Home
              </Link>

              {/* Code Playground */}
              <Link
                href="/playground"
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-sm min-h-[44px] transition-colors ${
                  pathname.startsWith("/playground")
                    ? "bg-blue-600 text-white font-bold"
                    : "bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 font-bold"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  <span>Code Playground</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white dark:bg-blue-500 font-extrabold text-[9px] uppercase tracking-wide">
                  NEW
                </span>
              </Link>

              {/* Expandable Developer Tools Categories */}
              <div className="pt-2 pb-1 space-y-2">
                <div className="flex items-center justify-between px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Developer Tools</span>
                  </span>
                  <Link
                    href="/tools"
                    onClick={() => setIsOpen(false)}
                    className="text-blue-600 dark:text-blue-400 hover:underline capitalize font-bold text-xs"
                  >
                    View All →
                  </Link>
                </div>

                <div className="space-y-1.5">
                  {toolCategories.map((group) => {
                    const isExpanded = !!openCategories[group.title];

                    return (
                      <div
                        key={group.title}
                        className="rounded-2xl border border-slate-100 dark:border-slate-800/80 overflow-hidden bg-slate-50/50 dark:bg-slate-800/30"
                      >
                        <button
                          type="button"
                          onClick={() => toggleCategory(group.title)}
                          aria-expanded={isExpanded}
                          className="w-full flex items-center justify-between px-3 py-2.5 min-h-[44px] text-xs font-bold text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer text-left"
                        >
                          <div className="flex items-center gap-2">
                            <span>{group.title}</span>
                            <span className="px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-[9px] font-bold text-slate-600 dark:text-slate-300">
                              {group.tools.length}
                            </span>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isExpanded && (
                          <div className="px-2 pb-2 space-y-1 border-t border-slate-100 dark:border-slate-800/60 pt-1.5">
                            {group.tools.map((tool) => {
                              const Icon = resolveToolIcon(tool.icon);
                              const isCurrentTool = pathname === tool.href;

                              return (
                                <Link
                                  key={tool.slug}
                                  href={tool.href}
                                  onClick={() => setIsOpen(false)}
                                  className={`flex items-start gap-2.5 p-2 rounded-xl min-h-[44px] transition-colors ${
                                    isCurrentTool
                                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold"
                                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                                  }`}
                                >
                                  <div
                                    className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                                      isCurrentTool
                                        ? "bg-blue-600 text-white"
                                        : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                    }`}
                                  >
                                    <Icon className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="min-w-0 flex-1 space-y-0.5">
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="font-semibold text-xs leading-tight">
                                        {tool.name}
                                      </span>
                                      {tool.badge && (
                                        <span
                                          className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase shrink-0 ${
                                            tool.badge === "NEW"
                                              ? "bg-rose-500 text-white"
                                              : "bg-amber-500 text-white"
                                          }`}
                                        >
                                          {tool.badge}
                                        </span>
                                      )}
                                    </div>
                                    {tool.description && (
                                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-1">
                                        {tool.description}
                                      </p>
                                    )}
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* About */}
              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-xl font-semibold text-sm min-h-[44px] transition-colors ${
                  pathname === "/about"
                    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold"
                    : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                About
              </Link>

              {/* Contact */}
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-xl font-semibold text-sm min-h-[44px] transition-colors ${
                  pathname === "/contact"
                    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold"
                    : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Contact
              </Link>
            </nav>
          )}
        </div>

        {/* Drawer Footer with Theme Toggle & Catalog CTA */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/60 shrink-0 space-y-3">
          <Link
            href="/tools"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm min-h-[44px]"
          >
            <span>Explore All 16 Developer Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Theme Quick Selector in Mobile Drawer */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span className="font-medium text-[11px]">Theme</span>
            <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setTheme("light")}
                aria-label="Light theme"
                className={`p-1.5 rounded-lg transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center ${
                  theme === "light"
                    ? "bg-white text-amber-500 shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                <Sun className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                aria-label="Dark theme"
                className={`p-1.5 rounded-lg transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center ${
                  theme === "dark"
                    ? "bg-slate-700 text-blue-400 shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                <Moon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setTheme("system")}
                aria-label="System theme"
                className={`p-1.5 rounded-lg transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center ${
                  theme === "system"
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                <Monitor className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
