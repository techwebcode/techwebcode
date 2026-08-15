"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getMediaList,
    getMediaDetails,
    uploadMedia,
    updateMediaAltText,
    deleteMedia,
} from "@/api/media";

export function useMediaList(page: number, limit: number, search: string) {
    return useQuery({
        queryKey: ["media", page, limit, search],
        queryFn: () => getMediaList(page, limit, search),
    });
}

export function useMediaDetails(id: number | null) {
    return useQuery({
        queryKey: ["media-details", id],
        queryFn: () => (id ? getMediaDetails(id) : null),
        enabled: !!id,
    });
}

export function useUploadMedia() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (file: File) => uploadMedia(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["media"] });
        },
    });
}

export function useUpdateMediaAltText() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, altText }: { id: number; altText: string }) =>
            updateMediaAltText(id, altText),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["media"] });
            queryClient.invalidateQueries({ queryKey: ["media-details"] });
        },
    });
}

export function useDeleteMedia() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteMedia(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["media"] });
        },
    });
}
