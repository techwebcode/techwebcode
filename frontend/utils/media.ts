/**
 * Resolves the canonical public media URL for TechWebCode.
 * Format: https://techwebcode.in/media/...
 */
export function getPublicMediaUrl(mediaOrUrl?: any): string {
    if (!mediaOrUrl) return "";

    let rawUrl = "";
    if (typeof mediaOrUrl === "string") {
        rawUrl = mediaOrUrl;
    } else if (typeof mediaOrUrl === "object" && mediaOrUrl !== null) {
        rawUrl = mediaOrUrl.url || mediaOrUrl.URL || "";
    }

    if (!rawUrl) return "";

    // Replace admin subdomain references if present
    rawUrl = rawUrl.replace("https://admin.techwebcode.in", "https://techwebcode.in");
    rawUrl = rawUrl.replace("http://admin.techwebcode.in", "https://techwebcode.in");
    rawUrl = rawUrl.replace("http://localhost:8080/media", "https://techwebcode.in/media");
    rawUrl = rawUrl.replace("http://backend:8080/media", "https://techwebcode.in/media");

    // If relative path, prepend canonical origin (or local dev backend origin)
    if (rawUrl.startsWith("/")) {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
        if (typeof window !== "undefined" && window.location.hostname === "localhost") {
            try {
                const origin = apiBase ? new URL(apiBase).origin : "http://localhost:8082";
                return `${origin}${rawUrl}`;
            } catch {
                return `http://localhost:8082${rawUrl}`;
            }
        }
        if (apiBase.includes("localhost") || apiBase.includes("127.0.0.1")) {
            try {
                const origin = new URL(apiBase).origin;
                return `${origin}${rawUrl}`;
            } catch {
                return `http://localhost:8082${rawUrl}`;
            }
        }
        return `https://techwebcode.in${rawUrl}`;
    }

    return rawUrl;
}

/**
 * Resolves the canonical alt text for an article featured image.
 * Uses Media.alt_text if available, falling back to article title.
 */
export function getPublicMediaAlt(article: any): string {
    if (!article) return "";
    if (article.featured_image_media?.alt_text) {
        return article.featured_image_media.alt_text;
    }
    if (article.featuredImageMedia?.alt_text) {
        return article.featuredImageMedia.alt_text;
    }
    return article.title || "";
}
