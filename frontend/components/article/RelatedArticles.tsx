"use client";

import { useRelatedArticles } from "@/hooks/useRelatedArticles";

import ArticleGrid from "./ArticleGrid";

import SectionHeading from "@/components/common/SectionHeading";

interface Props {

    slug: string;

}

export default function RelatedArticles({

    slug,

}: Readonly<Props>) {

    const {

        data,

        isLoading,

    } = useRelatedArticles(slug);

    if (isLoading) {

        return null;

    }

    const articles = data ?? [];

    if (!articles.length) {

        return null;

    }

    return (

        <section className="mt-20">

            <SectionHeading

                title="Related Articles"

            />

            <ArticleGrid

                articles={articles}

            />

        </section>

    );

}