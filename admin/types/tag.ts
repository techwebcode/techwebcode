export interface Tag {
    id: number;
    name: string;
    slug: string;
    description: string;
    status: boolean;
    sort_order: number;
    created_at: string;
}

export interface TagResponse {
    success: boolean;
    message: string;
    data: Tag[];
    meta: {
        page: number;
        limit: number;
        total: number;
    };
}