import { notFound } from "next/navigation";
import { Metadata } from "next";

import Container from "@/components/layout/Container";
import ToolRenderer from "@/components/tool/ToolRenderer";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import AdBanner from "@/components/common/AdBanner";
import ToolService from "@/services/tool.service";
import { Tool } from "@/types/tools";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const DEFAULT_TOOLS: Record<string, Tool> = {
  "json-formatter": {
    id: 1,
    name: "JSON Formatter & Beautifier",
    slug: "json-formatter",
    description: "Free online JSON Formatter and Validator. Format, validate, beautify, and inspect JSON payloads instantly in your browser.",
    shortDescription: "Format, validate, beautify, and inspect JSON payloads online.",
    featured: true,
    seoTitle: "Free Online JSON Formatter & Beautifier | TechWebCode",
    seoDescription: "Format, validate, beautify, and inspect JSON data instantly online. Free, fast, and privacy-first browser tool.",
  },
  "json-validator": {
    id: 2,
    name: "JSON Validator",
    slug: "json-validator",
    description: "Free online JSON Syntax Validator. Validate JSON structure and identify line-by-line syntax errors.",
    shortDescription: "Validate JSON syntax and identify syntax errors with precise error messages.",
    featured: true,
    seoTitle: "Free Online JSON Validator | TechWebCode",
    seoDescription: "Validate JSON structure and syntax errors online. Free, fast, and privacy-first browser tool.",
  },
  "json-minifier": {
    id: 3,
    name: "JSON Minifier & Compact Tool",
    slug: "json-minifier",
    description: "Compress and minify JSON data by stripping whitespace and indentation.",
    shortDescription: "Minify and compact JSON payloads.",
    featured: true,
    seoTitle: "Free Online JSON Minifier | TechWebCode",
    seoDescription: "Compress and minify JSON data instantly online.",
  },
  "jwt-decoder": {
    id: 4,
    name: "JWT Decoder",
    slug: "jwt-decoder",
    description: "Decode and inspect JSON Web Token (JWT) Header, Payload claims, and expiration date.",
    shortDescription: "Decode and inspect JWT tokens securely.",
    featured: true,
    seoTitle: "Free Online JWT Decoder & Inspector | TechWebCode",
    seoDescription: "Decode JWT tokens, view payload claims, and verify token expiration.",
  },
  "base64": {
    id: 5,
    name: "Base64 Encoder & Decoder",
    slug: "base64",
    description: "Encode text data into Base64 format or decode Base64 strings back to plain text.",
    shortDescription: "Encode and decode Base64 strings securely.",
    featured: true,
    seoTitle: "Free Online Base64 Encoder & Decoder | TechWebCode",
    seoDescription: "Encode and decode Base64 strings online.",
  },
  "uuid-generator": {
    id: 6,
    name: "UUID / GUID Generator",
    slug: "uuid-generator",
    description: "Generate universally unique identifiers (v4 UUIDs) individually or in bulk.",
    shortDescription: "Generate random UUID v4 identifiers.",
    featured: true,
    seoTitle: "Free Online UUID v4 Generator | TechWebCode",
    seoDescription: "Generate random v4 UUIDs individually or in bulk online.",
  },
  "timestamp-converter": {
    id: 7,
    name: "Unix Timestamp Converter",
    slug: "timestamp-converter",
    description: "Convert Unix Epoch timestamps to human-readable dates, UTC, and ISO 8601 string formats.",
    shortDescription: "Convert Epoch timestamps to human dates.",
    featured: true,
    seoTitle: "Free Online Unix Timestamp Converter | TechWebCode",
    seoDescription: "Convert Epoch/Unix timestamps to human readable dates, UTC, and ISO 8601 strings.",
  },
  "url-encoder": {
    id: 8,
    name: "URL Encoder & Decoder",
    slug: "url-encoder",
    description: "Encode query parameters into percent-encoded URL format, or decode percent-encoded strings.",
    shortDescription: "Encode and decode URL query parameters.",
    featured: true,
    seoTitle: "Free Online URL Encoder & Decoder | TechWebCode",
    seoDescription: "Encode and decode percent-encoded URL strings online.",
  },
  "regex-tester": {
    id: 9,
    name: "Regex Pattern Tester",
    slug: "regex-tester",
    description: "Test regular expression patterns in real-time with match highlighting and group extraction.",
    shortDescription: "Test and debug regular expressions online.",
    featured: true,
    seoTitle: "Free Online Regex Pattern Tester | TechWebCode",
    seoDescription: "Test regular expressions with real-time match highlighting.",
  },
  "sql-formatter": {
    id: 10,
    name: "SQL Query Formatter",
    slug: "sql-formatter",
    description: "Beautify and format SQL queries with proper clause indentations and capitalized keywords.",
    shortDescription: "Format and beautify SQL queries.",
    featured: true,
    seoTitle: "Free Online SQL Query Formatter | TechWebCode",
    seoDescription: "Format and beautify SQL queries with clean indentations and capitalized keywords.",
  },
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const canonicalSlug = slug.includes("yaml") || slug.includes("k8s") ? "yaml-formatter" : slug.includes("json") ? "json-formatter" : slug;
  const canonicalUrl = `https://techwebcode.in/tools/${canonicalSlug}`;

  let tool: Tool | undefined;

  try {
    const apiTool = await ToolService.getTool(slug);
    if (apiTool && apiTool.name) {
      tool = apiTool;
    }
  } catch {
    // Fallback
  }

  if (!tool) {
    tool = DEFAULT_TOOLS[slug];
  }

  const title = tool?.seoTitle || (tool ? `${tool.name} | TechWebCode` : "Developer Tool | TechWebCode");
  const description = tool?.seoDescription || tool?.shortDescription || tool?.description || "Free online developer tool.";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: "TechWebCode",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ToolPage({
  params,
}: Props) {
  const { slug } = await params;
  let tool: Tool | undefined;

  try {
    const apiTool = await ToolService.getTool(slug);
    if (apiTool && apiTool.name) {
      tool = apiTool;
    }
  } catch {
    // Fallback
  }

  if (!tool) {
    tool = DEFAULT_TOOLS[slug];
  }

  if (!tool) {
    notFound();
  }

  // JSON-LD Structured Data for SoftwareApplication Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    operatingSystem: "All",
    applicationCategory: "DeveloperApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: tool.description || tool.shortDescription,
    url: `https://techwebcode.in/tools/${tool.slug}`,
  };

  const breadcrumbItems = [
    { label: "Tools", href: "/tools" },
    { label: tool.name },
  ];

  return (
    <Container className="py-12 space-y-6">
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Tool Interface & Content (Immediately Accessible, Zero Ads near controls) */}
      <ToolRenderer tool={tool} />

      {/* Non-Intrusive Bottom Ad Banner */}
      <AdBanner slot="8877665544" className="mt-12" />
    </Container>
  );
}