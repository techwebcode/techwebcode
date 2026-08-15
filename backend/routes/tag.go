package routes

import (
	"github.com/gin-gonic/gin"

	"github.com/techwebcode/techwebcode/backend/controller"
)

// Public Routes
func RegisterTagPublicRoutes(router *gin.RouterGroup, controller *controller.TagController) {
	router.GET("/tags", controller.GetTags)
	router.GET("/Tags", controller.GetTags)
}

// Admin Routes
func RegisterTagAdminRoutes(router *gin.RouterGroup, controller *controller.TagController) {

	router.POST("/tags", controller.CreateTag)
	router.POST("/Tags", controller.CreateTag)

	router.GET("/tags", controller.GetTags)
	router.GET("/Tags", controller.GetTags)

	router.PUT("/tags/:id", controller.UpdateTag)
	router.PUT("/Tags/:id", controller.UpdateTag)

	router.DELETE("/tags/:id", controller.DeleteTag)
	router.DELETE("/Tags/:id", controller.DeleteTag)
}