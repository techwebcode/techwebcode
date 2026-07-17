import Link from "next/link";
import Image from "next/image";

import { Clock3, Eye, Calendar } from "lucide-react";

import { Article } from "@/types/article";

import { formatDate } from "@/lib/utils";

import {
    Card,
    CardContent,
} from "@/components/ui/card";
import ArticleMeta from "./ArticleMeta";
import CategoryBadge from "./CategoryBadge";

interface Props {
    article: Article;
}

export default function ArticleCard({
    article,
}: Readonly<Props>) {
    return (
        <Link href={`/articles/${article.slug}`}>

            <Card
                className="
                    group
                    h-full
                    overflow-hidden
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-xl
                "
            >

                <div className="relative aspect-[16/9] overflow-hidden">

                    <Image
                        src={
                            article.featured_image ||
                            "/images/article-placeholder.jpg"
                        }
                        alt={article.title}
                        fill
                        className="
                            object-cover
                            transition-transform
                            duration-500
                            group-hover:scale-105
                        "
                    />

                </div>

                <CardContent className="space-y-4 p-5">

                <CategoryBadge
                    name={article.category.name}
                    slug={article.category.slug}
                />
                    <h2
                        className="
                            line-clamp-2
                            text-xl
                            font-bold
                            leading-tight
                            transition-colors
                            group-hover:text-primary
                        "
                    >
                        {article.title}
                    </h2>

                    <p
                        className="
                            line-clamp-3
                            text-sm
                            text-muted-foreground
                        "
                    >
                        {article.excerpt}
                    </p>
                    <ArticleMeta

                        publishedAt={article.published_at}

                        createdAt={article.created_at}

                        readingTime={article.reading_time}

                        viewCount={article.view_count}

                    />

                </CardContent>

            </Card>

        </Link>
    );
}