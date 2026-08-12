export interface ToolCategory {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}

export interface Tool {
  id: number;
  categoryId?: number;
  category_id?: number;

  name: string;
  slug: string;

  shortDescription?: string;
  short_description?: string;

  description: string;

  icon?: string;

  featured: boolean;
  popular?: boolean;

  isNew?: boolean;
  is_new?: boolean;

  seoTitle?: string;
  seo_title?: string;

  seoDescription?: string;
  seo_description?: string;

  category?: ToolCategory;
}