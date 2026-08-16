package dto

type CreateArticleRequest struct {
	CategoryID      uint   `json:"category_id" binding:"required"`
	PrimaryToolID   *uint  `json:"primary_tool_id"`
	FeaturedImageID *uint  `json:"featured_image_id"`
	Title           string `json:"title" binding:"required"`
	Slug            string `json:"slug"`
	Excerpt         string `json:"excerpt"`
	ContentMarkdown string `json:"content_markdown" binding:"required"`

	FeaturedImage string `json:"featured_image"`

	SeoTitle       string `json:"seo_title"`
	SeoDescription string `json:"seo_description"`
	CanonicalURL   string `json:"canonical_url"`

	IsFeatured bool   `json:"is_featured"`
	Status     string `json:"status"`
}

type UpdateArticleRequest struct {
	CategoryID      uint   `json:"category_id"`
	PrimaryToolID   *uint  `json:"primary_tool_id"`
	FeaturedImageID *uint  `json:"featured_image_id"`
	Title           string `json:"title"`
	Slug            string `json:"slug"`
	Excerpt         string `json:"excerpt"`
	ContentMarkdown string `json:"content_markdown"`

	FeaturedImage string `json:"featured_image"`

	SeoTitle       string `json:"seo_title"`
	SeoDescription string `json:"seo_description"`
	CanonicalURL   string `json:"canonical_url"`

	IsFeatured bool   `json:"is_featured"`
	Status     string `json:"status"`
}
