package routes

import (
	"github.com/gin-gonic/gin"

	"github.com/techwebcode/techwebcode/backend/middleware"
)

func RegisterAdminRoutes(router *gin.RouterGroup) {
	router.Use(middleware.AdminMiddleware())

	// Future routes
	// router.POST("/article", controller.CreateArticle)
	// router.PUT("/article/:id", controller.UpdateArticle)
	// router.DELETE("/article/:id", controller.DeleteArticle)
}
