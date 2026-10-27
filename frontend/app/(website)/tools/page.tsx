import React from "react";
import { Metadata } from "next";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/common/SectionHeading";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import ToolsDirectoryClient from "@/components/tool/ToolsDirectoryClient";
import AdBanner from "@/components/common/AdBanner";
import { INITIAL_TOOLS, INITIAL_TOOL_CATEGORIES } from "@/constants/toolSeoData";

export const metadata: Metadata = {
  title: "Free Online Developer Tools for JSON, JWT & SQL",
  description:
    "Explore free, privacy-first developer tools. Format JSON, decode JWT tokens, test Regex, convert timestamps, generate UUIDs, and format SQL in your browser.",
  alternates: {
    canonical: "https://techwebcode.in/tools",
  },
  openGraph: {
    title: "Free Online Developer Tools for JSON, JWT & SQL | TechWebCode",
    description:
      "Explore free, privacy-first developer tools. Format JSON, decode JWT tokens, test Regex, convert timestamps, generate UUIDs, and format SQL in your browser.",
    url: "https://techwebcode.in/tools",
    siteName: "TechWebCode",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Developer Tools for JSON, JWT & SQL | TechWebCode",
    description:
      "Explore free, privacy-first developer tools. Format JSON, decode JWT tokens, test Regex, convert timestamps, generate UUIDs, and format SQL in your browser.",
  },
};

export default function ToolsPage() {
  const breadcrumbItems = [{ label: "Developer Tools" }];

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
        name: "Developer Tools",
        item: "https://techwebcode.in/tools",
      },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "TechWebCode Free Developer Tools Suite",
    description:
      "Collection of free, client-side browser developer tools for formatting, validation, encoding, and debugging.",
    numberOfItems: INITIAL_TOOLS.length,
    itemListElement: INITIAL_TOOLS.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `https://techwebcode.in/tools/${tool.slug}`,
      description: tool.description,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <Container className="pt-4 pb-2">
        <Breadcrumbs items={breadcrumbItems} />
      </Container>

      <ToolsDirectoryClient
        initialTools={INITIAL_TOOLS}
        initialCategories={INITIAL_TOOL_CATEGORIES}
      />

      <Container className="pb-12">
        <AdBanner slot="8877665544" />
      </Container>
    </>
  );
}