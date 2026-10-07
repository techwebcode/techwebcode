import { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { Lock, Mail, Server, Cookie } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Privacy Policy | TechWebCode",
  description:
    "Learn about TechWebCode privacy practices, client-side browser processing, cookies, and contact information handling.",
  alternates: {
    canonical: "https://techwebcode.in/privacy",
  },
  openGraph: {
    title: "Privacy Policy | TechWebCode",
    description:
      "Learn about TechWebCode privacy practices, client-side browser processing, and contact information handling.",
    url: "https://techwebcode.in/privacy",
    siteName: "TechWebCode",
    type: "website",
  },
};

export default function PrivacyPage() {
  const breadcrumbItems = [{ label: "Privacy Policy" }];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://techwebcode.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Privacy Policy",
        item: "https://techwebcode.in/privacy",
      },
    ],
  };

  return (
    <div className="space-y-16 py-8 lg:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="border-b bg-gradient-to-b from-background to-muted/40 pb-12 pt-4">
        <Container className="space-y-6">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="text-center space-y-4 pt-2">
            <span className="inline-flex rounded-full border bg-background px-4 py-1 text-sm font-medium text-primary">
              🔒 Privacy First Platform
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl text-foreground">
              Privacy Policy
            </h1>
            <p className="mx-auto max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
              TechWebCode is committed to developer privacy. Learn how your data is processed locally and handled responsibly.
            </p>
          </div>
        </Container>
      </section>

      <Container className="max-w-4xl space-y-10">
        <Card className="rounded-3xl border p-8 space-y-6 shadow-sm">
          <CardContent className="p-0 space-y-6 text-sm leading-relaxed text-muted-foreground">
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>1. Client-Side Tool Processing</span>
              </h2>
              <p>
                All interactive developer tools on TechWebCode—including the JSON Formatter, JWT Decoder, Regex Tester, Base64 Encoder, and YAML Formatter—run locally inside your web browser using client-side JavaScript. Your tool input is processed locally in your browser and is not sent to TechWebCode servers.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                <span>2. Contact & Support Information Collection</span>
              </h2>
              <p>
                When you submit a message through our Contact page, we collect your name, email address, subject, message content, optional related tool context, and network IP address. This information is used exclusively to:
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
                <Cookie className="w-5 h-5 text-amber-500 shrink-0" />
                <span>3. Cookies, Analytics & Advertising</span>
              </h2>
              <p>
                TechWebCode uses standard browser local storage and cookies to remember interface preferences (such as your chosen light or dark theme). We may also use privacy-respecting aggregate analytics to monitor site availability and performance.
              </p>
              <p>
                Third-party vendors, including Google, use cookies to serve ads based on prior visits to this or other websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to TechWebCode and other sites on the Internet. Users may opt out of personalized advertising by visiting Google Ads Settings or www.aboutads.info.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-500 shrink-0" />
                <span>4. Data Retention & Security</span>
              </h2>
              <p>
                Contact messages are stored securely. Access to message records is restricted to authorized site administrators. We implement industry-standard input sanitization, rate limiting, and encrypted HTTPS transport to safeguard your data.
              </p>
            </div>

            <div className="pt-4 border-t text-xs text-muted-foreground">
              Last Updated: March 2026. For questions regarding this policy, contact{" "}
              <a href="mailto:support@techwebcode.in" className="text-blue-600 dark:text-blue-400 underline">
                support@techwebcode.in
              </a>.
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
