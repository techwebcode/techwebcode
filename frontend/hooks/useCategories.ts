"use client";

import { useQuery } from "@tanstack/react-query";
import CategoryService, {
    GetCategoriesParams,
} from "@/services/category";

export function useCategories(
    params: GetCategoriesParams,
) {
    return useQuery({

        queryKey: ["categories", params],

        queryFn: () =>
            CategoryService.getCategories(params),

        staleTime: 1000 * 60 * 5,

    });
}