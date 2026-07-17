"use client";

import { useQuery } from "@tanstack/react-query";

import ArticleService from "@/services/article";

export function useFeaturedArticles(
    limit = 5
) {
    return useQuery({

        queryKey: [
            "featured-articles",
            limit,
        ],

        queryFn: () =>
            ArticleService.getFeaturedArticles(limit),

        staleTime: 1000 * 60 * 5,

    });
}