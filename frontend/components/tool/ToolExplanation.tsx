"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle, ShieldCheck, Zap, Sparkles, BookOpen, ArrowRight } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface RelatedArticleItem {
  title: string;
  slug: string;
  summary: string;
}

interface ToolExplanationProps {
  title: string;
  description: string;
  howToUse: string[];
  features: string[];
  faqs: FAQItem[];
  relatedArticles?: RelatedArticleItem[];
}

export default function ToolExplanation({
  title,
  description,
  howToUse,
  features,
  faqs,
  relatedArticles = [
    {
      title: "How to Format JSON and Debug Syntax Errors",
      slug: "how-to-format-json-and-fix-syntax-errors",
      summary: "Learn common JSON formatting rules, fix unquoted keys, and handle trailing commas.",
    },
    {
      title: "How to Fix Next.js Hydration Error",
      slug: "how-to-fix-nextjs-hydration-error",
      summary: "Complete guide to debugging client vs server HTML mismatches in Next.js.",
    },
  ],
}: ToolExplanationProps) {
  const pathname = usePathname();

  // On tool pages, ToolSeoSection is rendered directly on the server by ToolPage
  if (pathname?.startsWith("/tools/")) {
    return null;
  }

  return (
    <div className="mt-16 space-y-12 border-t pt-12">
      {/* Privacy Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl border bg-gradient-to-r from-emerald-950/20 via-background to-teal-950/20 border-emerald-500/30">
        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <div className="text-sm font-bold text-foreground">Client-Side Privacy Notice</div>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            Your input is processed locally in your browser and is not sent to TechWebCode servers.
          </p>
        </div>
      </div>

      {/* Main Explanation */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          About {title}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">
          {description}
        </p>
      </div>

      {/* Grid: How to Use & Features */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* How to Use */}
        <div className="rounded-2xl border bg-card p-6 space-y-4 shadow-sm">
          <h2 className="flex items-center gap-2 text-primary font-bold text-base">
            <Zap className="w-4 h-4" />
            <span>How to Run {title}</span>
          </h2>

          <ol className="space-y-3 text-xs text-muted-foreground list-decimal pl-4">
            {howToUse.map((step, idx) => (
              <li key={idx} className="leading-relaxed">
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Key Features */}
        <div className="rounded-2xl border bg-card p-6 space-y-4 shadow-sm">
          <h2 className="flex items-center gap-2 text-primary font-bold text-base">
            <Sparkles className="w-4 h-4" />
            <span>Key Features &amp; Supported Capabilities</span>
          </h2>

          <ul className="space-y-3 text-xs text-muted-foreground list-disc pl-4">
            {features.map((feat, idx) => (
              <li key={idx} className="leading-relaxed">
                {feat}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* FAQ Section */}
      {faqs && faqs.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 font-bold text-lg text-foreground">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h2>Frequently Asked Questions</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-xl border bg-card p-5 space-y-2">
                <h3 className="font-semibold text-xs sm:text-sm text-foreground">
                  {faq.question}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
