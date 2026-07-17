import Image from "next/image";
import Link from "next/link";

import {
    ArrowRight,
    Calendar,
    Clock3,
    Eye,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Article } from "@/types/article";
import { formatDate } from "@/lib/utils";
import ArticleMeta from "./ArticleMeta";
import CategoryBadge from "./CategoryBadge";

interface Props {
    article: Article;
}

export default function FeaturedArticleCard({
    article,
}: Readonly<Props>) {
    return (
        <Card
            className="
                group
                overflow-hidden
                border-0
                shadow-lg
                transition-all
                duration-300
                hover:shadow-2xl
            "
        >
            <Link href={`/articles/${article.slug}`}>

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

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute bottom-0 left-0 w-full p-8">

                        <CategoryBadge
                            name={article.category.name}
                            slug={article.category.slug}
                        />

                        <h2
                            className="
                                mt-4
                                text-4xl
                                font-bold
                                leading-tight
                                text-white
                            "
                        >
                            {article.title}
                        </h2>

                        <p
                            className="
                                mt-4
                                line-clamp-2
                                max-w-2xl
                                text-white/80
                            "
                        >
                            {article.excerpt}
                        </p>

                        <ArticleMeta

                            className="mt-6 text-white/80"

                            publishedAt={article.published_at}

                            createdAt={article.created_at}

                            readingTime={article.reading_time}

                            viewCount={article.view_count}

                        />

                        <Button
                            className="mt-8"
                            size="lg"
                        >

                            Read Article

                            <ArrowRight className="ml-2 h-4 w-4" />

                        </Button>

                    </div>

                </div>

            </Link>

        </Card>
    );
}