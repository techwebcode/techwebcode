"use client";

import { useQuery } from "@tanstack/react-query";

import ArticleService from "@/services/article";

export function useLatestArticles(
    page = 1,
    limit = 12
) {
    return useQuery({

        queryKey: [
            "articles",
            "latest",
            page,
            limit,
        ],

        queryFn: () =>
            ArticleService.getArticles({
                page,
                limit,
                sort: "latest",
            }),

        staleTime: 1000 * 60 * 5,

    });
}