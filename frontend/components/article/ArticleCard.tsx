import Link from "next/link";
import { Article } from "@/types/article";
import ArticleMeta from "./ArticleMeta";
import CategoryBadge from "./CategoryBadge";
import ArticleThumbnail from "./ArticleThumbnail";
import { Wrench, ArrowRight } from "lucide-react";
import { getPublicMediaUrl } from "@/utils/media";

export interface RelatedTool {
  name: string;
  href: string;
}

interface Props {
  article: Article;
  relatedTool?: RelatedTool;
}

export default function ArticleCard({ article, relatedTool }: Readonly<Props>) {
  if (!article) return null;

  const categoryName = article.category?.name || "Engineering";
  const categorySlug = article.category?.slug || "engineering";

  // Resolve featured image URL via getPublicMediaUrl with media object fallbacks
  const imageUrl = getPublicMediaUrl(
    (article as any).featured_image_media ||
    (article as any).featuredImageMedia ||
    article.featured_image
  );

  // Check if article object has primary_tool or primaryTool defined from database
  const toolObj = article.primary_tool || article.primaryTool;
  const toolName = relatedTool?.name || toolObj?.name;
  const toolHref = relatedTool?.href || (toolObj?.slug ? `/tools/${toolObj.slug}` : undefined);

  return (
    <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 transition-all duration-300 hover:-translate-y-1 hover:border-blue-600/40 hover:shadow-lg">
      <div className="flex flex-col flex-1">
        {/* Main Clickable Header & Image */}
        <Link href={`/articles/${article.slug}`} className="group/link block">
          <ArticleThumbnail
            src={imageUrl}
            alt={article.title || "Article thumbnail"}
            categorySlug={categorySlug}
            categoryName={categoryName}
          />
        </Link>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <CategoryBadge name={categoryName} slug={categorySlug} />
              <Link
                href={`/articles/${article.slug}`}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5"
              >
                <span>Read article</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-1" />
              </Link>
            </div>

            <h3 className="line-clamp-2 text-base sm:text-lg font-bold leading-snug text-slate-900 dark:text-slate-100 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
              <Link href={`/articles/${article.slug}`}>{article.title}</Link>
            </h3>

            <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {article.excerpt}
            </p>
          </div>

          <div className="pt-2">
            <ArticleMeta
              publishedAt={article.published_at}
              createdAt={article.created_at}
              readingTime={article.reading_time}
              viewCount={article.view_count}
            />
          </div>
        </div>
      </div>

      {/* Recommended Tool Cross-Link Footer Badge */}
      {toolName && toolHref && (
        <div className="px-5 py-3 border-t border-dashed border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Recommended Tool
          </span>
          <Link
            href={toolHref}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 px-2.5 py-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all shrink-0"
          >
            <Wrench className="h-3 w-3" />
            <span className="truncate max-w-[140px]">{toolName}</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </article>
  );
}