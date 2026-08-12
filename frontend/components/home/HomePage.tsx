import HeroSection from "@/components/home/HeroSection";
import PopularTopicsSection from "@/components/home/PopularTopicsSection";
import DeveloperToolsSection from "@/components/home/DeveloperToolsSection";
import FeaturedArticles from "@/components/home/FeaturedArticles";
import LatestArticles from "@/components/home/LatestArticles";
import CategorySection from "@/components/home/CategorySection";
import LearningResourcesSection from "@/components/home/LearningResourcesSection";

export default function HomePage() {
  return (
    <main className="space-y-4">
      {/* Hero Section */}
      <HeroSection />

      {/* Popular Topics Band */}
      <PopularTopicsSection />

      {/* Developer Tools Section */}
      <DeveloperToolsSection />

      {/* Featured Tutorials */}
      <FeaturedArticles />

      {/* Latest Tutorials */}
      <LatestArticles />

      {/* Explore by Technology */}
      <CategorySection />

      {/* Learning Resources */}
      <LearningResourcesSection />
    </main>
  );
}