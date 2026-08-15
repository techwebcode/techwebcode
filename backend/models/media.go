package models

import (
	"time"

	"gorm.io/gorm"
)

type Media struct {
	ID uint `gorm:"primaryKey" json:"id"`

	UUID string `gorm:"size:100;uniqueIndex" json:"uuid"`

	FileName string `gorm:"size:255" json:"file_name"`

	OriginalName string `gorm:"size:255" json:"original_name"`

	FilePath string `gorm:"size:500" json:"-"`

	URL string `gorm:"size:500" json:"url"`

	MimeType string `gorm:"size:100" json:"mime_type"`

	Extension string `gorm:"size:20" json:"extension"`

	AltText string `gorm:"size:255" json:"alt_text"`

	FileSize int64 `json:"file_size"`

	Width int `json:"width"`

	Height int `json:"height"`

	CreatedAt time.Time `json:"created_at"`

	UpdatedAt time.Time `json:"updated_at"`

	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
