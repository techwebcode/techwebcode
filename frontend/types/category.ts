export interface Category {

    id: number;

    name: string;

    slug: string;

    description: string;

}

export interface Pagination {

    page: number;

    limit: number;

    total: number;

    total_pages: number;

}

export interface ApiResponse<T> {

    success: boolean;

    message: string;

    data: T;

}

export interface PaginatedResponse<T> {

    success: boolean;

    message: string;

    data: T[];

    pagination: Pagination;

}

export type CategoryResponse =
    ApiResponse<Category>;

export type CategoryListResponse =
    PaginatedResponse<Category>;