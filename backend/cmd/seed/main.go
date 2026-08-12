package main

import (
	"log"

	"github.com/techwebcode/techwebcode/backend/config"
	"github.com/techwebcode/techwebcode/backend/database"
	"github.com/techwebcode/techwebcode/backend/seeders"
)

func main() {
	log.Println("[Database Seeder CLI] Initializing configuration and database connection...")

	config.LoadEnv()
	database.Connect()
	database.Migrate()

	if err := seeders.Seed(database.DB); err != nil {
		log.Fatalf("[Database Seeder CLI] Seeding failed with error: %v", err)
	}

	log.Println("[Database Seeder CLI] Database seeding finished cleanly!")
}
