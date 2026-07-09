"use client";

import { useQuery } from "@tanstack/react-query";
import { getArticles } from "@/api/article";

export function useArticleOptions() {
    return useQuery({
        queryKey: ["Article-options"],
        queryFn: async () => {
            const response = await getArticles(1, 1000, "");

            return response.data;
        },
    });
}

export function useArticles(page: number, limit: number, search: string) {
    return useQuery({
        queryKey: ["articles", page, limit, search],
        queryFn: async () => {
            const response = await getArticles(page, limit, search);

            return response.data;
        },
    });
}