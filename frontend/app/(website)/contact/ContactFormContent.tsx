"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
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

export function ContactFormCard() {
  const searchParams = useSearchParams();
  const preselectedToolSlug = searchParams.get("tool") || searchParams.get("related_tool") || "";
  const typeParam = searchParams.get("type") || searchParams.get("reason") || searchParams.get("category") || "";

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
              subject: prev.subject || `[${match.name}] Support Inquiry`,
            }));
          }
        } else if (typeParam) {
          const lower = typeParam.toLowerCase();
          if (lower.includes("bug")) {
            setFormData((prev) => ({
              ...prev,
              reason: "Bug Report",
              subject: prev.subject || "Bug Report",
            }));
          }
        }
      } catch {
        // Fallback to FALLBACK_TOOLS quietly
      }
    }
    loadTools();
  }, [preselectedToolSlug, typeParam]);

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

  return (
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
  );
}

export default function ContactFormContent() {
  return (
    <Suspense fallback={<Card className="rounded-3xl border p-8 shadow-sm h-[500px] animate-pulse bg-muted/20" />}>
      <ContactFormCard />
    </Suspense>
  );
}
