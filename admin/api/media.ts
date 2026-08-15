import api from "@/lib/axios";
import { MediaListResponse, MediaResponse } from "@/types/media";

export async function getMediaList(page = 1, limit = 24, search = "") {
    const response = await api.get<MediaListResponse>(
        `/admin/media?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
    );
    return response.data;
}

export async function getMediaDetails(id: number) {
    const response = await api.get<MediaResponse>(`/admin/media/${id}`);
    return response.data;
}

export async function uploadMedia(file: File) {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post<MediaResponse>("/admin/media", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

export async function updateMediaAltText(id: number, altText: string) {
    const response = await api.patch<MediaResponse>(`/admin/media/${id}`, {
        alt_text: altText,
    });
    return response.data;
}

export async function deleteMedia(id: number) {
    const response = await api.delete<{ success: boolean; message: string }>(
        `/admin/media/${id}`
    );
    return response.data;
}
