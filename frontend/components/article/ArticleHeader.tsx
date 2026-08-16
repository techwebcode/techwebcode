import Image from "next/image";

import { Article } from "@/types/article";

import CategoryBadge from "./CategoryBadge";
import ArticleMeta from "./ArticleMeta";
import { getPublicMediaAlt, getPublicMediaUrl } from "@/utils/media";

interface Props {
    article: Article;
}

export default function ArticleHeader({
    article,
}: Readonly<Props>) {
    const imageUrl = getPublicMediaUrl((article as any).featured_image_media || article.featured_image);
    const imageAlt = getPublicMediaAlt(article);

    return (
        <header className="mb-12">
            <CategoryBadge
                name={article.category?.name || "Tutorial"}
                slug={article.category?.slug || "tutorial"}
            />

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight lg:text-6xl">
                {article.title}
            </h1>

            {article.excerpt && (
                <p className="mt-6 max-w-4xl text-xl leading-8 text-muted-foreground">
                    {article.excerpt}
                </p>
            )}

            <ArticleMeta
                className="mt-8"
                publishedAt={article.published_at}
                createdAt={article.created_at}
                readingTime={article.reading_time}
                viewCount={article.view_count}
            />

            {Array.isArray(article.tags) && article.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                    {article.tags.map((tag: any) => (
                        <span
                            key={typeof tag === "object" ? tag.id : tag}
                            className="rounded-full bg-muted px-3 py-1 text-sm"
                        >
                            #{typeof tag === "object" ? tag.name : tag}
                        </span>
                    ))}
                </div>
            )}

            {imageUrl && (
                <div className="relative mt-10 aspect-[16/8] overflow-hidden rounded-3xl border border-border">
                    <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        priority
                        className="object-cover"
                        unoptimized
                    />
                </div>
            )}
        </header>
    );
}