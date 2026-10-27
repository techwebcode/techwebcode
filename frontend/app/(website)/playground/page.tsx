import { Metadata } from "next";
import PlaygroundPageContainer from "@/components/playground/PlaygroundPageContainer";
import { LANGUAGES } from "@/components/playground/languages.config";

export const metadata: Metadata = {
  title: "Multi-Language Online Code Playground & Compiler",
  description:
    "Free online code playground and WebAssembly compiler for HTML5, CSS3, JavaScript, TypeScript, Python 3, Java, C, C++, Go, PHP, Rust, and SQL with Monaco editor.",
  alternates: {
    canonical: "https://techwebcode.in/playground",
  },
  openGraph: {
    title: "Multi-Language Online Code Playground & Compiler | TechWebCode",
    description:
      "Free online code playground and WebAssembly compiler for HTML5, CSS3, JavaScript, TypeScript, Python 3, Java, C, C++, Go, PHP, Rust, and SQL with Monaco editor.",
    url: "https://techwebcode.in/playground",
    siteName: "TechWebCode",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Multi-Language Online Code Playground & Compiler | TechWebCode",
    description:
      "Free online code playground and WebAssembly compiler for HTML5, CSS3, JavaScript, TypeScript, Python 3, Java, C, C++, Go, PHP, Rust, and SQL.",
  },
  keywords: [
    "online code playground",
    "online compiler",
    "multi language code playground",
    "HTML CSS JS playground",
    "Python online compiler",
    "Go playground",
    "Java online compiler",
    "WebAssembly compiler",
  ],
};

export default function PlaygroundLandingPage() {
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
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "TechWebCode Multi-Language Code Compilers & Playgrounds",
    description:
      "Free in-browser compilers and playgrounds with WebAssembly and client-side execution.",
    numberOfItems: Object.keys(LANGUAGES).length,
    itemListElement: Object.values(LANGUAGES).map((lang, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${lang.name} Online Compiler & Playground`,
      url: `https://techwebcode.in/playground/${lang.slug}`,
      description: lang.seo.description,
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
      <PlaygroundPageContainer languageConfig={LANGUAGES.html} />
    </>
  );
}
