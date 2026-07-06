package dto

type CreateArticleRequest struct {
	CategoryID      uint   `json:"category_id" binding:"required"`
	Title           string `json:"title" binding:"required"`
	Excerpt         string `json:"excerpt"`
	ContentMarkdown string `json:"content_markdown" binding:"required"`

	FeaturedImage string `json:"featured_image"`

	SeoTitle       string `json:"seo_title"`
	SeoDescription string `json:"seo_description"`
	CanonicalURL   string `json:"canonical_url"`

	IsFeatured bool   `json:"is_featured"`
	Status     string `json:"status"`
}
