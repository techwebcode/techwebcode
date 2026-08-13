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
			Icon:        "FileCode",
			Description: "Free online tools for formatting, validating, beautifying, and minifying JSON data structures.",
			SortOrder:   1,
			Status:      true,
		},
		{
			Name:        "Security",
			Slug:        "security",
			Icon:        "ShieldCheck",
			Description: "Security utilities including JWT decoding, header inspection, and claim analysis.",
			SortOrder:   2,
			Status:      true,
		},
		{
			Name:        "Encoding",
			Slug:        "encoding",
			Icon:        "ArrowLeftRight",
			Description: "Data encoding and decoding utilities for Base64 and text conversions.",
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
			Description: "Unix Epoch timestamp conversion, ISO 8601 date parsing, and time conversion tools.",
			SortOrder:   5,
			Status:      true,
		},
		{
			Name:        "Web",
			Slug:        "web",
			Icon:        "Globe",
			Description: "Web development utilities including URL percent-encoding and Regex pattern testing.",
			SortOrder:   6,
			Status:      true,
		},
		{
			Name:        "Database",
			Slug:        "database",
			Icon:        "Database",
			Description: "Database utilities for SQL query formatting, beautification, and query cleanup.",
			SortOrder:   7,
			Status:      true,
		},
	}

	for _, cat := range categories {
		var existing models.ToolCategory
		err := db.Where("slug = ?", cat.Slug).Assign(cat).FirstOrCreate(&existing, models.ToolCategory{Slug: cat.Slug}).Error

		if err != nil {
			log.Printf("[Seeder Error] Failed to seed category %s: %v", cat.Slug, err)
			return err
		}
	}

	log.Println("[Seeder] Successfully seeded initial 7 tool categories")
	return nil
}
