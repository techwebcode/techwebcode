package database

import (
	"fmt"
	"log"

	"github.com/techwebcode/techwebcode/backend/config"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {

	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		config.Get("MYSQL_USER"),
		config.Get("MYSQL_PASSWORD"),
		config.Get("MYSQL_HOST"),
		config.Get("MYSQL_PORT"),
		config.Get("MYSQL_DATABASE"),
	)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal(err)
	}

	DB = db

	log.Println("MySQL Connected")
}