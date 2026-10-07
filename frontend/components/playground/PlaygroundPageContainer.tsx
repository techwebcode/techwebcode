"use client";

import React from "react";
import Link from "next/link";
import { LANGUAGES, LanguageConfig } from "./languages.config";
import PlaygroundEngine from "./PlaygroundEngine";
import ClientSidePrivacyNotice from "@/components/tool/workspace/ClientSidePrivacyNotice";
import ToolExplanation from "@/components/tool/ToolExplanation";
import { Code2, ChevronRight, Sparkles } from "lucide-react";

interface PlaygroundPageContainerProps {
  languageConfig: LanguageConfig;
}

export default function PlaygroundPageContainer({
  languageConfig,
}: PlaygroundPageContainerProps) {
  return (
    <div className="min-h-screen bg-background text-foreground space-y-6 pb-16">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <nav className="flex items-center gap-2 text-xs font-semibold text-muted-foreground select-none">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/playground" className="hover:text-foreground transition-colors">
            Playground
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-bold">{languageConfig.name}</span>
        </nav>

        {/* Page Title & H1 Header */}
        <div className="mt-4 space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Language Code Playground</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {languageConfig.seo.h1}
          </h1>
          <p className="text-sm text-muted-foreground max-w-3xl">
            {languageConfig.seo.description}
          </p>
        </div>
      </div>

      {/* Main Interactive Playground Engine */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <PlaygroundEngine languageConfig={languageConfig} />
      </div>

      {/* Security & Privacy Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ClientSidePrivacyNotice />
      </div>

      {/* Related Languages Navigation Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4 pt-4">
        <div className="flex items-center gap-2 text-sm font-bold tracking-wide uppercase text-muted-foreground">
          <Code2 className="w-4 h-4 text-blue-500" />
          <span>Explore Other Online Playgrounds & Compilers</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Object.values(LANGUAGES).map((lang) => {
            const isActive = lang.slug === languageConfig.slug;
            return (
              <Link
                key={lang.slug}
                href={`/playground/${lang.slug}`}
                className={`flex flex-col p-3 rounded-xl border text-xs font-bold transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-card hover:bg-muted text-foreground border-border hover:border-primary/50"
                }`}
              >
                <span className="text-sm">{lang.name}</span>
                <span
                  className={`text-[10px] font-normal mt-0.5 ${
                    isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                  }`}
                >
                  .{lang.extension} • {lang.executionType === "client" ? "Browser" : "Compiler"}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* SEO Educational Content & FAQs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <ToolExplanation
          title={languageConfig.seo.h1}
          description={languageConfig.content.overview}
          howToUse={languageConfig.content.howToUse}
          features={languageConfig.content.features}
          faqs={languageConfig.content.faqs}
        />
      </div>
    </div>
  );
}
