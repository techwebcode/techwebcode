"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createArticle } from "@/api/article";

export function useCreateArticle() {
    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: createArticle,

        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ["articles"],
            });
            toast.success(
                "Article created successfully"
            );
        },

        onError(error: any) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Failed to create article";

            toast.error(message);
        },
    });
}