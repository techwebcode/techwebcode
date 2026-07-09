"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { updateCategory } from "@/api/category";

export function useUpdateCategory() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: updateCategory,

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