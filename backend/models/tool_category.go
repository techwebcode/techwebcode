package models

import "time"

type ToolCategory struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Name        string    `gorm:"size:100;not null" json:"name"`
	Slug        string    `gorm:"size:100;uniqueIndex;not null" json:"slug"`
	Icon        string    `gorm:"size:100" json:"icon"`
	Description string    `gorm:"type:text" json:"description"`
	SortOrder   int       `gorm:"default:0" json:"sort_order"`
	Status      bool      `gorm:"default:true" json:"status"`
	Tools       []Tool    `gorm:"foreignKey:CategoryID" json:"tools,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
