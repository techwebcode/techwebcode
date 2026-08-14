import { MetadataRoute } from "next";
import ArticleService from "@/services/article";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://techwebcode.in";

  // Base meaningful modification date for site launch/update
  const baseDate = "2026-08-13";

  // Public Core Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/articles",
    "/tools",
    "/categories",
    "/about",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: baseDate,
  }));

  // Developer Tools Routes
  const toolSlugs = [
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
  ];

  const toolRoutes: MetadataRoute.Sitemap = toolSlugs.map((slug) => ({
    url: `${baseUrl}/tools/${slug}`,
    lastModified: baseDate,
  }));

  // Categories Routes
  const categorySlugs = [
    "frontend",
    "backend",
    "devops",
    "system-design",
    "mobile",
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${baseUrl}/categories/${slug}`,
    lastModified: baseDate,
  }));

  // Key SEO Articles Routes with meaningful modification dates
  let articleRoutes: MetadataRoute.Sitemap = [];

  try {
    const articlesRes = await ArticleService.getArticles({ limit: 50 });
    const fetchedArticles = articlesRes?.data ?? [];

    if (fetchedArticles.length > 0) {
      articleRoutes = fetchedArticles.map((article) => {
        const modDate =
          article.updated_at || article.published_at || article.created_at || baseDate;
        // Format ISO date string to YYYY-MM-DD
        const formattedDate = modDate ? modDate.split("T")[0] : baseDate;
        return {
          url: `${baseUrl}/articles/${article.slug}`,
          lastModified: formattedDate,
        };
      });
    }
  } catch {
    // API Fallback
  }

  // If no dynamic articles were loaded, use accurate fallback articles
  if (articleRoutes.length === 0) {
    const defaultArticleSlugs = [
      { slug: "how-to-fix-nextjs-hydration-error", date: "2026-08-10" },
      { slug: "how-to-connect-go-to-mysql", date: "2026-08-11" },
      { slug: "how-to-deploy-go-api-with-docker", date: "2026-08-12" },
      { slug: "flutter-push-notifications-fcm-setup", date: "2026-08-12" },
      { slug: "how-to-format-json-and-fix-syntax-errors", date: "2026-08-13" },
    ];

    articleRoutes = defaultArticleSlugs.map((item) => ({
      url: `${baseUrl}/articles/${item.slug}`,
      lastModified: item.date,
    }));
  }

  return [...staticRoutes, ...toolRoutes, ...categoryRoutes, ...articleRoutes];
}
