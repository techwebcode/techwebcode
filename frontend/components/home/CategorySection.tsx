"use client";

import Container from "@/components/layout/Container";

import SectionHeading from "@/components/common/SectionHeading";

import CategoryGrid from "@/components/category/CategoryGrid";

import { useCategories } from "@/hooks/useCategories";

export default function CategorySection() {

    const {
        data,
        isLoading,
    } = useCategories({page:1, limit: 1});

    if (isLoading) {

        return null;

    }

    const categories = data?.data ?? [];

    if (!categories.length) {

        return null;

    }

    return (

        <section className="py-20">

            <Container>

                <SectionHeading

                    title="Browse Categories"

                    description="Find tutorials by technology."

                    href="/categories"

                />

                <CategoryGrid
                    categories={categories}
                />

            </Container>

        </section>

    );

}