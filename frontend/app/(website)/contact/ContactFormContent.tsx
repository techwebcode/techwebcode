"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/common/SectionHeading";
import { Mail, MapPin, Send, CheckCircle2, AlertCircle, HelpCircle, Loader2, Wrench } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import contactService from "@/services/contact";
import toolService from "@/services/tool.service";
import { FALLBACK_TOOLS } from "@/constants/navigationData";

const REASON_OPTIONS = [
  "Bug Report",
  "Technical Question",
  "Feature Request",
  "Tool Feedback",
  "Article/Content Feedback",
  "Business Inquiry",
  "Other",
];

function ContactFormInner() {
  const searchParams = useSearchParams();
  const preselectedToolSlug = searchParams.get("tool") || searchParams.get("related_tool") || "";

  const [tools, setTools] = useState<any[]>(FALLBACK_TOOLS);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    reason: "Technical Question",
    relatedToolId: "" as string | number,
    subject: "",
    message: "",
    website_url_hp: "", // Hidden Honeypot
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadTools() {
      try {
        const fetchedTools = await toolService.getTools();
        if (Array.isArray(fetchedTools) && fetchedTools.length > 0) {
          setTools(fetchedTools);
        }

        const currentToolList = fetchedTools && fetchedTools.length > 0 ? fetchedTools : FALLBACK_TOOLS;

        if (preselectedToolSlug) {
          const match = currentToolList.find(
            (t: any) => t.slug === preselectedToolSlug || String(t.id) === preselectedToolSlug
          );
          if (match) {
            setFormData((prev) => ({
              ...prev,
              relatedToolId: match.id,
              reason: "Bug Report",
              subject: `[${match.name}] Support Inquiry`,
            }));
          }
        }
      } catch (err) {
        // Fallback to FALLBACK_TOOLS quietly
      }
    }
    loadTools();
  }, [preselectedToolSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        reason: formData.reason,
        related_tool_id: formData.relatedToolId ? Number(formData.relatedToolId) : undefined,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        website_url_hp: formData.website_url_hp,
      };

      const res = await contactService.submitContactForm(payload);
      if (res.success) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          reason: "Technical Question",
          relatedToolId: "",
          subject: "",
          message: "",
          website_url_hp: "",
        });
      } else {
        setErrorMsg(res.message || "Failed to submit message.");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Server error submitting message. Please try again.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      q: "Are the tools on TechWebCode free to use?",
      a: "Yes! All developer tools on TechWebCode are completely free to use without requiring any sign-up or API keys.",
    },
    {
      q: "Is my data safe when using online tools like JSON Formatter or JWT Decoder?",
      a: "Absolutely. All utility functions execute 100% locally inside your web browser. No data is sent or logged on our servers.",
    },
    {
      q: "How fast do you respond to support requests?",
      a: "Our engineering team reviews inquiries daily and typically responds within 24 to 48 hours.",
    },
  ];

  return (
    <div className="space-y-16 py-12">
      {/* Header */}
      <section className="border-b bg-gradient-to-b from-background to-muted/40 pb-16 pt-8">
        <Container className="text-center space-y-6">
          <span className="inline-flex rounded-full border bg-background px-4 py-1 text-sm font-medium text-primary">
            💬 Technical Support & Inquiries
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
            Contact TechWebCode
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Have technical questions, bug reports, feature requests, or tool feedback? Submit a message below or email our team directly.
          </p>
        </Container>
      </section>

      <Container className="space-y-16">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Left Info Column */}
          <div className="space-y-6 lg:col-span-1">
            <h2 className="text-2xl font-bold">Reach Out Directly</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Whether you are reporting a bug, suggesting a new developer tool, or asking an engineering question, we are ready to assist.
            </p>

            <div className="space-y-4 pt-4">
              <Card className="rounded-2xl border p-4">
                <CardContent className="flex items-center gap-4 p-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Email Support</h4>
                    <p className="text-xs text-muted-foreground font-mono">support@techwebcode.in</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border p-4">
                <CardContent className="flex items-center gap-4 p-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Developer Tools Platform</h4>
                    <p className="text-xs text-muted-foreground">Client-side & Privacy-First Utilities</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border p-4">
                <CardContent className="flex items-center gap-4 p-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Location</h4>
                    <p className="text-xs text-muted-foreground">Global & Remote Operations</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="rounded-3xl border p-8 shadow-sm">
              <CardContent className="p-0">
                {submitted ? (
                  <div className="py-16 text-center space-y-4">
                    <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
                    <h3 className="text-2xl font-bold">Message Sent Successfully!</h3>
                    <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
                      Thank you for contacting TechWebCode. Your message has been saved and routed to support@techwebcode.in. We will reply to your email shortly.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setSubmitted(false)}
                      className="mt-4 rounded-xl font-semibold"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h3 className="text-xl font-bold">Send Support Message</h3>

                    {errorMsg && (
                      <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {/* Hidden Honeypot Field */}
                    <div className="hidden" aria-hidden="true">
                      <input
                        type="text"
                        name="website_url_hp"
                        tabIndex={-1}
                        value={formData.website_url_hp}
                        onChange={(e) => setFormData({ ...formData, website_url_hp: e.target.value })}
                        autoComplete="off"
                      />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Your Name *
                        </label>
                        <Input
                          required
                          placeholder="Jane Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="rounded-xl h-11 text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Email Address *
                        </label>
                        <Input
                          type="email"
                          required
                          placeholder="jane@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="rounded-xl h-11 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Reason *
                        </label>
                        <select
                          required
                          value={formData.reason}
                          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                          className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          {REASON_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Related Tool (Optional)
                        </label>
                        <select
                          value={formData.relatedToolId}
                          onChange={(e) => setFormData({ ...formData, relatedToolId: e.target.value })}
                          className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="">-- Select Tool --</option>
                          {tools.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Subject *
                      </label>
                      <Input
                        required
                        placeholder="Feature Request / Question Summary"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="rounded-xl h-11 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Message *
                      </label>
                      <Textarea
                        required
                        rows={5}
                        placeholder="Describe your question, bug report, or feedback in detail..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="rounded-xl resize-none text-sm"
                      />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl gap-2 font-bold uppercase tracking-wider text-xs">
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Support Message</span>
                          <Send className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-10 border-t pt-16">
          <SectionHeading
            title="Frequently Asked Questions"
            description="Quick answers to common questions about TechWebCode support."
          />

          <div className="grid gap-6 md:grid-cols-3">
            {faqs.map((faq) => (
              <Card key={faq.q} className="rounded-2xl border p-6">
                <CardContent className="p-0 space-y-3">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <HelpCircle className="h-5 w-5 shrink-0" />
                    <h4 className="text-base">{faq.q}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function ContactFormContent() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-sm font-semibold">Loading Contact Page...</div>}>
      <ContactFormInner />
    </Suspense>
  );
}
