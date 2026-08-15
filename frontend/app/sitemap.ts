import { MetadataRoute } from "next";
import ArticleService from "@/services/article";
import ToolService from "@/services/tool.service";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://techwebcode.in";

  // 1. Core Static Public Pages
  const staticPaths = ["", "/tools", "/articles", "/categories", "/about", "/contact"];
  const staticRoutes: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  // 2. Dynamic Published Articles (Status = Published)
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
        lastModified: rawDate ? new Date(rawDate) : new Date(),
      };
    });

  // 3. Categories WITH AT LEAST ONE Published Article
  const activeCategorySlugs = new Set<string>();
  publishedArticles.forEach((article) => {
    if (article.category?.slug && (article.status === "published" || !article.status)) {
      activeCategorySlugs.add(article.category.slug);
    }
  });

  const categoryRoutes: MetadataRoute.Sitemap = Array.from(activeCategorySlugs).map(
    (categorySlug) => ({
      url: `${baseUrl}/categories/${categorySlug}`,
      lastModified: new Date(),
    })
  );

  // 4. Dynamic Public Developer Tools
  let tools: any[] = [];
  try {
    const toolsRes = await ToolService.getTools({ limit: 1000 });
    tools = Array.isArray(toolsRes) ? toolsRes : [];
  } catch {
    tools = [];
  }

  const toolRoutes: MetadataRoute.Sitemap = tools
    .filter((tool) => tool.slug && (tool.status === undefined || tool.status === true))
    .map((tool) => ({
      url: `${baseUrl}/tools/${tool.slug}`,
      lastModified: tool.updated_at ? new Date(tool.updated_at) : new Date(),
    }));

  return [...staticRoutes, ...toolRoutes, ...categoryRoutes, ...articleRoutes];
}
