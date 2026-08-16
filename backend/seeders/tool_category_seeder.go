package seeders

import (
	"log"

	"github.com/techwebcode/techwebcode/backend/models"
	"gorm.io/gorm"
)

func SeedToolCategories(db *gorm.DB) error {
	categories := []models.ToolCategory{
		{
			Name:        "JSON & Data",
			Slug:        "json-and-data",
			Icon:        "FileCode",
			Description: "Free online tools for formatting, validating, beautifying, and minifying JSON data structures.",
			SortOrder:   1,
			Status:      true,
		},
		{
			Name:        "Regex & SQL",
			Slug:        "regex-and-sql",
			Icon:        "Code2",
			Description: "Regular expression testers, explainers, and SQL query formatting tools.",
			SortOrder:   2,
			Status:      true,
		},
		{
			Name:        "API & DevOps",
			Slug:        "api-and-devops",
			Icon:        "ArrowRightLeft",
			Description: "API contract response checkers and deployment configuration analyzers.",
			SortOrder:   3,
			Status:      true,
		},
		{
			Name:        "YAML & Kubernetes",
			Slug:        "yaml-and-kubernetes",
			Icon:        "FileText",
			Description: "YAML formatters and Kubernetes Secret manifest generators & decoders.",
			SortOrder:   4,
			Status:      true,
		},
		{
			Name:        "Text & Encoding",
			Slug:        "text-and-encoding",
			Icon:        "ArrowLeftRight",
			Description: "Data encoding and decoding utilities for Base64 and URL percent-conversions.",
			SortOrder:   5,
			Status:      true,
		},
		{
			Name:        "Security",
			Slug:        "security",
			Icon:        "ShieldCheck",
			Description: "Security utilities including JWT decoding, claim inspection, and header analysis.",
			SortOrder:   6,
			Status:      true,
		},
		{
			Name:        "Generators",
			Slug:        "generators",
			Icon:        "RefreshCw",
			Description: "Random string, cryptographically secure UUID v4, and dummy data generators.",
			SortOrder:   7,
			Status:      true,
		},
		{
			Name:        "Date & Time",
			Slug:        "date-and-time",
			Icon:        "Clock",
			Description: "Unix Epoch timestamp conversion, ISO 8601 date parsing, and time conversion tools.",
			SortOrder:   8,
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

	log.Println("[Seeder] Successfully seeded tool categories")
	return nil
}
