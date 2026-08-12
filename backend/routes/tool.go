package routes

import (
	"github.com/gin-gonic/gin"

	"github.com/techwebcode/techwebcode/backend/controller"
)

// Public Routes
func RegisterToolPublicRoutes(router *gin.RouterGroup, controller *controller.ToolController) {
	router.GET("/tools", controller.GetTools)
	router.GET("/tools/featured", controller.GetFeaturedTools)
	router.GET("/tools/categories", controller.GetCategories)
	router.GET("/tools/:slug", controller.GetToolBySlug)
}

// Admin Routes
func RegisterToolAdminRoutes(router *gin.RouterGroup, controller *controller.ToolController) {
	// Tools CRUD
	router.GET("/tools", controller.GetAdminTools)
	router.POST("/tools", controller.CreateTool)
	router.GET("/tools/:id", controller.GetToolByID)
	router.PUT("/tools/:id", controller.UpdateTool)
	router.DELETE("/tools/:id", controller.DeleteTool)

	// Tool Categories CRUD
	router.GET("/tool-categories", controller.GetAdminCategories)
	router.POST("/tool-categories", controller.CreateCategory)
	router.GET("/tool-categories/:id", controller.GetCategoryByID)
	router.PUT("/tool-categories/:id", controller.UpdateCategory)
	router.DELETE("/tool-categories/:id", controller.DeleteCategory)

	// Preserved Backward Compatibility Routes
	router.POST("/tools/categories", controller.CreateCategory)
	router.PUT("/tools/categories/:id", controller.UpdateCategory)
	router.DELETE("/tools/categories/:id", controller.DeleteCategory)
}
