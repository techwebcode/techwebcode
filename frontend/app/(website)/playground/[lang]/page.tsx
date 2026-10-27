import { Metadata } from "next";
import { notFound } from "next/navigation";
import PlaygroundPageContainer from "@/components/playground/PlaygroundPageContainer";
import { LANGUAGES, getLanguageConfig } from "@/components/playground/languages.config";

interface Props {
  params: Promise<{
    lang: string;
  }>;
}

export async function generateStaticParams() {
  return Object.keys(LANGUAGES).map((slug) => ({
    lang: slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = (resolvedParams.lang || "").toLowerCase().trim();

  if (!LANGUAGES[slug]) {
    return {
      title: "Playground | TechWebCode",
    };
  }

  const config = LANGUAGES[slug];
  const cleanTitle = config.seo.title.replace(/\s*\|\s*TechWebCode$/i, "").trim();
  const fullTitle = `${cleanTitle} | TechWebCode`;
  const canonicalUrl = `https://techwebcode.in/playground/${slug}`;

  return {
    title: cleanTitle,
    description: config.seo.description,
    keywords: config.seo.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description: config.seo.description,
      url: canonicalUrl,
      type: "website",
      siteName: "TechWebCode",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: config.seo.description,
    },
  };
}

export default async function LanguagePlaygroundPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = (resolvedParams.lang || "").toLowerCase().trim();

  if (!LANGUAGES[slug]) {
    notFound();
  }

  const config = getLanguageConfig(slug);
  const canonicalUrl = `https://techwebcode.in/playground/${slug}`;

  // SoftwareApplication JSON-LD Schema
  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${config.name} Online Compiler & Playground`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: config.seo.description,
    url: canonicalUrl,
  };

  // BreadcrumbList JSON-LD Schema
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
        name: "Playground",
        item: "https://techwebcode.in/playground",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${config.name}`,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PlaygroundPageContainer languageConfig={config} />
    </>
  );
}
