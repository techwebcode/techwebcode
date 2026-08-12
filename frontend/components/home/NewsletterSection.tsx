"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setSubmitted(true);
      toast.success("Thank you for subscribing to TechWebCode updates!");
      setEmail("");
    } else {
      toast.error("Please enter a valid email address.");
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-blue-950/30 via-background to-indigo-950/30 p-8 md:p-12 border-blue-500/20 shadow-lg">
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-500 border border-blue-500/20">
              <Mail className="h-6 w-6" />
            </div>

            <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
              Stay Ahead as a Developer
            </h2>

            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Get practical tutorials, useful developer tools, and new resources.
            </p>

            {submitted ? (
              <div className="mt-6 flex items-center justify-center gap-2 text-emerald-500 font-semibold bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-xl text-xs">
                <CheckCircle2 className="h-4 h-4" />
                <span>You&apos;re subscribed! Check your inbox for upcoming engineering updates.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  placeholder="enter.your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow transition hover:opacity-90 active:scale-95"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
