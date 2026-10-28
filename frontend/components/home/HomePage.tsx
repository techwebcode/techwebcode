import HeroSection from "@/components/home/HeroSection";
import PlaygroundPromotionalSection from "@/components/home/PlaygroundPromotionalSection";
import DeveloperToolsSection from "@/components/home/DeveloperToolsSection";
import BrowseCategoriesSection from "@/components/home/BrowseCategoriesSection";
import DeveloperPlatformSpecs from "@/components/home/DeveloperPlatformSpecs";
import HelpFeedbackSection from "@/components/home/HelpFeedbackSection";

export default function HomePage() {
  // Schema.org Structured Data: WebSite with Sitelinks Searchbox & Organization
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://techwebcode.in/#website",
        url: "https://techwebcode.in",
        name: "TechWebCode",
        description:
          "Fast, free online developer tools and code compilers. Format JSON, decode JWT, test Regex, convert timestamps, and run code in 10+ languages with browser-based execution.",
        publisher: {
          "@id": "https://techwebcode.in/#organization",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://techwebcode.in/search?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://techwebcode.in/#organization",
        name: "TechWebCode",
        url: "https://techwebcode.in",
        logo: "https://techwebcode.in/icon.png",
        description:
          "Fast, free online developer tools and multi-language online code compilers.",
        email: "contact@techwebcode.in",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="flex flex-col min-h-screen">
        {/* 1. Hero Section (Compact, Tools-Focused Headline, ⌘K Search, Quick Access, Explore Tools CTA) */}
        <HeroSection />

        {/* 2. Featured Multi-Language Code Playground Showcase */}
        <PlaygroundPromotionalSection />

        {/* 3. Popular Developer Tools with Inline Category Filter Tabs */}
        <DeveloperToolsSection />

        {/* 3. Browse Developer Tools by Category with Included Utility Chips */}
        <BrowseCategoriesSection />

        {/* 4. Privacy & Platform Architecture Guarantee */}
        <DeveloperPlatformSpecs />

        {/* 5. Developer Guides & Articles (Temporarily hidden until articles content is complete) */}
        {/* <FeaturedArticles /> */}

        {/* 6. Help & Feedback / Report a Bug Section */}
        <HelpFeedbackSection />
      </div>
    </>
  );
}