package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/techwebcode/techwebcode/backend/controller"
)

func RegisterHealthRoute(router *gin.Engine) {
	router.GET("/health", controller.Health)
}
