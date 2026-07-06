package models

import (
	"time"

	"gorm.io/gorm"
)

type Category struct {
	ID             uint           `gorm:"primaryKey" json:"id"`
	Name           string         `gorm:"type:varchar(100);not null" json:"name"`
	Slug           string         `gorm:"type:varchar(150);uniqueIndex;not null" json:"slug"`
	Description    string         `gorm:"type:text" json:"description"`
	Icon           string         `gorm:"type:varchar(255)" json:"icon"`
	SeoTitle       string         `gorm:"type:varchar(255)" json:"seo_title"`
	SeoDescription string         `gorm:"type:text" json:"seo_description"`
	Status         bool           `gorm:"default:true" json:"status"`
	SortOrder      int            `gorm:"default:0" json:"sort_order"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
}