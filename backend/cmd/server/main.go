package main

import (
	"log"

	"github.com/gin-gonic/gin"

	"github.com/gin-contrib/cors"
	"github.com/techwebcode/techwebcode/backend/bootstrap"
	"github.com/techwebcode/techwebcode/backend/config"
	"github.com/techwebcode/techwebcode/backend/database"
	"github.com/techwebcode/techwebcode/backend/routes"
	"github.com/techwebcode/techwebcode/backend/seeders"
)

func main() {

	config.LoadEnv()

	database.Connect()
	database.Migrate()

	if err := seeders.Seed(database.DB); err != nil {
		log.Printf("[Warning] Automatic database seeding failed: %v", err)
	}

	boot := bootstrap.New()

	router := gin.Default()

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowAllOrigins = true
	corsConfig.AllowHeaders = []string{
		"Origin",
		"Content-Type",
		"Accept",
		"Authorization",
		"X-Admin-Secret",
		"X-Requested-With",
	}
	corsConfig.AllowMethods = []string{
		"GET",
		"POST",
		"PUT",
		"PATCH",
		"DELETE",
		"OPTIONS",
	}

	router.Use(cors.New(corsConfig))

	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "online",
			"service": "TechWebCode Go Backend API",
			"version": "1.0.0",
			"endpoints": gin.H{
				"health":           "/api/v1/health",
				"tools":            "/api/v1/tools",
				"tool_categories": "/api/v1/tools/categories",
			},
		})
	})

	routes.Setup(router, boot)

	uploadDir := config.Get("UPLOAD_PATH")
	if uploadDir == "" {
		uploadDir = "./uploads"
	}
	router.Static("/uploads", uploadDir)
	router.Static("/media", uploadDir)

	port := config.Get("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on 0.0.0.0:%s...\n", port)

	if err := router.Run("0.0.0.0:" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
