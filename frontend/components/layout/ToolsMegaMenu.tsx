"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Sparkles, Wrench } from "lucide-react";
import { TOOL_NAV_CATEGORIES, ToolCategoryGroup } from "@/constants/navigationData";

interface Props {
  isActive: boolean;
  categories?: ToolCategoryGroup[];
}

export default function ToolsMegaMenu({ isActive, categories }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const displayCategories = categories && categories.length > 0 ? categories : TOOL_NAV_CATEGORIES;

  // Organize 8 categories into 4 structured columns for perfect grid balance
  const column1 = displayCategories.filter(c => ["JSON & DATA", "TEXT & ENCODING"].includes(c.title));
  const column2 = displayCategories.filter(c => ["REGEX & SQL", "SECURITY"].includes(c.title));
  const column3 = displayCategories.filter(c => ["API & DEVOPS", "GENERATORS"].includes(c.title));
  const column4 = displayCategories.filter(c => ["YAML & KUBERNETES", "DATE & TIME"].includes(c.title));

  const columns = [column1, column2, column3, column4];

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Developer Tools Mega Menu"
        className={`flex items-center gap-1 py-2 text-sm font-medium transition-colors hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg px-2 ${
          isActive || isOpen ? "text-blue-600 font-semibold" : "text-muted-foreground"
        }`}
      >
        <span>Tools</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180 text-blue-600" : ""}`} />
      </button>

      {/* 100% Solid Opaque Mega-Menu Panel */}
      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[940px] max-w-[calc(100vw-32px)] z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-5 shadow-2xl space-y-4">
            {/* Header Banner */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  TechWebCode Developer Tools
                </span>
              </div>
              <Link
                href="/tools"
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>View All Tools Catalog</span>
                <span>→</span>
              </Link>
            </div>

            {/* Balanced 4 Column Stack Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {columns.map((colGroups, colIdx) => (
                <div key={colIdx} className="space-y-5">
                  {colGroups.map((group) => (
                    <div key={group.title} className="space-y-1.5">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
                        {group.title}
                      </h4>

                      <div className="space-y-0.5">
                        {group.tools.map((tool) => {
                          const Icon = typeof tool.icon === "function" ? tool.icon : Wrench;
                          return (
                            <Link
                              key={tool.slug}
                              href={tool.href}
                              onClick={() => setIsOpen(false)}
                              className="group flex items-start gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all duration-150 text-left"
                            >
                              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0 mt-0.5">
                                <Icon className="w-3.5 h-3.5" />
                              </div>

                              <div className="space-y-0.5 min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1 flex-wrap">
                                  <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                                    {tool.name}
                                  </span>
                                  {tool.badge && (
                                    <span
                                      className={`px-1 py-0.1 rounded text-[8px] font-extrabold uppercase shrink-0 ${
                                        tool.badge === "NEW"
                                          ? "bg-rose-500 text-white"
                                          : "bg-amber-500 text-white"
                                      }`}
                                    >
                                      {tool.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-1">
                                  {tool.description}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
