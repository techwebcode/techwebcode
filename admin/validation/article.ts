import { z } from "zod";

export const ArticleSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters.")
        .max(255),

    slug: z
        .string()
        .min(3, "Slug is required.")
        .max(255),

    category_id: z
    .coerce
    .number()
    .min(1, "Please select a category."),
    
    tag_ids: z
        .array(z.number())
        .default([]),

    excerpt: z
        .string()
        .max(500)
        .optional(),

    content_markdown: z
        .string()
        .min(10, "Content is required."),

    content_html: z
        .string()
        .optional(),

    featured_image: z
        .string()
        .optional(),

    seo_title: z
        .string()
        .max(70)
        .optional(),

    seo_description: z
        .string()
        .max(160)
        .optional(),

    canonical_url: z
        .string()
        .url("Invalid canonical URL.")
        .optional()
        .or(z.literal("")),

    meta_keywords: z
        .string()
        .optional(),

    robots: z
        .enum([
            "index,follow",
            "noindex,follow",
            "index,nofollow",
            "noindex,nofollow",
        ])
        .default("index,follow"),

    status: z.enum([
        "draft",
        "published"
    ]),

    is_featured: z.boolean(),

    published_at: z
        .string()
        .nullable()
        .optional(),

    reading_time: z
        .number()
        .optional(),
});

export type ArticleFormValues =
    z.infer<typeof ArticleSchema>;