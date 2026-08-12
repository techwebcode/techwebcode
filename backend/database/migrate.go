package database

import (
	"log"

	"github.com/techwebcode/techwebcode/backend/models"
)

func Migrate() {

	err := DB.AutoMigrate(
		&models.Category{},
		&models.Article{},
		&models.Tag{},
		&models.Media{},
		&models.ToolCategory{},
		&models.Tool{},
	)

	if err != nil {
		log.Fatal(err)
	}

	log.Println("Migration completed")
}
