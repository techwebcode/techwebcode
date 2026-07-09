import api from "@/lib/axios";
import { ArticleResponse } from "@/types/article";

export async function createArticle(data: any) {

    const response = await api.post(
        "/admin/articles",
        data
    );

    return response.data;
}

export async function getArticles(
    page = 1,
    limit = 20,
    search = ""
) {
    const response = await api.get<ArticleResponse>(
        `/articles?page=${page}&limit=${limit}&search=${search}`
    );

    return response.data;
}

export async function updateArticle(data: any) {
    const response = await api.put(
        `/admin/categories/${data.id}`,
        data
    );

    return response.data;
}