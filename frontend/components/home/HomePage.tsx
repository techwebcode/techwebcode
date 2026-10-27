import HeroSection from "@/components/home/HeroSection";
import PlaygroundPromotionalSection from "@/components/home/PlaygroundPromotionalSection";
import DeveloperToolsSection from "@/components/home/DeveloperToolsSection";
import BrowseCategoriesSection from "@/components/home/BrowseCategoriesSection";
import DeveloperPlatformSpecs from "@/components/home/DeveloperPlatformSpecs";
import FeaturedArticles from "@/components/home/FeaturedArticles";
import HelpFeedbackSection from "@/components/home/HelpFeedbackSection";

export default function HomePage() {
  // WebSite JSON-LD Schema with SearchAction for Developer Tools Search
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TechWebCode",
    url: "https://techwebcode.in",
    description: "Free online developer tools and WebAssembly code compilers. Fast, practical, privacy-first tools for formatting, validating, encoding, debugging, and running modern code.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://techwebcode.in/tools?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  // Organization JSON-LD Schema for TechWebCode Identity
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TechWebCode",
    url: "https://techwebcode.in",
    logo: "https://techwebcode.in/icon.png",
    description: "Free developer tools and multi-language online WebAssembly code compilers.",
    email: "contact@techwebcode.in",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
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