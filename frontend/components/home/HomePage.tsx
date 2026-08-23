import HeroSection from "@/components/home/HeroSection";
import DeveloperToolsSection from "@/components/home/DeveloperToolsSection";
import BrowseCategoriesSection from "@/components/home/BrowseCategoriesSection";
import DeveloperPlatformSpecs from "@/components/home/DeveloperPlatformSpecs";
import FeaturedArticles from "@/components/home/FeaturedArticles";

export default function HomePage() {
  // WebSite JSON-LD Schema with SearchAction for Developer Tools Search
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TechWebCode",
    url: "https://techwebcode.in",
    description: "Developer tools that just get the job done. Fast, practical, privacy-first tools for formatting, validating, encoding, debugging, and modern web engineering.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://techwebcode.in/tools?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex flex-col min-h-screen">
        {/* 1. Hero Section (Compact, Tools-Focused Headline, ⌘K Search, Quick Access, Explore Tools CTA) */}
        <HeroSection />

        {/* 2. Popular Developer Tools with Inline Category Filter Tabs */}
        <DeveloperToolsSection />

        {/* 3. Browse Developer Tools by Category with Included Utility Chips */}
        <BrowseCategoriesSection />

        {/* 4. Privacy & Platform Architecture Guarantee */}
        <DeveloperPlatformSpecs />

        {/* 5. Developer Guides & Articles */}
        <FeaturedArticles />
      </div>
    </>
  );
}