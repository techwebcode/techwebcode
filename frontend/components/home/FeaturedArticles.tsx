"use client";

import { useFeaturedArticles } from "@/hooks/useFeaturedArticles";

import SectionHeading from "@/components/common/SectionHeading";

import ArticleCard from "@/components/article/ArticleCard";

import Container from "@/components/layout/Container";
import FeaturedArticleCard from "../article/FeaturedArticleCard";

export default function FeaturedArticles() {

    const {

        data,

        isLoading,

    } = useFeaturedArticles(3);

    if (isLoading) {

        return null;

    }

    const articles = data ?? [];

    if (!articles.length) {

        return null;

    }

    return (

        <section className="py-20">

            <Container>

                <SectionHeading

                    title="Featured Articles"

                    description="Hand-picked tutorials recommended by our editors."

                    href="/articles"

                />

                <div className="grid gap-6 lg:grid-cols-3">

                    <div className="lg:col-span-2">

                        <FeaturedArticleCard
                            article={articles[0]}
                        />

                    </div>

                    <div className="space-y-6">

                        {articles
                            .slice(1)
                            .map((article) => (

                                <ArticleCard
                                    key={article.id}
                                    article={article}
                                />

                            ))}

                    </div>

                </div>

            </Container>

        </section>

    );

}