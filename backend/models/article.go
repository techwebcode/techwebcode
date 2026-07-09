package models

import (
	"time"

	"gorm.io/gorm"
)

type Article struct {
	ID uint `gorm:"primaryKey" json:"id"`

	// Relations
	CategoryID uint     `gorm:"not null;index" json:"category_id"`
	Category   Category `gorm:"foreignKey:CategoryID" json:"category"`

	Tags []Tag `gorm:"many2many:article_tags;" json:"tags"`

	// Content
	Title string `gorm:"size:255;not null" json:"title"`

	Slug string `gorm:"size:255;uniqueIndex;not null" json:"slug"`

	Excerpt string `gorm:"type:text" json:"excerpt"`

	ContentMarkdown string `gorm:"type:longtext" json:"content_markdown"`

	ContentHTML string `gorm:"type:longtext" json:"content_html"`

	FeaturedImage string `gorm:"size:500" json:"featured_image"`

	// SEO
	SeoTitle string `gorm:"size:70" json:"seo_title"`

	SeoDescription string `gorm:"size:160" json:"seo_description"`

	CanonicalURL string `gorm:"size:500" json:"canonical_url"`

	MetaKeywords string `gorm:"size:255" json:"meta_keywords"`

	Robots string `gorm:"size:30;default:index,follow" json:"robots"`

	// Publish
	Status string `gorm:"type:enum('draft','published','scheduled');default:'draft'" json:"status"`

	IsFeatured bool `gorm:"default:false" json:"is_featured"`

	PublishedAt *time.Time `json:"published_at"`

	// Analytics
	ViewCount int64 `gorm:"default:0" json:"view_count"`

	ReadingTime int `gorm:"default:1" json:"reading_time"`

	// Audit
	CreatedAt time.Time `json:"created_at"`

	UpdatedAt time.Time `json:"updated_at"`

	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
