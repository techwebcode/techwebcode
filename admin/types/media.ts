export interface Media {
    id: number;
    uuid: string;
    file_name: string;
    original_name: string;
    url: string;
    mime_type: string;
    extension: string;
    alt_text?: string;
    file_size: number;
    width: number;
    height: number;
    created_at: string;
    updated_at: string;
}

export interface MediaPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface MediaListResponse {
    success: boolean;
    message: string;
    data: {
        items: Media[];
        pagination: MediaPagination;
    };
}

export interface MediaResponse {
    success: boolean;
    message: string;
    data: Media;
}
