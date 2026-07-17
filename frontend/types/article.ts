import { Category } from "./category";
import { Tag } from "./tag";

export interface Article {

    id: number;

    category_id: number;

    title: string;

    slug: string;

    excerpt: string;

    content_markdown: string;

    content_html: string;

    featured_image: string;

    seo_title: string;

    seo_description: string;

    canonical_url: string;

    reading_time: number;

    view_count: number;

    is_featured: boolean;

    status: "draft" | "published";

    published_at: string | null;

    created_at: string;

    updated_at: string;

    category: Category;

    tags: Tag[];

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

export type ArticleResponse =
    ApiResponse<Article>;

export type ArticleListResponse =
    PaginatedResponse<Article>;