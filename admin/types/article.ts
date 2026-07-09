import { Category } from "./category"

export interface ArticleForm {

    title:string

    slug:string

    category_id:number

    tags:number[]

    excerpt:string

    content_markdown:string

    featured_image:string

    seo_title:string

    seo_description:string

    canonical_url:string

    status:"draft"|"published"

    is_featured:boolean
}

export interface Article {
    id: number;
    title: string;
    slug: string;
    category: Category;
    tags: number[];
    excerpt: string;
    content_markdown: string;
    featured_image: string;
    seo_title: string;
    seo_description: string;
    canonical_url: string;
    status: "draft" | "published" ;
    is_featured: boolean;
    published_at: string;
    created_at: string;
    updated_at: string;
    view_count: number;
    reading_time: number;
}

export interface ArticleResponse {

    success:boolean

    message:string

    data:Article[]

    meta:{

        page:number

        limit:number

        total:number

    }

}