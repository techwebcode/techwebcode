"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Code2, Play, Sparkles, Terminal, CheckCircle2 } from "lucide-react";
import Container from "@/components/layout/Container";

const SUPPORTED_LANGUAGES = [
  { name: "HTML", slug: "html", ext: ".html" },
  { name: "CSS", slug: "css", ext: ".css" },
  { name: "JavaScript", slug: "javascript", ext: ".js" },
  { name: "TypeScript", slug: "typescript", ext: ".ts" },
  { name: "Python", slug: "python", ext: ".py" },
  { name: "Java", slug: "java", ext: ".java" },
  { name: "C", slug: "c", ext: ".c" },
  { name: "C++", slug: "cpp", ext: ".cpp" },
  { name: "Go", slug: "go", ext: ".go" },
  { name: "PHP", slug: "php", ext: ".php" },
  { name: "Rust", slug: "rust", ext: ".rs" },
];

export default function PlaygroundPromotionalSection() {
  return (
    <section className="py-12 bg-slate-900/50 dark:bg-slate-950/80 border-y border-border/50 relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/10 dark:bg-blue-600/10 blur-[100px] pointer-events-none rounded-full" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading, Value Prop & Language Chips */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-extrabold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Language Coding Environment</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Code Playground
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Write, run, and experiment with code directly in your browser. Zero setup, zero installation, and 100% client-side privacy guarantee.
              </p>
            </div>

            {/* Language Chips */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-muted-foreground tracking-wider uppercase">
                <span>10+ Languages Supported</span>
                <span className="text-blue-500 font-semibold">Browser & Compiler Runtimes</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <Link
                    key={lang.slug}
                    href={`/playground/${lang.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card hover:bg-blue-600 hover:text-white text-foreground border border-border/80 text-xs font-bold transition-all hover:scale-105 shadow-2xs group"
                  >
                    <span>{lang.name}</span>
                    <span className="text-[10px] text-muted-foreground group-hover:text-white/80 font-normal">
                      {lang.ext}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/playground"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 active:translate-y-0 text-sm"
              >
                <span>Open Playground</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/playground/python"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
              >
                <span>Try Python Online →</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Product Preview / Mini Editor Mockup */}
          <div className="lg:col-span-6 w-full min-w-0">
            <Link
              href="/playground/python"
              className="block group relative rounded-2xl border border-slate-700/80 bg-slate-950 shadow-2xl overflow-hidden transition-all duration-300 hover:border-blue-500/50 hover:shadow-blue-500/10"
              title="Click to Open Python Playground"
            >
              {/* Mini Window Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">main.py</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2.5 py-0.5 rounded-md">
                    Python 3 ▼
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold bg-blue-600 text-white px-2.5 py-1 rounded-md shadow-xs">
                    <Play className="w-3 h-3 fill-current" />
                    <span>Run</span>
                  </div>
                </div>
              </div>

              {/* Code Editor Body */}
              <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950 space-y-1 select-none">
                <div className="flex gap-4">
                  <span className="text-slate-600 select-none w-4 text-right">1</span>
                  <span>
                    <span className="text-purple-400 font-bold">def</span>{" "}
                    <span className="text-blue-400">greet_developer</span>(name):
                  </span>
                </div>
                <div className="flex gap-4">
                  <span className="text-slate-600 select-none w-4 text-right">2</span>
                  <span className="pl-4">
                    <span className="text-purple-400 font-bold">return</span>{" "}
                    <span className="text-emerald-300">f"Hello, &#123;name&#125;! Welcome to TechWebCode."</span>
                  </span>
                </div>
                <div className="flex gap-4">
                  <span className="text-slate-600 select-none w-4 text-right">3</span>
                  <span></span>
                </div>
                <div className="flex gap-4">
                  <span className="text-slate-600 select-none w-4 text-right">4</span>
                  <span>
                    <span className="text-yellow-300">print</span>(greet_developer(
                    <span className="text-emerald-300">"TechWebCode User"</span>))
                  </span>
                </div>
              </div>

              {/* Output Pane Mockup */}
              <div className="bg-slate-900/90 border-t border-slate-800 p-3 sm:p-4 font-mono text-xs">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase text-slate-400 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Output Terminal</span>
                  </div>
                  <span className="text-emerald-400 font-normal">Process exited with status 0</span>
                </div>
                <div className="text-emerald-300 font-semibold bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  Hello, TechWebCode User! Welcome to TechWebCode.
                </div>
              </div>

              {/* Hover Badge */}
              <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
                <div className="bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <Code2 className="w-4 h-4" />
                  <span>Click to Open Interactive Playground</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
