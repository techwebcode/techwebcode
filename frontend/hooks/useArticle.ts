"use client";

import { useQuery } from "@tanstack/react-query";
import ArticleService, {
    GetArticlesParams,
} from "@/services/article";

export function useArticles(
    params?: GetArticlesParams
) {
    return useQuery({

        queryKey: ["articles", params],

        queryFn: () =>
            ArticleService.getArticles(params),

        staleTime: 1000 * 60 * 5,

    });
}