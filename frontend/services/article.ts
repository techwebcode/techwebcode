import api from "./api";
import {
    Article,
    ArticleResponse,
    ArticleListResponse,
} from "@/types/article";

export interface GetArticlesParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    tag?: string;
    sort?: "latest" | "popular" | "oldest";
}

class ArticleService {
    async getArticles(
        params?: GetArticlesParams
    ): Promise<ArticleListResponse> {
        try {
            const response = await api.get(
                "/articles",
                {
                    params,
                }
            );
            return response.data;
        } catch {
            return {
                success: false,
                message: "Failed to fetch articles",
                data: [],
                meta: { page: 1, limit: 10, total: 0 },
            };
        }
    }

    async getArticle(
        slug: string
    ): Promise<ArticleResponse> {
        const response = await api.get(
            `/articles/${slug}`
        );
        return response.data;
    }

    async getFeaturedArticles(
        limit = 5
    ): Promise<Article[]> {
        try {
            const response = await api.get(
                "/articles/featured",
                {
                    params: {
                        limit,
                    },
                }
            );
            const data = response.data;
            if (Array.isArray(data)) {
                return data;
            }
            return data?.data ?? [];
        } catch {
            return [];
        }
    }

    async getTrendingArticles(
        limit = 5
    ): Promise<Article[]> {
        try {
            const response = await api.get(
                "/articles/trending",
                {
                    params: {
                        limit,
                    },
                }
            );
            const data = response.data;
            if (Array.isArray(data)) {
                return data;
            }
            return data?.data ?? [];
        } catch {
            return [];
        }
    }

    async getRelatedArticles(
        slug: string,
        limit = 4
    ): Promise<Article[]> {
        try {
            const response = await api.get(
                `/articles/${slug}/related`,
                {
                    params: {
                        limit,
                    },
                }
            );
            const data = response.data;
            if (Array.isArray(data)) {
                return data;
            }
            return data?.data ?? [];
        } catch {
            return [];
        }
    }

    async createArticle(
        data: Partial<Article>
    ): Promise<ArticleResponse> {
        const response = await api.post(
            "/articles",
            data
        );
        return response.data;
    }

    async updateArticle(
        id: number,
        data: Partial<Article>
    ): Promise<ArticleResponse> {
        const response = await api.put(
            `/articles/${id}`,
            data
        );
        return response.data;
    }

    async deleteArticle(
        id: number
    ): Promise<void> {
        await api.delete(
            `/articles/${id}`
        );
    }
}

export default new ArticleService();