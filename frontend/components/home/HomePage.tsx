import HeroSection from "@/components/home/HeroSection";
import DeveloperToolsSection from "@/components/home/DeveloperToolsSection";
import BrowseCategoriesSection from "@/components/home/BrowseCategoriesSection";
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
        {/* 1. Hero Section (Compact, Tools-Focused Headline, ⌘K Search, Explore Tools CTA) */}
        <HeroSection />

        {/* 2. Popular Developer Tools (PRIMARY SECTION 1) */}
        <DeveloperToolsSection />

        {/* 3. Browse Developer Tools by Category (PRIMARY SECTION 2) */}
        <BrowseCategoriesSection />

        {/* 4. Developer Guides & Articles (SECONDARY SECTION 3) */}
        <FeaturedArticles />
      </div>
    </>
  );
}