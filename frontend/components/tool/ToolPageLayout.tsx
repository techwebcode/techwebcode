"use client";

import React from "react";
import Breadcrumbs, { BreadcrumbItem } from "@/components/common/Breadcrumbs";
import AdBanner from "@/components/common/AdBanner";
import ToolSeoSection from "@/components/tool/ToolSeoSection";
import { ToolSeoItem } from "@/constants/toolSeoData";
import { ShieldCheck } from "lucide-react";
import { ToolPageContext } from "./ToolPageContext";

export interface ToolPrivacyConfig {
  isClientSide?: boolean;
  title?: string;
  description?: string;
}

export interface ToolPageLayoutProps {
  /** Breadcrumb navigation hierarchy */
  breadcrumbs?: BreadcrumbItem[];
  /** Primary H1 title for the tool */
  title: string;
  /** Optional category or status badge (e.g. "JSON & Data", "Utilities") */
  badge?: string;
  /** Compact, one- or two-line description placed directly below H1 */
  description?: string;
  /** The interactive tool workspace (editors, toolbars, controls) */
  children: React.ReactNode;
  /** Detailed SEO guide, technical specs, FAQs, and related tools data */
  seoData?: ToolSeoItem | null;
  /** Custom privacy notice settings (defaults to client-side notice) */
  privacyNotice?: ToolPrivacyConfig | false;
  /** Optional custom below-tool content */
  belowToolContent?: React.ReactNode;
  /** AdSense ad slot for non-intrusive bottom banner */
  adSlot?: string;
  /** Additional container styling */
  className?: string;
}

/**
 * Standard, tool-first page layout for TechWebCode interactive developer tools.
 *
 * Page Hierarchy:
 * - Above the fold:
 *   1. Breadcrumbs
 *   2. Compact Tool Title (H1) + Badge
 *   3. Compact 1-2 line description
 *   4. Main Interactive Workspace (children)
 *
 * - Below the tool:
 *   1. Compact privacy & processing notice
 *   2. Detailed technical overview & documentation
 *   3. Instructions (How to use)
 *   4. Key features & supported operations
 *   5. Real-world code examples
 *   6. Frequently asked questions
 *   7. Closely related developer tools
 *   8. Bottom Ad Banner
 */
export default function ToolPageLayout({
  breadcrumbs,
  title,
  badge,
  description,
  children,
  seoData,
  privacyNotice = { isClientSide: true },
  belowToolContent,
  adSlot = "8877665544",
  className = "",
}: ToolPageLayoutProps) {
  return (
    <div
      className={`w-[calc(100%-24px)] sm:w-[calc(100%-32px)] lg:w-[calc(100%-48px)] max-w-[1800px] mx-auto py-5 sm:py-6 space-y-6 ${className}`}
    >
      {/* 1. Breadcrumb Navigation */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} />
      )}

      {/* 2. Tool-First Header: Compact Title & 1-2 line description */}
      <header className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          {badge && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              {badge}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {title}
          </h1>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">
            {description}
          </p>
        )}
      </header>

      {/* 3. Main Tool Workspace (Immediate above-the-fold interaction) */}
      <ToolPageContext.Provider
        value={{
          inToolPageLayout: true,
          toolSlug: seoData?.slug,
          isClientSide: privacyNotice ? privacyNotice.isClientSide : true,
        }}
      >
        <main className="tool-workspace w-full">{children}</main>
      </ToolPageContext.Provider>

      {/* 4. Compact Privacy & Processing Notice (Positioned below the tool) */}
      {privacyNotice && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-muted/20 text-xs text-foreground">
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              <strong>
                {privacyNotice.title ||
                  (privacyNotice.isClientSide
                    ? "Client-Side Processing:"
                    : "Secure Processing:")}
              </strong>{" "}
              {privacyNotice.description ||
                (privacyNotice.isClientSide
                  ? "Your input is processed locally in your browser and is not sent to TechWebCode servers."
                  : "Data is transmitted over encrypted TLS connections and never permanently stored.")}
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground font-mono bg-background/80 px-2 py-0.5 rounded border shrink-0">
            {privacyNotice.isClientSide
              ? "Zero Server Transmission"
              : "Encrypted Transit"}
          </span>
        </div>
      )}

      {/* 5. Server-Rendered Educational SEO Guide, Examples, FAQs & Related Tools */}
      {seoData && <ToolSeoSection data={seoData} />}

      {/* Optional Custom Below-Tool Content */}
      {belowToolContent}

      {/* 6. Non-Intrusive Bottom Ad Banner */}
      {adSlot && <AdBanner slot={adSlot} className="mt-8" />}
    </div>
  );
}
