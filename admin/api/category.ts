import api from "@/lib/axios";
import { CategoryResponse } from "@/types/category";

export async function getCategories(
    page = 1,
    limit = 20,
    search = ""
) {
    const response = await api.get<CategoryResponse>(
        `/categories?page=${page}&limit=${limit}&search=${search}`
    );

    return response.data;
}

export async function createCategory(data: any) {
    const response = await api.post(
        "/admin/categories",
        data
    ).catch((error) => {
        console.error("Error creating category:", error);
        throw error;
    });

    return response.data;
}

export async function updateCategory(data: any) {
    const response = await api.put(
        `/admin/categories/${data.id}`,
        data
    );

    return response.data;
}

export async function deleteCategory(id: number) {
    const response = await api.delete(
        `/admin/categories/${id}`
    );

    return response.data;
}