package seeders

import (
	"log"

	"github.com/techwebcode/techwebcode/backend/models"
	"gorm.io/gorm"
)

func SeedToolCategories(db *gorm.DB) error {
	categories := []models.ToolCategory{
		{
			Name:        "JSON",
			Slug:        "json",
			Icon:        "Code2",
			Description: "Free online tools for formatting, validating, beautifying, and minifying JSON data structures.",
			SortOrder:   1,
			Status:      true,
		},
		{
			Name:        "Encoding",
			Slug:        "encoding",
			Icon:        "ArrowLeftRight",
			Description: "Data encoding and decoding utilities for Base64, URL percent-encoding, and string conversion.",
			SortOrder:   2,
			Status:      true,
		},
		{
			Name:        "Security",
			Slug:        "security",
			Icon:        "ShieldCheck",
			Description: "Security utilities including JWT decoding, hash inspection, and token verification.",
			SortOrder:   3,
			Status:      true,
		},
		{
			Name:        "Generators",
			Slug:        "generators",
			Icon:        "RefreshCw",
			Description: "Random string, cryptographically secure UUID v4, and dummy data generators.",
			SortOrder:   4,
			Status:      true,
		},
		{
			Name:        "Date & Time",
			Slug:        "date-and-time",
			Icon:        "Clock",
			Description: "Unix Epoch timestamp conversion, ISO 8601 date parsing, and timezone tools.",
			SortOrder:   5,
			Status:      true,
		},
		{
			Name:        "Web",
			Slug:        "web",
			Icon:        "Globe",
			Description: "Web development utilities including Regex pattern testing and URL parameter parsing.",
			SortOrder:   6,
			Status:      true,
		},
		{
			Name:        "Database",
			Slug:        "database",
			Icon:        "Database",
			Description: "Database utilities for SQL query formatting, beautification, and schema inspection.",
			SortOrder:   7,
			Status:      true,
		},
		{
			Name:        "DevOps",
			Slug:        "devops",
			Icon:        "Terminal",
			Description: "Configuration tools for YAML formatting, Kubernetes secrets, and cloud infrastructure.",
			SortOrder:   8,
			Status:      true,
		},
	}

	for _, cat := range categories {
		var existing models.ToolCategory
		err := db.Where("slug = ?", cat.Slug).
			Assign(models.ToolCategory{
				Name:        cat.Name,
				Icon:        cat.Icon,
				Description: cat.Description,
				SortOrder:   cat.SortOrder,
				Status:      cat.Status,
			}).
			FirstOrCreate(&existing, models.ToolCategory{Slug: cat.Slug}).Error

		if err != nil {
			log.Printf("[Seeder Error] Failed to seed category %s: %v", cat.Slug, err)
			return err
		}
	}

	log.Println("[Seeder] Successfully seeded tool categories")
	return nil
}
