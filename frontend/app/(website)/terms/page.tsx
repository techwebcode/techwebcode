import { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { FileText, ShieldAlert, CheckCircle, Scale } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Terms of Service | TechWebCode",
  description:
    "Read the TechWebCode Terms of Service governing the use of our developer tools, coding tutorials, and online resources.",
  alternates: {
    canonical: "https://techwebcode.in/terms",
  },
  openGraph: {
    title: "Terms of Service | TechWebCode",
    description:
      "Read the TechWebCode Terms of Service governing the use of our developer tools, coding tutorials, and online resources.",
    url: "https://techwebcode.in/terms",
    siteName: "TechWebCode",
    type: "website",
  },
};

export default function TermsPage() {
  const breadcrumbItems = [{ label: "Terms of Service" }];

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
        name: "Terms of Service",
        item: "https://techwebcode.in/terms",
      },
    ],
  };

  return (
    <div className="space-y-16 py-8 lg:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Header */}
      <section className="border-b bg-gradient-to-b from-background to-muted/40 pb-12 pt-4">
        <Container className="space-y-6">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="text-center space-y-4 pt-2">
            <span className="inline-flex rounded-full border bg-background px-4 py-1 text-sm font-medium text-primary">
              📜 Legal Agreement
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl text-foreground">
              Terms of Service
            </h1>
            <p className="mx-auto max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
              Please review these terms governing your access to and use of the TechWebCode website, developer tools, and tutorials.
            </p>
          </div>
        </Container>
      </section>

      <Container className="max-w-4xl space-y-10">
        <Card className="rounded-3xl border p-8 space-y-6 shadow-sm">
          <CardContent className="p-0 space-y-8 text-sm leading-relaxed text-muted-foreground">
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />
                <span>1. Acceptance of Terms</span>
              </h2>
              <p>
                By accessing or using TechWebCode (techwebcode.in), including our online developer tools, articles, tutorials, and contact services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please discontinue using the website.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>2. Use of Developer Tools & Client-Side Execution</span>
              </h2>
              <p>
                TechWebCode provides free, client-side browser utilities (such as JSON Formatters, JWT Decoders, Regex Testers, and YAML tools) for software engineering and educational use. You may use these tools for personal, academic, or commercial development workflows.
              </p>
              <p>
                Because tools process data locally in your browser, TechWebCode does not store or monitor your inputs. You remain solely responsible for validating critical production outputs (e.g., cryptographic keys, database migration queries, or Kubernetes manifests) before deploying them to production environments.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
                <span>3. Prohibited Conduct</span>
              </h2>
              <p>
                When using TechWebCode, you agree not to:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 font-medium text-foreground">
                <li>Attempt to disrupt, overwhelm, or launch Denial-of-Service attacks against site infrastructure.</li>
                <li>Submit abusive, malicious, or automated spam payloads through contact forms.</li>
                <li>Misrepresent TechWebCode or scrape site tutorials for unauthorized republication.</li>
              </ul>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-500 shrink-0" />
                <span>4. Disclaimer of Warranties & Limitation of Liability</span>
              </h2>
              <p>
                TechWebCode and its developer tools are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, either express or implied. While we strive for absolute precision in code formatting, parsing, and syntax diagnostics, TechWebCode disclaims liability for any direct, indirect, incidental, or consequential damages resulting from tool usage or code implementation.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <h2 className="text-xl font-bold text-foreground">5. Modifications to Terms</h2>
              <p>
                We reserve the right to update these terms as our platform evolves. Continued use of TechWebCode following any modifications constitutes acceptance of the updated terms.
              </p>
            </div>

            <div className="pt-4 border-t text-xs text-muted-foreground">
              Last Updated: March 2026. For inquiries regarding these terms, please contact{" "}
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
