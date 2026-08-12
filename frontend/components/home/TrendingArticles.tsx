"use client";

import Container from "@/components/layout/Container";
import SectionHeading from "@/components/common/SectionHeading";
import ArticleGrid from "@/components/article/ArticleGrid";
import { useTrendingArticles } from "@/hooks/useTrendingArticles";
import { Article } from "@/types/article";

export default function TrendingArticles() {
    const { data, isLoading } = useTrendingArticles(6);

    if (isLoading) {
        return null;
    }

    const articles: Article[] = Array.isArray(data) ? data : (data as unknown as { data: Article[] })?.data ?? [];

    if (!articles.length) {
        return null;
    }

    return (
        <section className="py-20">
            <Container>
                <SectionHeading
                    title="Trending Articles"
                    description="Most read articles this week."
                    href="/articles"
                />

                <ArticleGrid
                    articles={articles}
                />
            </Container>
        </section>
    );
}