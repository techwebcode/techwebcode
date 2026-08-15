package models

import (
	"time"

	"gorm.io/gorm"
)

type Tag struct {
	ID uint `gorm:"primaryKey" json:"id"`

	Name string `gorm:"size:100;uniqueIndex" json:"name"`

	Slug string `gorm:"size:150;uniqueIndex" json:"slug"`

	Description string `gorm:"type:text" json:"description"`

	Status bool `gorm:"default:true" json:"status"`

	SortOrder int `gorm:"default:0" json:"sort_order"`

	CreatedAt time.Time `json:"created_at"`

	UpdatedAt time.Time `json:"updated_at"`

	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
