package main

import (
	"log"

	"github.com/gin-gonic/gin"

	"github.com/techwebcode/techwebcode/backend/bootstrap"
	"github.com/techwebcode/techwebcode/backend/config"
	"github.com/techwebcode/techwebcode/backend/database"
	"github.com/techwebcode/techwebcode/backend/routes"
)

func main() {

	config.LoadEnv()

	database.Connect()
	database.Migrate()

	boot := bootstrap.New()

	router := gin.Default()

	routes.Setup(router, boot)
	router.Static("/uploads", "./uploads")

	log.Println("Server Started")

	router.Run(":" + config.Get("PORT"))
}
