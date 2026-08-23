package seeders

import (
	"errors"
	"log"

	"github.com/techwebcode/techwebcode/backend/models"
	"gorm.io/gorm"
)

func SeedArticleCategories(db *gorm.DB) error {
	categories := []models.Category{
		{
			Name:        "Backend Development",
			Slug:        "backend-development",
			Icon:        "Server",
			Description: "Guides, tutorials, and best practices for Go, Node.js, databases, and microservices architecture.",
			SortOrder:   1,
			Status:      true,
		},
		{
			Name:        "Frontend Development",
			Slug:        "frontend-development",
			Icon:        "Layout",
			Description: "Modern web development with React, Next.js, TypeScript, CSS, and UI design systems.",
			SortOrder:   2,
			Status:      true,
		},
		{
			Name:        "DevOps & Cloud",
			Slug:        "devops-and-cloud",
			Icon:        "Cloud",
			Description: "Containerization with Docker, Kubernetes, CI/CD deployment pipelines, and cloud engineering.",
			SortOrder:   3,
			Status:      true,
		},
		{
			Name:        "Software Architecture",
			Slug:        "software-architecture",
			Icon:        "Cpu",
			Description: "Design patterns, system architecture, performance optimization, and clean code principles.",
			SortOrder:   4,
			Status:      true,
		},
	}

	seenSlugs := make(map[string]bool)
	for _, item := range categories {
		if seenSlugs[item.Slug] {
			return errors.New("duplicate slug in article category seed data: " + item.Slug)
		}
		seenSlugs[item.Slug] = true
	}

	createdCount := 0
	existingCount := 0

	err := db.Transaction(func(tx *gorm.DB) error {
		for _, cat := range categories {
			var count int64
			if err := tx.Model(&models.Category{}).Where("slug = ?", cat.Slug).Count(&count).Error; err != nil {
				log.Printf("[Seeder Error] Failed to query article category slug %s: %v", cat.Slug, err)
				return err
			}

			if count > 0 {
				existingCount++
				continue
			}

			if err := tx.Create(&cat).Error; err != nil {
				log.Printf("[Seeder Error] Failed to create article category %s: %v", cat.Slug, err)
				return err
			}
			createdCount++
		}
		return nil
	})

	if err != nil {
		return err
	}

	log.Printf("[Seeder] Article Categories Seeding Completed | Created: %d | Existing: %d", createdCount, existingCount)
	return nil
}
