"use client";

import { useQuery } from "@tanstack/react-query";

import ArticleService from "@/services/article";

export function useRelatedArticles(
    slug: string
) {

    return useQuery({

        queryKey: [

            "related",

            slug,

        ],

        queryFn: () =>
            ArticleService.getRelatedArticles(slug),

        enabled: !!slug,

    });

}