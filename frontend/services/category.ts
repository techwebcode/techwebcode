import api from "./api";

import {
    Category,
    CategoryListResponse,
    CategoryResponse,
} from "@/types/category";

export interface GetCategoriesParams {

    page?: number;

    limit?: number;

    search?: string;

    sort?: "latest" | "name";

}

class CategoryService {

    /**
     * Get Categories
     */
    async getCategories(
        params?: GetCategoriesParams
    ): Promise<CategoryListResponse> {

        const response = await api.get(
            "/categories",
            {
                params,
            }
        );

        return response.data;

    }

    /**
     * Get Category By Slug
     */
    async getCategory(
        slug: string
    ): Promise<CategoryResponse> {

        const response = await api.get(
            `/categories/${slug}`
        );

        return response.data;

    }

    /**
     * Get Category By ID
     */
    async getCategoryById(
        id: number
    ): Promise<CategoryResponse> {

        const response = await api.get(
            `/categories/id/${id}`
        );

        return response.data;

    }

    /**
     * Create Category
     */
    async createCategory(
        data: Partial<Category>
    ): Promise<CategoryResponse> {

        const response = await api.post(
            "/categories",
            data
        );

        return response.data;

    }

    /**
     * Update Category
     */
    async updateCategory(
        id: number,
        data: Partial<Category>
    ): Promise<CategoryResponse> {

        const response = await api.put(
            `/categories/${id}`,
            data
        );

        return response.data;

    }

    /**
     * Delete Category
     */
    async deleteCategory(
        id: number
    ): Promise<void> {

        await api.delete(
            `/categories/${id}`
        );

    }

}

export default new CategoryService();
