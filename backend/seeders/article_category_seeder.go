package seeders

import (
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

	for _, cat := range categories {
		var existing models.Category
		err := db.Where("slug = ?", cat.Slug).Assign(cat).FirstOrCreate(&existing, models.Category{Slug: cat.Slug}).Error

		if err != nil {
			log.Printf("[Seeder Error] Failed to seed article category %s: %v", cat.Slug, err)
			return err
		}
	}

	log.Println("[Seeder] Successfully seeded initial 4 article categories")
	return nil
}
