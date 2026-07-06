package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/techwebcode/techwebcode/backend/controller"
)

func RegisterPublicRoutes(api *gin.RouterGroup) {

	api.GET("/health", controller.Health)

	// Future routes
	// api.GET("/articles", controller.GetArticles)
	// api.GET("/categories", controller.GetCategories)
	// api.GET("/search", controller.Search)
}
