package models

import "time"

type Tool struct {
	ID               uint         `gorm:"primaryKey" json:"id"`
	CategoryID       uint         `gorm:"not null" json:"category_id"`
	Category         ToolCategory `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
	Name             string       `gorm:"size:150;not null" json:"name"`
	Slug             string       `gorm:"size:150;uniqueIndex;not null" json:"slug"`
	ShortDescription string       `gorm:"size:255" json:"short_description"`
	Description      string       `gorm:"type:text" json:"description"`
	Icon             string       `gorm:"size:100" json:"icon"`
	Featured         bool         `gorm:"default:false" json:"featured"`
	Popular          bool         `gorm:"default:false" json:"popular"`
	IsNew            bool         `gorm:"default:false" json:"is_new"`
	SortOrder        int          `gorm:"default:0" json:"sort_order"`
	Status           bool         `gorm:"default:true" json:"status"`
	SeoTitle         string       `gorm:"size:255" json:"seo_title"`
	SeoDescription   string       `gorm:"type:text" json:"seo_description"`
	CreatedAt        time.Time    `json:"created_at"`
	UpdatedAt        time.Time    `json:"updated_at"`
}

