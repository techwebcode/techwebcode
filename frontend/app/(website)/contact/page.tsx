import React, { Suspense } from "react";
import { Metadata } from "next";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/common/SectionHeading";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Wrench, HelpCircle } from "lucide-react";
import { ContactFormCard } from "./ContactFormContent";

export const metadata: Metadata = {
  title: "Contact TechWebCode — Developer Tools & Technical Support",
  description:
    "Contact TechWebCode for technical support, bug reports, feature requests, developer tool feedback, and business inquiries. Get in touch with our engineering team.",
  openGraph: {
    title: "Contact TechWebCode — Developer Tools & Technical Support",
    description:
      "Contact TechWebCode for technical questions, bug reports, feature requests, developer tool feedback, and business inquiries.",
    url: "https://techwebcode.in/contact",
    type: "website",
  },
  alternates: {
    canonical: "https://techwebcode.in/contact",
  },
};

export default function ContactPage() {
  const breadcrumbItems = [{ label: "Contact Us" }];

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact TechWebCode",
    description:
      "Contact TechWebCode for technical support, bug reports, feature requests, developer tool feedback, and business inquiries.",
    url: "https://techwebcode.in/contact",
    mainEntity: {
      "@type": "Organization",
      name: "TechWebCode",
      url: "https://techwebcode.in",
      email: "support@techwebcode.in",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Support",
        email: "support@techwebcode.in",
        availableLanguage: ["English"],
      },
    },
  };

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
        name: "Contact Us",
        item: "https://techwebcode.in/contact",
      },
    ],
  };

  const faqs = [
    {
      q: "Are the tools on TechWebCode free to use?",
      a: "Yes! All developer tools on TechWebCode are completely free to use without requiring any sign-up or API keys.",
    },
    {
      q: "Is my data safe when using online tools like JSON Formatter or JWT Decoder?",
      a: "Absolutely. Your tool input is processed locally in your browser and is not sent to TechWebCode servers. No data is logged on our backend.",
    },
    {
      q: "How fast do you respond to support requests?",
      a: "Our engineering team reviews inquiries daily and typically responds within 24 to 48 hours.",
    },
  ];

  return (
    <div className="space-y-12 py-8 lg:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
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
              💬 Technical Support & Inquiries
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl text-foreground">
              Contact TechWebCode
            </h1>
            <p className="mx-auto max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
              Have technical questions, bug reports, feature requests, or tool feedback? Submit a message below or email our team directly.
            </p>
          </div>
        </Container>
      </section>

      <Container className="space-y-16">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Left Info Column */}
          <div className="space-y-6 lg:col-span-1">
            <h2 className="text-2xl font-bold text-foreground">Reach Out Directly</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Whether you are reporting a bug, suggesting a new developer tool, or asking an engineering question, our team is ready to assist.
            </p>

            <div className="space-y-4 pt-2">
              <Card className="rounded-2xl border p-4">
                <CardContent className="flex items-center gap-4 p-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Email Support</h3>
                    <a
                      href="mailto:support@techwebcode.in"
                      className="text-xs text-blue-600 dark:text-blue-400 font-mono hover:underline"
                    >
                      support@techwebcode.in
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border p-4">
                <CardContent className="flex items-center gap-4 p-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Developer Tools Platform</h3>
                    <p className="text-xs text-muted-foreground">Client-side & Privacy-First Utilities</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border p-4">
                <CardContent className="flex items-center gap-4 p-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Location</h3>
                    <p className="text-xs text-muted-foreground">Global Operations • Bangalore, India</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-2">
            <Suspense
              fallback={
                <Card className="rounded-3xl border p-8 shadow-sm h-[520px] animate-pulse bg-muted/20" />
              }
            >
              <ContactFormCard />
            </Suspense>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-8 border-t pt-14">
          <SectionHeading
            title="Frequently Asked Questions"
            description="Quick answers to common questions about TechWebCode support and tool reliability."
          />

          <div className="grid gap-6 md:grid-cols-3">
            {faqs.map((faq) => (
              <Card key={faq.q} className="rounded-2xl border p-6">
                <CardContent className="p-0 space-y-3">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <HelpCircle className="h-5 w-5 shrink-0" />
                    <h3 className="text-base font-semibold text-foreground">{faq.q}</h3>
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
