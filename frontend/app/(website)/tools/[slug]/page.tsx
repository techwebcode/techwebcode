import { notFound, permanentRedirect } from "next/navigation";
import { Metadata } from "next";

import ToolRenderer from "@/components/tool/ToolRenderer";
import ToolPageLayout from "@/components/tool/ToolPageLayout";
import ToolService from "@/services/tool.service";
import { Tool } from "@/types/tools";
import {
  getToolSeoData,
  getCanonicalToolSlug,
  CANONICAL_TOOL_SLUGS,
} from "@/constants/toolSeoData";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return CANONICAL_TOOL_SLUGS.map((slug) => ({
    slug,
  }));
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
    seoTitle: "JSON Minifier Online - Compress JSON Payloads | TechWebCode",
    seoDescription: "Compress and minify JSON data by stripping whitespace and formatting. Optimize JSON payloads for web APIs and storage.",
  },
  "jwt-decoder": {
    id: 4,
    name: "JWT Decoder",
    slug: "jwt-decoder",
    description: "Decode JSON Web Tokens (JWT) online. View header algorithm, payload claims, and expiration timestamps securely in your browser.",
    shortDescription: "Decode and inspect JWT token headers and payload claims securely.",
    featured: true,
    seoTitle: "JWT Decoder Online - Inspect JWT Claims | TechWebCode",
    seoDescription: "Decode JSON Web Tokens (JWT) online. View header, payload claims, and expiration date instantly with client-side token parsing.",
  },
  "base64": {
    id: 5,
    name: "Base64 Encoder & Decoder",
    slug: "base64",
    description: "Encode text data into Base64 format or decode Base64 strings back into human-readable plain text instantly.",
    shortDescription: "Encode text into Base64 format or decode Base64 strings into text.",
    featured: true,
    seoTitle: "Base64 Encoder & Decoder Online | TechWebCode",
    seoDescription: "Encode text to Base64 or decode Base64 strings online with this free Base64 tool. Fast, simple, and easy to use.",
  },
  "uuid-generator": {
    id: 6,
    name: "UUID / GUID Generator",
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
  "url-encoder-decoder": {
    id: 8,
    name: "URL Encoder & Decoder",
    slug: "url-encoder-decoder",
    description: "Encode URLs or decode URL-encoded text online. Use this free URL encoding and decoding tool for quick, reliable results.",
    shortDescription: "Encode URLs or decode URL-encoded text online with Component and Full URL mode support.",
    featured: true,
    seoTitle: "URL Encoder & Decoder Online | TechWebCode",
    seoDescription: "Encode URLs or decode URL-encoded text online. Use this free URL encoding and decoding tool for quick, reliable results.",
  },
  "regex-tester": {
    id: 9,
    name: "Regex Tester & Explainer",
    slug: "regex-tester",
    description: "Test regular expressions, highlight matches, inspect capture groups, and understand regex patterns with detailed explanations. Supports multiple regex flavors.",
    shortDescription: "Test, debug, and understand regular expressions with token breakdown and diagnostics.",
    featured: true,
    seoTitle: "Regex Tester & Explainer Online | TechWebCode",
    seoDescription: "Test regular expressions, highlight matches, inspect capture groups, and understand regex patterns with detailed explanations. Supports multiple regex flavors.",
  },
  "sql-formatter": {
    id: 10,
    name: "SQL Formatter & Validator",
    slug: "sql-formatter",
    description: "Format, validate, and minify SQL queries online with standardized keyword capitalization and dialect-aware AST syntax validation.",
    shortDescription: "Format, validate, and minify SQL queries online.",
    featured: true,
    seoTitle: "SQL Formatter & Validator Online — Format, Validate & Minify | TechWebCode",
    seoDescription: "Format, validate, and minify SQL queries online. Standardize keyword capitalization and verify syntax grammar across MySQL, PostgreSQL, SQLite, and SQL Server.",
  },
  "yaml-formatter": {
    id: 11,
    name: "YAML Formatter & Kubernetes Secret Tool",
    slug: "yaml-formatter",
    description: "Format and validate YAML files, and encode or decode Kubernetes Secret values online with in-browser parsing.",
    shortDescription: "Format and validate YAML files, and encode or decode Kubernetes Secret values online.",
    featured: true,
    seoTitle: "YAML Formatter & Kubernetes Secret Tool | TechWebCode",
    seoDescription: "Format and validate YAML files, and encode or decode Kubernetes Secret values online with in-browser parsing and manifest preservation.",
  },
  "deployment-config-doctor": {
    id: 16,
    name: "Deployment Config Doctor",
    slug: "deployment-config-doctor",
    description: "Analyze Docker, Kubernetes, environment, Nginx, Next.js and CI/CD configuration for deployment errors, security issues and cross-file mismatches.",
    shortDescription: "Cross-file project configuration analyzer for Docker, Kubernetes, Nginx, and .env files.",
    featured: true,
    seoTitle: "Deployment Config Doctor — Docker & K8s Checker | TechWebCode",
    seoDescription: "Analyze Docker, Kubernetes, environment, Nginx, Next.js and CI/CD configuration for deployment errors, security issues and cross-file mismatches.",
  },
  "api-contract-checker": {
    id: 17,
    name: "API Contract & Response Compatibility Checker",
    slug: "api-contract-checker",
    description: "Compare API response JSON payloads against expected schemas, detect breaking changes, missing properties, and field type mismatches instantly.",
    shortDescription: "Detect API breaking changes, missing properties, and schema compatibility issues.",
    featured: true,
    seoTitle: "API Contract & Response Compatibility Checker | TechWebCode",
    seoDescription: "Compare API response JSON payloads against expected schemas, detect breaking changes, missing properties, and field type mismatches instantly.",
  },
  "code-diff-checker": {
    id: 18,
    name: "Code Difference Checker",
    slug: "code-diff-checker",
    description: "Compare two versions of code side-by-side or unified online. Instantly highlight added, removed, and modified lines with fast in-browser diffing.",
    shortDescription: "Compare two versions of code side-by-side or unified to instantly spot additions, deletions, and modifications.",
    featured: true,
    seoTitle: "Code Difference Checker — Side-by-Side Diff Online | TechWebCode",
    seoDescription: "Compare two versions of code online with TechWebCode's Code Difference Checker. Side-by-side view, git-style unified diff, word-level diff, and change navigation.",
  },
  "sha1-hash-generator": {
    id: 19,
    name: "SHA-1 Hash Generator",
    slug: "sha1-hash-generator",
    description: "Generate SHA-1 hashes from text instantly in your browser. Fast, free, and client-side with no data sent to TechWebCode servers.",
    shortDescription: "Generate SHA-1 hash digests from text instantly with client-side browser execution.",
    featured: true,
    seoTitle: "SHA-1 Hash Generator Online | TechWebCode",
    seoDescription: "Generate SHA-1 hashes from text instantly in your browser. Fast, free, and client-side with no data sent to TechWebCode servers.",
  },
  "comma-separator": {
    id: 20,
    name: "Comma Separator",
    slug: "comma-separator",
    description: "Quickly convert lists into comma-separated values, format delimited text, remove duplicates, and reverse comma-separated strings back to newlines with fast in-browser execution.",
    shortDescription: "Convert lists into comma-separated values or split delimited text into lines instantly.",
    featured: true,
    seoTitle: "Comma Separator & List Formatter Online | TechWebCode",
    seoDescription: "Convert newline lists into comma-separated values or split delimited text into lines online. Fast, customizable with quotes, deduplication, and in-browser processing.",
  },
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const canonicalSlug = getCanonicalToolSlug(slug);
  const canonicalUrl = `https://techwebcode.in/tools/${canonicalSlug}`;
  const seoData = getToolSeoData(canonicalSlug);

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
    tool = DEFAULT_TOOLS[canonicalSlug] || DEFAULT_TOOLS[slug];
  }

  const rawTitle = seoData?.seoTitle || tool?.seoTitle || (tool ? `${tool.name}` : "Developer Tool");
  const cleanTitle = rawTitle.replace(/\s*\|\s*TechWebCode$/i, "").trim();
  const description = seoData?.seoDescription || tool?.seoDescription || tool?.shortDescription || tool?.description || "Free online developer tool.";
  const fullTitle = `${cleanTitle} | TechWebCode`;

  return {
    title: cleanTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: "TechWebCode",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export default async function ToolPage({
  params,
}: Props) {
  const { slug } = await params;
  const canonicalSlug = getCanonicalToolSlug(slug);

  if (slug !== canonicalSlug) {
    permanentRedirect(`/tools/${canonicalSlug}`);
  }

  const seoData = getToolSeoData(canonicalSlug);

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
    tool = DEFAULT_TOOLS[canonicalSlug] || DEFAULT_TOOLS[slug];
  }

  if (!tool) {
    notFound();
  }

  // Unified JSON-LD Structured Data Graph
  const graphEntities: Record<string, unknown>[] = [
    {
      "@type": "SoftwareApplication",
      name: seoData?.name || tool.name,
      operatingSystem: "All",
      applicationCategory: "DeveloperApplication",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description: seoData?.shortDescription || tool.description || tool.shortDescription,
      url: `https://techwebcode.in/tools/${canonicalSlug}`,
    },
    {
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
          name: "Developer Tools",
          item: "https://techwebcode.in/tools",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: seoData?.name || tool.name,
          item: `https://techwebcode.in/tools/${canonicalSlug}`,
        },
      ],
    },
  ];

  if (seoData?.faqs && seoData.faqs.length > 0) {
    graphEntities.push({
      "@type": "FAQPage",
      mainEntity: seoData.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": graphEntities,
  };

  const breadcrumbItems = [
    { label: "Tools", href: "/tools" },
    { label: seoData?.name || tool.name },
  ];

  return (
    <>
      {/* Consolidated Structured Data Graph */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Tool-First Reusable Page Layout */}
      <ToolPageLayout
        breadcrumbs={breadcrumbItems}
        title={seoData?.h1 || tool.name}
        badge={seoData?.category || (tool as any).category?.name}
        description={seoData?.shortDescription || tool.shortDescription || tool.description}
        seoData={seoData}
        privacyNotice={{
          isClientSide: true,
          title: "100% Client-Side:",
          description: "Your tool input is processed locally in your browser and is not sent to TechWebCode servers.",
        }}
      >
        <ToolRenderer
          tool={{
            ...tool,
            name: seoData?.h1 || tool.name,
          }}
        />
      </ToolPageLayout>
    </>
  );
}
