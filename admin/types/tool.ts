export interface Tool {
    id: number;
    category_id: number;
    name: string;
    slug: string;
    short_description?: string;
    description?: string;
    icon?: string;
    featured?: boolean;
    popular?: boolean;
    is_new?: boolean;
    sort_order?: number;
    status?: boolean;
    seo_title?: string;
    seo_description?: string;
}

export interface ToolListResponse {
    success: boolean;
    message: string;
    data: Tool[];
    meta?: {
        page: number;
        limit: number;
        total: number;
    };
}
