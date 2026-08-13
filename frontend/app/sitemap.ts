import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://techwebcode.in";
  const now = new Date().toISOString();

  // Static Routes
  const routes = [
    "",
    "/articles",
    "/tools",
    "/categories",
    "/about",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Developer Tools Slugs
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
  ].map((slug) => ({
    url: `${baseUrl}/tools/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Key SEO Articles Slugs
  const articleSlugs = [
    "how-to-fix-nextjs-hydration-error",
    "how-to-connect-go-to-mysql",
    "how-to-deploy-go-api-with-docker",
    "flutter-push-notifications-fcm-setup",
    "how-to-format-json-and-fix-syntax-errors",
  ].map((slug) => ({
    url: `${baseUrl}/articles/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  // Categories Slugs
  const categorySlugs = [
    "frontend",
    "backend",
    "devops",
    "system-design",
    "mobile",
  ].map((slug) => ({
    url: `${baseUrl}/categories/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  return [...routes, ...toolSlugs, ...articleSlugs, ...categorySlugs];
}
