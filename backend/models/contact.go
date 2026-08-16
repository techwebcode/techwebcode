package models

import (
	"time"
)

type ContactMessage struct {
	ID            uint      `json:"id" gorm:"primaryKey"`
	Name          string    `json:"name" gorm:"size:150;not null"`
	Email         string    `json:"email" gorm:"size:150;not null"`
	Reason        string    `json:"reason" gorm:"size:100;not null"`
	RelatedToolID *uint     `json:"related_tool_id,omitempty"`
	RelatedTool   *Tool     `json:"related_tool,omitempty" gorm:"foreignKey:RelatedToolID"`
	Subject       string    `json:"subject" gorm:"size:255;not null"`
	Message       string    `json:"message" gorm:"type:text;not null"`
	Status        string    `json:"status" gorm:"size:50;default:'new'"` // "new", "read", "replied", "resolved", "spam"
	IPAddress     string    `json:"ip_address" gorm:"size:45"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}
