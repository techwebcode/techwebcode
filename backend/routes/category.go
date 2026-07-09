package routes

import (
	"github.com/gin-gonic/gin"

	"github.com/techwebcode/techwebcode/backend/controller"
)

// Public Routes
func RegisterCategoryPublicRoutes(router *gin.RouterGroup, controller *controller.CategoryController) {

	router.GET("/categories", controller.GetCategories)
}

// Admin Routes
func RegisterCategoryAdminRoutes(router *gin.RouterGroup, controller *controller.CategoryController) {

	router.POST("/categories", controller.CreateCategory)

	router.PUT("/categories/:id", controller.UpdateCategory)

	router.DELETE("/categories/:id", controller.DeleteCategory)
}
