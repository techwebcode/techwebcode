"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Sparkles,
  Wrench,
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
  Terminal,
  Cpu,
  Braces,
  Binary,
  Hash,
  LucideIcon,
} from "lucide-react";
import { TOOL_NAV_CATEGORIES, ToolCategoryGroup } from "@/constants/navigationData";

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
  Terminal,
  Cpu,
  Braces,
  Binary,
  Hash,
  "file-code": FileCode,
  "check-circle-2": CheckCircle2,
  "minimize-2": Minimize2,
  "code-2": Code2,
  "database": Database,
  "file-text": FileText,
  "arrow-right-left": ArrowRightLeft,
  "shield-check": ShieldCheck,
  "arrow-left-right": ArrowLeftRight,
  "key": Key,
  "link": LinkIcon,
  "refresh-cw": RefreshCw,
  "clock": Clock,
  "wrench": Wrench,
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

interface Props {
  isActive: boolean;
  categories?: ToolCategoryGroup[];
}

export default function ToolsMegaMenu({ isActive, categories }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const displayCategories = categories && categories.length > 0 ? categories : TOOL_NAV_CATEGORIES;

  // Dynamically partition all categories across 4 columns for balanced grid layout
  const columns: ToolCategoryGroup[][] = [[], [], [], []];
  displayCategories.forEach((catGroup, idx) => {
    if (catGroup.tools && catGroup.tools.length > 0) {
      columns[idx % 4].push(catGroup);
    }
  });

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const handleFocus = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
    }
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
      onFocus={handleFocus}
      onBlur={handleBlur}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Developer Tools Mega Menu"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold transition-all border focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
          isActive || isOpen
            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
            : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/20"
        }`}
      >
        <Wrench className="w-3.5 h-3.5" />
        <span>Tools</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* 100% Solid Opaque Mega-Menu Panel */}
      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[940px] max-w-[calc(100vw-32px)] z-50 animate-in fade-in-50 slide-in-from-top-1 duration-150">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-5 shadow-2xl space-y-4">
            {/* Header Banner */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  ✨ TECHWEBCODE DEVELOPER TOOLS
                </span>
              </div>
              <Link
                href="/tools"
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline flex items-center gap-1 transition-colors"
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
                          const Icon = resolveToolIcon(tool.icon);
                          return (
                            <Link
                              key={tool.slug}
                              href={tool.href}
                              onClick={() => setIsOpen(false)}
                              className="group flex items-start gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all duration-150 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
                                      className={`px-1.5 py-0.2 rounded text-[8px] font-extrabold uppercase shrink-0 ${
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
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-1">
                                    {tool.description}
                                  </p>
                                )}
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

