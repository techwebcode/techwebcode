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
    description: "Format and beautify JSON online with this free JSON formatter. Paste your JSON, format it instantly, and make nested objects and arrays easier to read and debug.",
    shortDescription: "Format and beautify JSON online. Make JSON structured, readable, and easy to debug.",
    featured: true,
    seoTitle: "JSON Formatter & Beautifier Online | TechWebCode",
    seoDescription: "Format and beautify JSON online with TechWebCode's free JSON formatter. Make JSON readable, structured, and easy to debug.",
  },
  "json-validator": {
    id: 2,
    name: "JSON Validator",
    slug: "json-validator",
    description: "Validate JSON syntax online with line-by-line syntax checking. Spot syntax errors, unquoted keys, and missing brackets instantly.",
    shortDescription: "Validate JSON syntax and identify syntax errors with precise line-by-line error messages.",
    featured: true,
    seoTitle: "JSON Validator Online - Free JSON Checker | TechWebCode",
    seoDescription: "Validate JSON syntax online with line-by-line error checking. Spot syntax errors, missing quotes, and invalid JSON objects instantly.",
  },
  "json-minifier": {
    id: 3,
    name: "JSON Minifier",
    slug: "json-minifier",
    description: "Compress and minify JSON data by stripping whitespace and indentation while preserving valid JSON payload structure.",
    shortDescription: "Minify and compact JSON data to reduce payload size.",
    featured: true,
    seoTitle: "JSON Minifier Online - Compress JSON | TechWebCode",
    seoDescription: "Compress and minify JSON data by stripping whitespace and formatting. Optimize JSON payloads for web APIs and storage.",
  },
  "jwt-decoder": {
    id: 4,
    name: "JWT Decoder",
    slug: "jwt-decoder",
    description: "Decode JSON Web Tokens (JWT) online. View header algorithm, payload claims, and expiration timestamps securely in your browser.",
    shortDescription: "Decode and inspect JWT token headers and payload claims securely.",
    featured: true,
    seoTitle: "JWT Decoder Online - Decode JWT Tokens | TechWebCode",
    seoDescription: "Decode JSON Web Tokens (JWT) online. View header, payload claims, and expiration date instantly. 100% private client-side decoding.",
  },
  "base64": {
    id: 5,
    name: "Base64 Encoder & Decoder",
    slug: "base64",
    description: "Encode text data into Base64 format or decode Base64 strings back into human-readable plain text instantly.",
    shortDescription: "Encode text into Base64 format or decode Base64 strings into text.",
    featured: true,
    seoTitle: "Base64 Encoder & Decoder Online | TechWebCode",
    seoDescription: "Encode text to Base64 format or decode Base64 strings back to plain text online. Fast, secure, and privacy-first.",
  },
  "uuid-generator": {
    id: 6,
    name: "UUID Generator",
    slug: "uuid-generator",
    description: "Generate cryptographically secure Version 4 UUIDs (Universally Unique Identifiers) individually or in bulk for database keys and APIs.",
    shortDescription: "Generate random Version 4 UUIDs individually or in bulk.",
    featured: true,
    seoTitle: "UUID Generator Online - Generate UUID v4 | TechWebCode",
    seoDescription: "Generate random v4 UUID identifiers individually or in bulk online. Free, fast, and cryptographically secure.",
  },
  "timestamp-converter": {
    id: 7,
    name: "Unix Timestamp Converter",
    slug: "timestamp-converter",
    description: "Convert Unix Epoch timestamps to human-readable date strings, UTC time, and ISO 8601 formats, or convert dates into Unix timestamps.",
    shortDescription: "Convert Unix timestamps to human-readable date formats and UTC time.",
    featured: true,
    seoTitle: "Unix Timestamp Converter Online | TechWebCode",
    seoDescription: "Convert Epoch Unix timestamps to human-readable dates, UTC, and ISO 8601 strings online. Supports seconds and milliseconds.",
  },
  "url-encoder": {
    id: 8,
    name: "URL Encoder & Decoder",
    slug: "url-encoder",
    description: "Encode query parameters into percent-encoded URL format, or decode percent-encoded strings back to standard text.",
    shortDescription: "Encode and decode percent-encoded URL query strings.",
    featured: true,
    seoTitle: "URL Encoder & Decoder Online | TechWebCode",
    seoDescription: "Encode query parameters into percent-encoded URL format, or decode percent-encoded strings online.",
  },
  "regex-tester": {
    id: 9,
    name: "Regex Tester",
    slug: "regex-tester",
    description: "Test regular expression patterns against test strings with real-time match highlighting, global flags, and capture group details.",
    shortDescription: "Test and debug regular expression patterns with match highlighting.",
    featured: true,
    seoTitle: "Regex Tester Online - Test Regular Expressions | TechWebCode",
    seoDescription: "Test and debug regular expression patterns online with real-time match highlighting, flag controls, and group extraction.",
  },
  "sql-formatter": {
    id: 10,
    name: "SQL Formatter",
    slug: "sql-formatter",
    description: "Format and beautify raw SQL queries with proper clause indentations and capitalized SQL keywords for maximum query readability.",
    shortDescription: "Format and beautify SQL queries with proper indentation and keyword capitalization.",
    featured: true,
    seoTitle: "SQL Formatter Online | TechWebCode",
    seoDescription: "Format and beautify SQL queries online. Standardize keyword capitalization and indent complex clauses for maximum readability.",
  },
  "yaml-formatter": {
    id: 11,
    name: "YAML Formatter",
    slug: "yaml-formatter",
    description: "Format, validate, and beautify YAML configurations online. Check syntax, indentation, and structure instantly.",
    shortDescription: "Format, validate, and beautify YAML configurations online.",
    featured: true,
    seoTitle: "YAML Formatter Online | TechWebCode",
    seoDescription: "Format, validate, and beautify YAML configurations online. Check syntax, indentation, and structure instantly.",
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

  const title = tool?.seoTitle || (tool ? tool.name : "Developer Tool");
  const description = tool?.seoDescription || tool?.shortDescription || tool?.description || "Free online developer tool.";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | TechWebCode`,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: "TechWebCode",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | TechWebCode`,
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