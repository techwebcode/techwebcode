"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTag, getTags, updateTag } from "@/api/tag";
import { toast } from "sonner";

export function useTagOptions() {
    return useQuery({
        queryKey: ["tag-options"],
        queryFn: async () => {
            const response = await getTags(1, 1000, "");

            return response.data;
        },
    });
}

export function useTags(page: number, limit: number, search: string) {
    return useQuery({
        queryKey: ["Tags", page, limit, search],
        queryFn: async () => {
            const response = await getTags(page, limit, search);

            return response.data;
        },
    });
}

export function useCreateTag() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: createTag,

        onSuccess() {

            queryClient.invalidateQueries({
                queryKey: ["tags"],
            });

            toast.success(
                "Tag created successfully."
            );

        },

        onError(error: any) {

            toast.error(
                error.message
            );

        },

    });

}



export function useUpdateTag() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: updateTag,

        onSuccess() {

            queryClient.invalidateQueries({
                queryKey: ["tags"],
            });
            console.log("Tag updated successfully.");
            toast.success(
                "Tag updated successfully."
            );

        },

        onError(error: any) {

            toast.error(
                error.message
            );

        },

    });

}