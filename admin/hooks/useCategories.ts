"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/api/category";

export function useCategoryOptions() {
    return useQuery({
        queryKey: ["category-options"],
        queryFn: async () => {
            const response = await getCategories(1, 1000, "");

            return response.data;
        },
    });
}

export function useCategories(page: number, limit: number, search: string) {
    return useQuery({
        queryKey: ["categories", page, limit, search],
        queryFn: async () => {
            const response = await getCategories(page, limit, search);

            return response.data;
        },
    });
}