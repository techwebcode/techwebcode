"use client";

import { useEffect, useState } from "react";
import {
    FormProvider,
    useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { Article } from "@/types/article";
import { ArticleSchema, ArticleFormValues } from "@/validation/article";

import BasicSection from "./BasicSection";
import ContentSection from "./ContentSection";
import SeoCard from "./SeoCard";
import PublishSection from "./PublishCard";

interface ArticleFormProps {
    article?: Article | null;
    loading?: boolean;
    onSubmit: (data: ArticleFormValues) => void;
    onCancel?: () => void;
}

export default function ArticleForm({
    article,
    loading = false,
    onSubmit,
    onCancel,
}: Readonly<ArticleFormProps>) {

    const methods = useForm<ArticleFormValues>({
        resolver: zodResolver(ArticleSchema),
        defaultValues: {
            title: "",
            slug: "",
            category_id: undefined,
            primary_tool_id: null,
            featured_image_id: null,
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
            robots: "index,follow",
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

            const catId =
                (article as any).category_id ??
                (article as any).categoryID ??
                article.category?.id;

            const toolId =
                (article as any).primary_tool_id ??
                (article as any).primaryToolID ??
                article.primary_tool?.id ??
                article.primaryTool?.id ??
                null;

            const imageId =
                (article as any).featured_image_id ??
                (article as any).featuredImageID ??
                (article as any).featured_image_media?.id ??
                null;

            reset({
                ...article,
                title: article.title || "",
                slug: article.slug || "",
                category_id: catId ? Number(catId) : undefined,
                primary_tool_id: toolId ? Number(toolId) : null,
                featured_image_id: imageId ? Number(imageId) : null,
                tag_ids: article.tags?.map((t: any) => typeof t === "number" ? t : t.id) ?? [],
                excerpt: article.excerpt || "",
                content_markdown: article.content_markdown || "",
                content_html: (article as any).content_html || "",
                featured_image: article.featured_image || (article as any).featured_image_media?.url || "",
                seo_title: article.seo_title || "",
                seo_description: article.seo_description || "",
                canonical_url: article.canonical_url || "",
                status: article.status || "draft",
                is_featured: article.is_featured || false,
                published_at: article.published_at || null,
                robots: (article as any).robots || "index,follow",
            } as unknown as ArticleFormValues);

            return;
        }

        reset({
            title: "",
            slug: "",
            category_id: undefined,
            primary_tool_id: null,
            featured_image_id: null,
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
            robots: "index,follow",
        });

    }, [article, reset]);

    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
    const [isSeoTitleManuallyEdited, setIsSeoTitleManuallyEdited] = useState(false);
    const [isSeoDescManuallyEdited, setIsSeoDescManuallyEdited] = useState(false);

    useEffect(() => {
        if (article) {
            setIsSlugManuallyEdited(true);
            setIsSeoTitleManuallyEdited(true);
            setIsSeoDescManuallyEdited(true);
        } else {
            setIsSlugManuallyEdited(false);
            setIsSeoTitleManuallyEdited(false);
            setIsSeoDescManuallyEdited(false);
        }
    }, [article]);

    useEffect(() => {

        if (!title || isSlugManuallyEdited || article) return;

        const generatedSlug = title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

        setValue("slug", generatedSlug, { shouldValidate: true });

    }, [title, isSlugManuallyEdited, article, setValue]);

    useEffect(() => {

        if (!title || isSeoTitleManuallyEdited || article) return;

        setValue(
            "seo_title",
            `${title} | TechWebCode`
        );

    }, [title, isSeoTitleManuallyEdited, article, setValue]);

    useEffect(() => {

        if (!excerpt || isSeoDescManuallyEdited || article) return;

        setValue(
            "seo_description",
            excerpt.substring(0, 160)
        );

    }, [excerpt, isSeoDescManuallyEdited, article, setValue]);

    useEffect(() => {

        if (!slug || article) return;

        setValue(
            "canonical_url",
            `https://techwebcode.in/articles/${slug}`
        );

    }, [slug, article, setValue]);

    return (

        <FormProvider {...methods}>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-8"
            >

                <BasicSection onSlugManualEdit={() => setIsSlugManuallyEdited(true)} />

                <ContentSection />

                <SeoCard
                    onSeoTitleManualEdit={() => setIsSeoTitleManuallyEdited(true)}
                    onSeoDescManualEdit={() => setIsSeoDescManuallyEdited(true)}
                />

                <PublishSection />

                <div className="flex flex-wrap items-center justify-end gap-3 border-t pt-6">

                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                    )}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            setValue("status", "draft");
                            handleSubmit((data: ArticleFormValues) => onSubmit({ ...data, status: "draft" }))();
                        }}
                        disabled={loading}
                    >
                        {loading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {article && watch("status") === "published" ? "Unpublish to Draft" : "Save Draft"}
                    </Button>

                    <Button
                        type="button"
                        variant="default"
                        onClick={() => {
                            setValue("status", "published");
                            handleSubmit((data: ArticleFormValues) => onSubmit({ ...data, status: "published" }))();
                        }}
                        disabled={loading}
                    >
                        {loading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {article ? (watch("status") === "published" ? "Update Published Article" : "Publish Article") : "Publish Article"}
                    </Button>

                </div>

            </form>

        </FormProvider>

    );

}