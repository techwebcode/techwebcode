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
                queryKey: ["categories"],
            });
            console.log("Category updated successfully.");
            toast.success(
                "Category updated successfully."
            );

        },

        onError(error: any) {

            toast.error(
                error.message
            );

        },

    });

}