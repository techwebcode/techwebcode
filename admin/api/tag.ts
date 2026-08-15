import api from "@/lib/axios";
import { TagResponse } from "@/types/tag";

export async function createTag(data: any) {
    const response = await api.post(
        "/admin/tags",
        data
    );

    return response.data;
}

export async function getTags(
    page = 1,
    limit = 20,
    search = ""
) {
    const response = await api.get<TagResponse>(
        `/tags?page=${page}&limit=${limit}&search=${search}`
    );

    return response.data;
}

export async function updateTag(data: any) {
    const response = await api.put(
        `/admin/tags/${data.id}`,
        data
    );

    return response.data;
}

export async function deleteTag(id: number) {
    const response = await api.delete(
        `/admin/tags/${id}`
    );

    return response.data;
}