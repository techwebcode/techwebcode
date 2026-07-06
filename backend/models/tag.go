package models

import (
	"time"

	"gorm.io/gorm"
)

type Tag struct {
	ID uint `gorm:"primaryKey"`

	Name string `gorm:"size:100;uniqueIndex"`

	Slug string `gorm:"size:150;uniqueIndex"`

	CreatedAt time.Time

	UpdatedAt time.Time

	DeletedAt gorm.DeletedAt `gorm:"index"`
}
