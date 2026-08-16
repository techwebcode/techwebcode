import { Metadata } from "next";
import Container from "@/components/layout/Container";
import { ShieldCheck, Lock, Mail, Server } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Privacy Policy | TechWebCode",
  description: "Learn about TechWebCode privacy practices, client-side browser processing, and contact information handling.",
};

export default function PrivacyPage() {
  return (
    <div className="space-y-16 py-12">
      <section className="border-b bg-gradient-to-b from-background to-muted/40 pb-16 pt-8">
        <Container className="text-center space-y-6">
          <span className="inline-flex rounded-full border bg-background px-4 py-1 text-sm font-medium text-primary">
            🔒 Privacy First Platform
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            TechWebCode is committed to protecting developer privacy. Learn how your data is processed locally and handled responsibly.
          </p>
        </Container>
      </section>

      <Container className="max-w-4xl space-y-10">
        <Card className="rounded-3xl border p-8 space-y-6 shadow-sm">
          <CardContent className="p-0 space-y-6 text-sm leading-relaxed text-muted-foreground">
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-500" />
                <span>1. 100% Client-Side Tool Processing</span>
              </h2>
              <p>
                All interactive developer tools on TechWebCode—including the JSON Formatter, JWT Decoder, Regex Tester & Explainer, Base64 Encoder, and YAML Formatter—run entirely inside your local web browser. Your payloads, JSON structures, tokens, and code snippets never leave your device or get transmitted to TechWebCode servers.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-500" />
                <span>2. Contact & Support Information Collection</span>
              </h2>
              <p>
                When you submit a message through our Contact page, we collect your name, email address, subject, message content, optional related tool context, and IP address. This information is used exclusively to:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 font-medium text-foreground">
                <li>Respond to your technical support inquiries, bug reports, and feature requests.</li>
                <li>Prevent automated spam, honeypot abuse, and server rate-limit violations.</li>
                <li>Maintain quality control for our developer tool platform.</li>
              </ul>
              <p>
                Contact information is never sold, leased, or shared with third-party advertisers.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-500" />
                <span>3. Data Retention & Security</span>
              </h2>
              <p>
                Contact messages are stored securely in our MySQL database. Access to message records is restricted to authorized site administrators. We implement industry-standard server-side input validation, rate limiting, and encrypted transport to safeguard your data.
              </p>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
