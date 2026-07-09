package main

import (
	"log"

	"github.com/gin-gonic/gin"

	"github.com/gin-contrib/cors"
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
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			config.Get("FRONTEND_URL"),
		},
		AllowMethods: []string{
			"GET",
			"POST",
			"PUT",
			"DELETE",
			"OPTIONS",
		},
		AllowHeaders: []string{
			"Origin",
			"Content-Type",
			"Accept",
			"Authorization",
			"X-Admin-Secret",
		},
		ExposeHeaders: []string{
			"Content-Length",
		},
		AllowCredentials: true,
	}))

	routes.Setup(router, boot)
	router.Static("/uploads", "./uploads")

	log.Println("Server Started")

	router.Run(":" + config.Get("PORT"))
}
