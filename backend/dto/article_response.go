package dto

import "time"

type ArticleResponse struct {
	ID         uint `json:"id"`
	CategoryID uint `json:"category_id"`

	Title string `json:"title"`
	Slug  string `json:"slug"`

	Excerpt string `json:"excerpt"`

	FeaturedImage string `json:"featured_image"`

	Status string `json:"status"`

	ViewCount int64 `json:"view_count"`

	PublishedAt *time.Time `json:"published_at"`

	CreatedAt time.Time `json:"created_at"`
}
