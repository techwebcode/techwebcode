import HeroSection from "@/components/home/HeroSection";
import FeaturedArticles from "@/components/home/FeaturedArticles";
import LatestArticles from "@/components/home/LatestArticles";
import TrendingArticles from "@/components/home/TrendingArticles";
import CategorySection from "@/components/home/CategorySection";

export default function HomePage() {

    return (

       <>
        <HeroSection />

        <FeaturedArticles />

        <LatestArticles />

        <TrendingArticles />

        <CategorySection />
    </>

    );

}