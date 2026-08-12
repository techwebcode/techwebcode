package seeders

import (
	"log"

	"gorm.io/gorm"
)

// Seed is the central entry point for database seeders.
// Categories are seeded first because tools depend on category IDs.
func Seed(db *gorm.DB) error {
	log.Println("[Seeder] Starting database seeding process...")

	if err := SeedToolCategories(db); err != nil {
		log.Printf("[Seeder Error] ToolCategories seeding failed: %v", err)
		return err
	}

	if err := SeedTools(db); err != nil {
		log.Printf("[Seeder Error] Tools seeding failed: %v", err)
		return err
	}

	log.Println("[Seeder] All database seeders completed successfully!")
	return nil
}
