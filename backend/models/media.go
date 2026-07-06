package models

import (
	"time"

	"gorm.io/gorm"
)

type Media struct {
	ID uint `gorm:"primaryKey"`

	UUID string `gorm:"size:100;uniqueIndex"`

	FileName string `gorm:"size:255"`

	OriginalName string `gorm:"size:255"`

	FilePath string `gorm:"size:500"`

	URL string `gorm:"size:500"`

	MimeType string `gorm:"size:100"`

	Extension string `gorm:"size:20"`

	FileSize int64

	Width int

	Height int

	CreatedAt time.Time

	UpdatedAt time.Time

	DeletedAt gorm.DeletedAt `gorm:"index"`
}
