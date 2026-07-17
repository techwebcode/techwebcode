"use client";

import { useQuery } from "@tanstack/react-query";

import ArticleService from "@/services/article";

export function useTrendingArticles(
    limit = 5
) {
    return useQuery({

        queryKey: [
            "trending-articles",
            limit,
        ],

        queryFn: () =>
            ArticleService.getTrendingArticles(limit),

        staleTime: 1000 * 60 * 5,

    });
}