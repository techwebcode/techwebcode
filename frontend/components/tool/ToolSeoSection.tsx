import React from "react";
import Link from "next/link";
import { ToolSeoItem, TOOL_SEO_DATA } from "@/constants/toolSeoData";
import {
  ShieldCheck,
  Zap,
  Sparkles,
  HelpCircle,
  Code2,
  ArrowRight,
  BookOpen,
  Wrench,
  CheckCircle2,
} from "lucide-react";

interface ToolSeoSectionProps {
  data: ToolSeoItem;
}

export default function ToolSeoSection({ data }: ToolSeoSectionProps) {
  // Related tools mapped from data.relatedSlugs
  const relatedTools = data.relatedSlugs
    .map((slug) => TOOL_SEO_DATA[slug])
    .filter((t): t is ToolSeoItem => Boolean(t));

  return (
    <section aria-label={`${data.name} Documentation and Guide`} className="mt-16 space-y-12 border-t pt-12 text-foreground">
      {/* 1. Verified Privacy Notice */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl border bg-gradient-to-r from-emerald-950/20 via-background to-teal-950/20 border-emerald-500/30">
        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <span>🛡 Client-Side Privacy Guarantee</span>
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your tool input is processed locally in your browser and is not sent to TechWebCode servers. All formatting, parsing, encoding, and validation computations run directly inside your client browser memory.
          </p>
        </div>
      </div>

      {/* 2. Technical Overview & Specification */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <span>{data.category}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          About {data.name}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">
          {data.summary}
        </p>

        {/* Technical Specs Tags */}
        {data.technicalSpecs && data.technicalSpecs.length > 0 && (
          <div className="pt-2 flex flex-wrap gap-2">
            {data.technicalSpecs.map((spec, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-muted/60 border border-border text-foreground"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{spec}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 3. Practical Before / After Examples */}
      {data.examples && data.examples.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 font-bold text-xl text-foreground">
            <Code2 className="w-5 h-5 text-primary" />
            <h2>Practical Developer Examples</h2>
          </div>

          <div className="space-y-6">
            {data.examples.map((example, idx) => (
              <div key={idx} className="rounded-2xl border bg-card p-6 space-y-4 shadow-xs">
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-foreground">
                    {example.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {example.scenario}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 pt-2">
                  {/* Before */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1">
                      <span>✕</span> {example.beforeLabel}
                    </span>
                    <pre className="p-3.5 rounded-xl bg-muted/40 border border-border font-mono text-xs text-foreground overflow-x-auto leading-relaxed max-h-72">
                      <code>{example.beforeCode}</code>
                    </pre>
                  </div>

                  {/* After */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1">
                      <span>✓</span> {example.afterLabel}
                    </span>
                    <pre className="p-3.5 rounded-xl bg-muted/40 border border-border font-mono text-xs text-foreground overflow-x-auto leading-relaxed max-h-72">
                      <code>{example.afterCode}</code>
                    </pre>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground italic border-t pt-3">
                  <strong>Why it matters:</strong> {example.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Grid: How to Use & Key Features */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* How to Use */}
        <div className="rounded-2xl border bg-card p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-primary font-bold text-base">
            <Zap className="w-5 h-5" />
            <h2>How to Use {data.name}</h2>
          </div>

          <ol className="space-y-3 text-xs text-muted-foreground list-decimal pl-4">
            {data.howToUse.map((step, idx) => (
              <li key={idx} className="leading-relaxed">
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Key Features */}
        <div className="rounded-2xl border bg-card p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-primary font-bold text-base">
            <Sparkles className="w-5 h-5" />
            <h2>Key Features & Capabilities</h2>
          </div>

          <ul className="space-y-3 text-xs text-muted-foreground list-disc pl-4">
            {data.keyFeatures.map((feat, idx) => (
              <li key={idx} className="leading-relaxed">
                {feat}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 5. Frequently Asked Questions */}
      {data.faqs && data.faqs.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 font-bold text-xl text-foreground">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h2>Frequently Asked Questions</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {data.faqs.map((faq, idx) => (
              <div key={idx} className="rounded-xl border bg-card p-5 space-y-2 shadow-xs">
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

      {/* 6. Related Engineering Tutorials & Guides */}
      {data.relatedGuides && data.relatedGuides.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-bold text-lg text-foreground">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2>Related Engineering Tutorials & Guides</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {data.relatedGuides.map((guide, idx) => (
              <Link
                key={idx}
                href={`/articles/${guide.slug}`}
                className="group flex flex-col justify-between rounded-xl border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm"
              >
                <div>
                  <h3 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                    {guide.title}
                  </h3>
                  <p className="mt-1.5 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {guide.summary}
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

      {/* 7. Closely Related Developer Tools */}
      {relatedTools && relatedTools.length > 0 && (
        <div className="space-y-4 border-t pt-8">
          <div className="flex items-center gap-2 font-bold text-lg text-foreground">
            <Wrench className="w-5 h-5 text-primary" />
            <h2>Related Developer Tools</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group flex flex-col justify-between rounded-xl border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-sm"
              >
                <div className="space-y-1.5">
                  <div className="text-[10px] font-extrabold uppercase text-primary tracking-wider">
                    {tool.category}
                  </div>
                  <h3 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {tool.shortDescription}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-primary group-hover:translate-x-1 transition-transform">
                  <span>Open {tool.name}</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
