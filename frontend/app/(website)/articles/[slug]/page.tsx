import { Metadata } from "next";
import { notFound } from "next/navigation";

import Container from "@/components/layout/Container";
import ArticleHeader from "@/components/article/ArticleHeader";
import ArticleContent from "@/components/article/ArticleContent";
import ArticleSidebar from "@/components/article/ArticleSidebar";
import RelatedArticles from "@/components/article/RelatedArticles";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import AdBanner from "@/components/common/AdBanner";
import ArticleService from "@/services/article";
import Link from "next/link";
import { Wrench, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const SLUG_ALIASES: Record<string, string> = {
  "how-to-format-json-online": "how-to-format-json-online",
};

async function fetchArticleData(slug: string): Promise<any> {
  // 1. Try exact slug match from DB API
  try {
    const res = await ArticleService.getArticle(slug);
    if (res && res.data) return res.data;
  } catch {
    // Fallthrough
  }

  // 2. Try alias slug match if registered
  const targetSlug = SLUG_ALIASES[slug];
  if (targetSlug && targetSlug !== slug) {
    try {
      const aliasRes = await ArticleService.getArticle(targetSlug);
      if (aliasRes && aliasRes.data) return aliasRes.data;
    } catch {
      // Fallthrough
    }
  }

  return null;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleData(slug);

  const title = article ? article.title : "Developer Tutorial";
  const description = article?.summary || article?.seo_description || article?.excerpt || "Practical developer tutorials and troubleshooting guides.";
  const canonicalUrl = `https://techwebcode.in/articles/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | TechWebCode`,
      description,
      url: canonicalUrl,
      type: "article",
      siteName: "TechWebCode",
    },
  };
}

export default async function ArticlePage({
  params,
}: Readonly<Props>) {
  const { slug } = await params;
  const article = await fetchArticleData(slug);

  if (!article) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Articles", href: "/articles" },
    { label: article.category?.name || "Tutorial", href: `/categories/${article.category?.slug || "all"}` },
    { label: article.title },
  ];

  return (
    <Container className="py-12 space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={breadcrumbItems} />

      <ArticleHeader article={article} />

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="min-w-0 flex-1 space-y-8">
          {/* Natural Mid-Article Ad Slot */}
          <AdBanner slot="1122334455" className="my-4" />

          {/* Main Content */}
          <ArticleContent article={article} />

          {/* Embedded Tool CTA Banner (Primary Tool + Article Cluster) */}
          {(() => {
            const tool = article.primary_tool || article.primaryTool || article.relatedTool;
            if (!tool) return null;

            return (
              <div className="p-6 rounded-2xl border bg-gradient-to-r from-blue-950/30 via-background to-indigo-950/30 border-blue-500/30 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 my-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary">
                    <Wrench className="w-4 h-4" />
                    <span>RECOMMENDED INTERACTIVE TOOL</span>
                  </div>
                  <h4 className="font-bold text-base text-foreground">
                    {tool.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {tool.short_description || tool.description || `Interactive ${tool.name} developer tool.`}
                  </p>
                </div>

                <Link
                  href={`/tools/${tool.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all shrink-0"
                >
                  <span>Try the TechWebCode {tool.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })()}
        </div>

        <ArticleSidebar
          url={`https://techwebcode.in/articles/${article.slug}`}
          title={article.title}
        />
      </div>

      <RelatedArticles slug={article.slug} />

      {/* Non-Intrusive Bottom Ad Banner */}
      <AdBanner slot="9988776655" className="mt-12" />
    </Container>
  );
}