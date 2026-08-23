import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Article } from "@/types/article";
import ArticleMeta from "./ArticleMeta";
import CategoryBadge from "./CategoryBadge";
import { getPublicMediaUrl } from "@/utils/media";

interface Props {
  article: Article;
}

export default function FeaturedArticleCard({
  article,
}: Readonly<Props>) {
  if (!article) return null;

  const categoryName = article.category?.name || "Featured";
  const categorySlug = article.category?.slug || "featured";

  const imageUrl = getPublicMediaUrl(
    (article as any).featured_image_media ||
    (article as any).featuredImageMedia ||
    article.featured_image
  );

  return (
    <Card className="group overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-2xl">
      <Link href={`/articles/${article.slug}`}>
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          <Image
            src={
              imageUrl ||
              "/images/article-placeholder.jpg"
            }
            alt={article.title || "Featured Article"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
            <CategoryBadge
              name={categoryName}
              slug={categorySlug}
              clickable={false}
            />

            <h2 className="mt-3 text-2xl font-bold leading-tight text-white md:text-3xl lg:text-4xl">
              {article.title}
            </h2>

            <p className="mt-3 line-clamp-2 max-w-2xl text-xs md:text-sm text-white/80 leading-relaxed">
              {article.excerpt}
            </p>

            <ArticleMeta
              className="mt-4 text-white/80"
              publishedAt={article.published_at}
              createdAt={article.created_at}
              readingTime={article.reading_time}
              viewCount={article.view_count}
            />

            <span className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow transition hover:opacity-90">
              <span>Read Article</span>
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}