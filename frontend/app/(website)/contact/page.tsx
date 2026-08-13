"use client";

import { useState } from "react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/common/SectionHeading";
import { Mail, MapPin, Send, CheckCircle2, MessageSquare, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API form submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  const faqs = [
    {
      q: "Are the tools on TechWebCode free to use?",
      a: "Yes! All developer tools on TechWebCode are completely free to use without requiring any sign-up or API keys.",
    },
    {
      q: "Is my data safe when using online tools like JSON Formatter or JWT Decoder?",
      a: "Absolutely. All utility functions execute locally inside your web browser. No data is sent or logged on our servers.",
    },
    {
      q: "How can I suggest a new tool or article topic?",
      a: "You can submit tool ideas or article requests directly using the contact form on this page or reaching out via email.",
    },
  ];

  return (
    <div className="space-y-16 py-12">
      {/* Header */}
      <section className="border-b bg-gradient-to-b from-background to-muted/40 pb-16 pt-8">
        <Container className="text-center space-y-6">
          <span className="inline-flex rounded-full border bg-background px-4 py-1 text-sm font-medium text-primary">
            💬 Get in Touch
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
            Contact Us
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Have questions, feedback, or tool suggestions? We&apos;d love to hear from you. Fill out the form below or send us an email.
          </p>
        </Container>
      </section>

      <Container className="space-y-16">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Left Info Column */}
          <div className="space-y-6 lg:col-span-1">
            <h2 className="text-2xl font-bold">Reach Out Directly</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Whether you are reporting an issue, requesting a feature, or asking a technical question, our team is ready to assist.
            </p>

            <div className="space-y-4 pt-4">
              <Card className="rounded-2xl border p-4">
                <CardContent className="flex items-center gap-4 p-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Email Support</h4>
                    <p className="text-xs text-muted-foreground">support@techwebcode.in</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border p-4">
                <CardContent className="flex items-center gap-4 p-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Developer Community</h4>
                    <p className="text-xs text-muted-foreground">Join our discussion forums & Discord</p>
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
            <Card className="rounded-3xl border p-8">
              <CardContent className="p-0">
                {submitted ? (
                  <div className="py-16 text-center space-y-4">
                    <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
                    <h3 className="text-2xl font-bold">Thank You!</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Your message has been sent successfully. We will get back to you shortly.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: "", email: "", subject: "", message: "" });
                      }}
                      className="mt-4 rounded-xl"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h3 className="text-xl font-bold">Send Us a Message</h3>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Your Name
                        </label>
                        <Input
                          required
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="rounded-xl h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Email Address
                        </label>
                        <Input
                          type="email"
                          required
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="rounded-xl h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Subject
                      </label>
                      <Input
                        required
                        placeholder="Feature Request / Question"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="rounded-xl h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Message
                      </label>
                      <Textarea
                        required
                        rows={5}
                        placeholder="How can we help you?"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="rounded-xl resize-none"
                      />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl gap-2 font-medium">
                      {loading ? "Sending..." : "Send Message"}
                      <Send className="h-4 w-4" />
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
            description="Quick answers to common questions about TechWebCode."
          />

          <div className="grid gap-6 md:grid-cols-3">
            {faqs.map((faq) => (
              <Card key={faq.q} className="rounded-2xl border p-6">
                <CardContent className="p-0 space-y-3">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <HelpCircle className="h-5 w-5" />
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
