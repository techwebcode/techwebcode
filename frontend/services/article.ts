

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

        const response = await api.get(
            "/articles",
            {
                params,
            }
        );

        return response.data;

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

        const response = await api.get(
            "/articles/featured",
            {
                params: {
                    limit,
                },
            }
        );

        return response.data;

    }

    async getTrendingArticles(
        limit = 5
    ): Promise<Article[]> {

        const response = await api.get(
            "/articles/trending",
            {
                params: {
                    limit,
                },
            }
        );

        return response.data;

    }

    async getRelatedArticles(
        slug: string,
        limit = 4
    ): Promise<Article[]> {

        const response = await api.get(
            `/articles/${slug}/related`,
            {
                params: {
                    limit,
                },
            }
        );

        return response.data;

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