package models

import (
	"time"

	"gorm.io/gorm"
)

type Article struct {
	ID uint `gorm:"primaryKey" json:"id"`

	CategoryID uint     `gorm:"not null;index" json:"category_id"`
	Category   Category `gorm:"foreignKey:CategoryID"`
	Tags       []Tag    `gorm:"many2many:article_tags;" json:"tags"`

	Title string `gorm:"type:varchar(255);not null" json:"title"`
	Slug  string `gorm:"type:varchar(255);uniqueIndex;not null" json:"slug"`

	Excerpt string `gorm:"type:text" json:"excerpt"`

	ContentMarkdown string `gorm:"type:longtext" json:"content_markdown"`

	ContentHTML string `gorm:"type:longtext" json:"content_html"`

	FeaturedImage string `gorm:"type:varchar(255)" json:"featured_image"`

	SeoTitle string `gorm:"type:varchar(255)" json:"seo_title"`

	SeoDescription string `gorm:"type:text" json:"seo_description"`

	CanonicalURL string `gorm:"type:varchar(500)" json:"canonical_url"`

	ReadingTime int `gorm:"default:1" json:"reading_time"`

	ViewCount int64 `gorm:"default:0" json:"view_count"`

	IsFeatured bool `gorm:"default:false" json:"is_featured"`

	Status string `gorm:"type:enum('draft','published');default:'draft'" json:"status"`

	PublishedAt *time.Time `json:"published_at"`

	CreatedAt time.Time

	UpdatedAt time.Time

	DeletedAt gorm.DeletedAt `gorm:"index"`
}
