"use client";

import React from "react";
import Link from "next/link";
import { X, Wrench, ArrowRight } from "lucide-react";
import { TOOL_NAV_CATEGORIES } from "@/constants/navigationData";

interface LeftToolsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlug: string;
}

export default function LeftToolsPanel({
  isOpen,
  onClose,
  currentSlug,
}: LeftToolsPanelProps) {
  if (!isOpen) return null;

  // Find category matching current tool or default to first
  const activeCategoryGroup =
    TOOL_NAV_CATEGORIES.find((catGroup) =>
      catGroup.tools.some((t) => t.slug === currentSlug)
    ) || TOOL_NAV_CATEGORIES[0];

  return (
    <aside
      className="w-72 shrink-0 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-lg flex flex-col justify-between animate-in fade-in duration-200"
      aria-label="Related Tools Navigation"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
              TOOLS ({activeCategoryGroup.title})
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            title="Close Tools Panel"
            aria-label="Close tools panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tools List */}
        <div className="space-y-1 overflow-y-auto max-h-[460px]">
          {activeCategoryGroup.tools.map((t) => {
            const isActive = t.slug === currentSlug;
            return (
              <Link
                key={t.slug}
                href={t.href}
                className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm font-bold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <span className="truncate">{t.name}</span>
                {t.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[8px] font-extrabold uppercase shrink-0 ${
                      isActive
                        ? "bg-white/20 text-white"
                        : t.badge === "NEW"
                        ? "bg-rose-500 text-white"
                        : "bg-amber-500 text-white"
                    }`}
                  >
                    {t.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
        <Link
          href="/tools"
          className="flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <span>View all tools</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </aside>
  );
}
