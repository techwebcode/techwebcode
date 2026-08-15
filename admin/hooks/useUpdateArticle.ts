"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateArticle } from "@/api/article";

export function useUpdateArticle() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: updateArticle,

        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ["articles"],
            });
            toast.success("Article updated successfully.");
        },

        onError(error: any) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Failed to update article";
            toast.error(message);
        },

    });

}