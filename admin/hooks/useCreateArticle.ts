"use client";

import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";

import { createArticle } from "@/api/article";

export function useCreateArticle() {

    return useMutation({

        mutationFn: createArticle,

        onSuccess() {

            toast.success(
                "Article created successfully"
            );
        },

        onError(error: any) {

            toast.error(
                error.message
            );
        },
    });
}