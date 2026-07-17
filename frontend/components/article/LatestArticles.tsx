"use client";

import SectionHeading from "@/components/common/SectionHeading";
import Container from "@/components/layout/Container";
import ArticleCard from "@/components/article/ArticleCard";

import { useLatestArticles } from "@/hooks/useLatestArticles";

export default function LatestArticles() {

    const {
        data,
        isLoading,
        error,
    } = useLatestArticles(1, 9);

    if (isLoading) {
        return null; // Later replace with <ArticleGridSkeleton />
    }

    if (error) {
        return null;
    }

    const articles = data?.data ?? [];

    if (!articles.length) {
        return null;
    }

    return (

        <section className="py-20">

            <Container>

                <SectionHeading
                    title="Latest Articles"
                    description="Stay updated with our newest programming tutorials, software engineering guides and technology insights."
                    href="/articles"
                />

                <div
                    className="
                        grid
                        gap-8
                        sm:grid-cols-2
                        xl:grid-cols-3
                    "
                >

                    {articles.map((article) => (

                        <ArticleCard
                            key={article.id}
                            article={article}
                        />

                    ))}

                </div>

            </Container>

        </section>

    );

}