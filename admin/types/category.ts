export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    status: boolean;
    sort_order: number;
    created_at: string;
}

export interface CategoryResponse {
    success: boolean;
    message: string;
    data: Category[];
    meta: {
        page: number;
        limit: number;
        total: number;
    };
}