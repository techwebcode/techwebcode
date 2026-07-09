"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { createCategory } from "@/api/category";

export function useCreateCategory() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: createCategory,

        onSuccess() {

            queryClient.invalidateQueries({
                queryKey: ["categories"],
            });

            toast.success(
                "Category created successfully."
            );

        },

        onError(error: any) {

            toast.error(
                error.message
            );

        },

    });

}