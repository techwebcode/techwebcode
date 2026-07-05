package main

import (
	"log"

	"github.com/gin-gonic/gin"

	"github.com/techwebcode/backend/config"
	"github.com/techwebcode/backend/database"
	"github.com/techwebcode/backend/routes"
)

func main() {

	config.LoadEnv()

	database.Connect()

	router := gin.Default()

	routes.Setup(router)

	log.Println("Server Started")

	router.Run(":" + config.Get("PORT"))
}