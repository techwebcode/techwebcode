package database

import (
	"fmt"
	"log"
	"time"

	"github.com/techwebcode/techwebcode/backend/config"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func getEnvWithDefault(key, defaultValue string) string {
	if val := config.Get(key); val != "" {
		return val
	}
	return defaultValue
}

func Connect() {
	host := getEnvWithDefault("DB_HOST", "mysql")
	port := getEnvWithDefault("DB_PORT", "3306")
	user := config.Get("DB_USER")
	pass := config.Get("DB_PASSWORD")
	dbname := config.Get("DB_NAME")

	if user == "" || dbname == "" {
		log.Fatalf("[Error] DB_USER and DB_NAME environment variables must be defined in environment configuration")
	}

	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		user,
		pass,
		host,
		port,
		dbname,
	)

	var db *gorm.DB
	var err error

	// Retry connection up to 10 times to withstand MySQL startup delay
	for i := 1; i <= 10; i++ {
		db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
		if err == nil {
			DB = db
			log.Println("MySQL Connected successfully")
			return
		}
		log.Printf("[Warning] Database connection attempt %d failed: %v. Retrying in 2 seconds...", i, err)
		time.Sleep(2 * time.Second)
	}

	log.Fatalf("[Error] Failed to connect to MySQL database after 10 attempts: %v", err)
}