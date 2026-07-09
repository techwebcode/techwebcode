"use client";

import { useEffect } from "react";
import {
    FormProvider,
    useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { Article } from "@/types/article";
import { ArticleSchema } from "@/validation/article";

import BasicSection from "./BasicSection";
import ContentSection from "./ContentSection";
import SeoCard from "./SeoCard";
import PublishSection from "./PublishCard";

interface ArticleFormProps {
    article?: Article | null;
    loading?: boolean;
    onSubmit: (data: any) => void;
}

export default function ArticleForm({
    article,
    loading = false,
    onSubmit,
}: Readonly<ArticleFormProps>) {

    const methods = useForm({
        resolver: zodResolver(ArticleSchema),
        defaultValues: {
            title: "",

            category_id: undefined,
            tag_ids: [],

            excerpt: "",
            content_markdown: "",
            content_html: "",

            featured_image: "",

            seo_title: "",
            seo_description: "",
            canonical_url: "",

            status: "draft",
            is_featured: false,
            published_at: null,
        },
    });

    const {
        handleSubmit,
        reset,
        watch,
        setValue,
    } = methods;

    const title = watch("title");
    const slug = watch("slug");
    const excerpt = watch("excerpt");

    useEffect(() => {

        if (article) {

            reset({
                ...article,
                tag_ids:
                    article.tags?.map((t: any) => t.id) ??
                    [],
            });

            return;
        }

        reset({
            title: "",
            slug: "",
            category_id: undefined,
            tag_ids: [],
            excerpt: "",
            content_markdown: "",
            content_html: "",
            featured_image: "",
            seo_title: "",
            seo_description: "",
            canonical_url: "",
            status: "draft",
            is_featured: false,
            published_at: null,
        });

    }, [article, reset]);

    useEffect(() => {

        if (!title) return;

        const generatedSlug = title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

        setValue("slug", generatedSlug);

    }, [title, setValue]);

    useEffect(() => {

        if (!title) return;

        setValue(
            "seo_title",
            `${title} | TechWebCode`
        );

    }, [title, setValue]);

    useEffect(() => {

        if (!excerpt) return;

        setValue(
            "seo_description",
            excerpt.substring(0, 160)
        );

    }, [excerpt, setValue]);

    useEffect(() => {

        if (!slug) return;

        setValue(
            "canonical_url",
            `https://techwebcode.in/articles/${slug}`
        );

    }, [slug, setValue]);

    return (

        <FormProvider {...methods}>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-8"
            >

                <BasicSection />

                <ContentSection />

                <SeoCard />

                <PublishSection />

                <div className="flex justify-end gap-3 border-t pt-6">

                    <Button
                        type="button"
                        variant="outline"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        disabled={loading}
                    >

                        {loading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}

                        {article
                            ? "Update Article"
                            : "Create Article"}

                    </Button>

                </div>

            </form>

        </FormProvider>

    );

}