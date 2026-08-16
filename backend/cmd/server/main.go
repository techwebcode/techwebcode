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
	log.Println("[Server Log] Step 1: Loading environment...")
	config.LoadEnv()

	log.Println("[Server Log] Step 2: Connecting to MySQL database...")
	database.Connect()

	log.Println("[Server Log] Step 3: Running database migrations...")
	database.Migrate()

	log.Println("[Server Log] Step 4: Running database seeders...")
	if err := seeders.Seed(database.DB); err != nil {
		log.Printf("[Warning] Automatic database seeding failed: %v", err)
	}

	log.Println("[Server Log] Step 5: Bootstrapping application services...")
	boot := bootstrap.New()

	log.Println("[Server Log] Step 6: Initializing Gin router...")
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

	log.Println("[Server Log] Step 7: Registering API routes...")
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

	log.Printf("[Server Log] Step 8: Starting HTTP listener on 0.0.0.0:%s...\n", port)

	if err := router.Run("0.0.0.0:" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
