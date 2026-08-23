import { MetadataRoute } from "next";
import ArticleService from "@/services/article";
import ToolService from "@/services/tool.service";

export const revalidate = 60;

const BASE_URL = "https://techwebcode.in";

// Primary Built-in Fallback Tool Slugs
const FALLBACK_TOOL_SLUGS = [
  "json-formatter",
  "json-validator",
  "json-minifier",
  "jwt-decoder",
  "base64",
  "uuid-generator",
  "timestamp-converter",
  "url-encoder",
  "regex-tester",
  "sql-formatter",
  "yaml-formatter",
  "deployment-config-doctor",
  "api-contract-checker",
  "code-diff-checker",
];

function safeDate(inputDate?: string | Date | null): Date {
  if (!inputDate) return new Date();
  const d = new Date(inputDate);
  return isNaN(d.getTime()) ? new Date() : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = BASE_URL;

  // 1. Core Static Public Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/tools`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/articles`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/playground`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];

  // 2. Dynamic Published Articles, Categories & Tags
  let publishedArticles: any[] = [];
  try {
    const res = await ArticleService.getArticles({ limit: 1000 });
    publishedArticles = res?.data ?? [];
  } catch {
    publishedArticles = [];
  }

  const articleRoutes: MetadataRoute.Sitemap = publishedArticles
    .filter((article) => article.slug && (article.status === "published" || !article.status))
    .map((article) => {
      const rawDate = article.updated_at || article.published_at || article.created_at;
      return {
        url: `${baseUrl}/articles/${article.slug}`,
        lastModified: safeDate(rawDate),
        changeFrequency: "weekly",
        priority: 0.8,
      };
    });

  // Categories & Tags from Published Articles
  const activeCategorySlugs = new Set<string>();
  const activeTagSlugs = new Set<string>();

  publishedArticles.forEach((article) => {
    if (article.status === "published" || !article.status) {
      if (article.category?.slug) {
        activeCategorySlugs.add(article.category.slug);
      }
      if (Array.isArray(article.tags)) {
        article.tags.forEach((t: any) => {
          if (t.slug) activeTagSlugs.add(t.slug);
        });
      }
    }
  });

  const categoryRoutes: MetadataRoute.Sitemap = Array.from(activeCategorySlugs).map(
    (categorySlug) => ({
      url: `${baseUrl}/categories/${categorySlug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  const tagRoutes: MetadataRoute.Sitemap = Array.from(activeTagSlugs).map((tagSlug) => ({
    url: `${baseUrl}/tags/${tagSlug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  // 3. Dynamic Public Developer Tools
  let tools: any[] = [];
  try {
    const toolsRes = await ToolService.getTools({ limit: 1000 });
    tools = Array.isArray(toolsRes) ? toolsRes : [];
  } catch {
    tools = [];
  }

  const existingToolSlugs = new Set<string>();
  const toolRoutes: MetadataRoute.Sitemap = [];

  tools
    .filter((tool) => tool.slug && (tool.status === undefined || tool.status === true))
    .forEach((tool) => {
      existingToolSlugs.add(tool.slug);
      toolRoutes.push({
        url: `${baseUrl}/tools/${tool.slug}`,
        lastModified: safeDate(tool.updated_at),
        changeFrequency: "weekly",
        priority: 0.9,
      });
    });

  // Ensure Fallback Tools are included
  FALLBACK_TOOL_SLUGS.forEach((slug) => {
    if (!existingToolSlugs.has(slug)) {
      toolRoutes.push({
        url: `${baseUrl}/tools/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      });
    }
  });

  return [...staticRoutes, ...toolRoutes, ...categoryRoutes, ...tagRoutes, ...articleRoutes];
}
