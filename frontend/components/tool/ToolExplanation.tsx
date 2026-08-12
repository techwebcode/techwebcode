"use client";

import React from "react";
import Link from "next/link";
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
  return (
    <div className="mt-16 space-y-12 border-t pt-12">
      {/* Privacy Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl border bg-gradient-to-r from-emerald-950/20 via-background to-teal-950/20 border-emerald-500/30">
        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-foreground">100% Privacy & Security Guarantee</h4>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            All data formatting, minification, and validation processing happens directly inside your web browser using client-side JavaScript. Your data never leaves your device or touches any server.
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
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Zap className="w-4 h-4" />
            <span>How to Use {title}</span>
          </div>

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
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Key Features</span>
          </div>

          <ul className="space-y-3 text-xs text-muted-foreground list-disc pl-4">
            {features.map((feat, idx) => (
              <li key={idx} className="leading-relaxed">
                {feat}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Related Engineering Articles (Tool -> Article Linking) */}
      {relatedArticles && relatedArticles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-bold text-base text-foreground">
            <BookOpen className="w-4 h-4 text-primary" />
            <span>Related Engineering Tutorials & Guides</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {relatedArticles.map((art, idx) => (
              <Link
                key={idx}
                href={`/articles/${art.slug}`}
                className="group flex flex-col justify-between rounded-xl border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div>
                  <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                    {art.title}
                  </h4>
                  <p className="mt-1.5 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-primary group-hover:translate-x-1 transition-transform">
                  <span>Read Tutorial</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Section */}
      {faqs && faqs.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 font-bold text-lg text-foreground">
            <HelpCircle className="w-5 h-5 text-primary" />
            <span>Frequently Asked Questions</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-xl border bg-card p-5 space-y-2">
                <h4 className="font-semibold text-xs text-foreground">
                  {faq.question}
                </h4>
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
