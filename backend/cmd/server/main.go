package main

import (
	"log"

	"github.com/gin-gonic/gin"

	"github.com/techwebcode/techwebcode/config"
	"github.com/techwebcode/techwebcode/database"
	"github.com/techwebcode/techwebcode/routes"
)

func main() {

	config.LoadEnv()

	database.Connect()

	router := gin.Default()

	routes.Setup(router)

	log.Println("Server Started")

	router.Run(":" + config.Get("PORT"))
}