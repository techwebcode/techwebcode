"use client";

import { useState } from "react";

import Container from "@/components/layout/Container";

import SectionHeading from "@/components/common/SectionHeading";

import ArticleGrid from "@/components/article/ArticleGrid";

import ArticleFilters from "@/components/article/ArticleFilters";

import { useLatestArticles } from "@/hooks/useLatestArticles";

export default function ArticlesPage() {

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("all");

    const [sort, setSort] = useState("latest");

    const {

        data,

        isLoading,

    } = useLatestArticles();

    if (isLoading) {

        return null;

    }

    const articles = data?.data ?? [];

    return (

        <Container
            className="py-16"
        >

            <SectionHeading

                title="Articles"

                description="Explore all programming tutorials."

            />

            <ArticleFilters

                search={search}

                category={category}

                sort={sort}

                onSearchChange={setSearch}

                onCategoryChange={setCategory}

                onSortChange={setSort}

            />

            <ArticleGrid

                articles={articles}

            />

        </Container>

    );

}