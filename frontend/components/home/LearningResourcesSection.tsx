"use client";

import Link from "next/link";
import SectionHeading from "./SectionHeading";
import { BookOpen, Map, Code, Cpu } from "lucide-react";

const resources = [
  {
    title: "Backend Engineering Roadmap",
    description: "Step-by-step path to master Go, Node.js, databases, microservices, and system architecture.",
    icon: Cpu,
    href: "/categories/backend",
    tag: "Roadmap",
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  },
  {
    title: "Frontend & Web Performance",
    description: "Modern guide to React, Next.js App Router, TypeScript, and Core Web Vitals optimization.",
    icon: Code,
    href: "/categories/frontend",
    tag: "Guide",
    color: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
  },
  {
    title: "DevOps & Cloud Infrastructure",
    description: "Hands-on tutorials for Docker, Kubernetes, CI/CD pipelines, and cloud deployments.",
    icon: Map,
    href: "/categories/devops",
    tag: "Tutorials",
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
  },
  {
    title: "System Design & Architecture",
    description: "Learn high-availability system patterns, caching strategies, and database indexing.",
    icon: BookOpen,
    href: "/categories/system-design",
    tag: "Reference",
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
  },
];

export default function LearningResourcesSection() {
  return (
    <section className="py-16 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Learning Resources & Roadmaps"
          description="Structured learning paths and technical references designed for developers."
          href="/articles"
          actionLabel="Explore All Guides"
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {resources.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                href={item.href}
                className="group relative flex flex-col justify-between rounded-xl border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg border bg-gradient-to-br ${item.color}`}>
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full border">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
                  <span>Start Learning</span>
                  <span>→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
