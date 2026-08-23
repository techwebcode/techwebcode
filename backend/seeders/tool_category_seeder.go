package seeders

import (
	"errors"
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

	seenSlugs := make(map[string]bool)
	for _, item := range categories {
		if seenSlugs[item.Slug] {
			return errors.New("duplicate slug in tool category seed data: " + item.Slug)
		}
		seenSlugs[item.Slug] = true
	}

	createdCount := 0
	existingCount := 0

	err := db.Transaction(func(tx *gorm.DB) error {
		for _, cat := range categories {
			var count int64
			if err := tx.Model(&models.ToolCategory{}).Where("slug = ?", cat.Slug).Count(&count).Error; err != nil {
				log.Printf("[Seeder Error] Failed to query tool category slug %s: %v", cat.Slug, err)
				return err
			}

			if count > 0 {
				existingCount++
				continue
			}

			if err := tx.Create(&cat).Error; err != nil {
				log.Printf("[Seeder Error] Failed to create tool category %s: %v", cat.Slug, err)
				return err
			}
			createdCount++
		}
		return nil
	})

	if err != nil {
		return err
	}

	log.Printf("[Seeder] Tool Categories Seeding Completed | Created: %d | Existing: %d", createdCount, existingCount)
	return nil
}
