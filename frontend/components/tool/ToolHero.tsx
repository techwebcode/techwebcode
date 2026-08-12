"use client";

import React from "react";
import Container from "@/components/layout/Container";
import ToolSearch from "./ToolSearch";

interface ToolHeroProps {
  onSearch?: (query: string) => void;
}

export default function ToolHero({ onSearch }: ToolHeroProps) {
  return (
    <section className="border-b bg-gradient-to-b from-background via-muted/20 to-muted/40 py-12 lg:py-16">
      <Container className="text-center space-y-6 max-w-4xl">
        <span className="inline-flex rounded-full border bg-card px-4 py-1 text-xs font-semibold shadow-xs">
          🚀 Free Developer Tools
        </span>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
          Developer Tools
        </h1>

        <p className="mx-auto max-w-2xl text-base text-muted-foreground leading-relaxed">
          Fast, privacy-first tools that run directly in your browser.
        </p>

        <div className="pt-2 max-w-xl mx-auto">
          <ToolSearch onSearch={onSearch} />
        </div>
      </Container>
    </section>
  );
}