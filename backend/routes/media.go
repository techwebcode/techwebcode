package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/techwebcode/techwebcode/backend/controller"
)

func RegisterMediaAdminRoutes(router *gin.RouterGroup, controller *controller.MediaController) {
	media := router.Group("/media")
	{
		media.GET("", controller.GetAll)
		media.GET("/:id", controller.GetByID)
		media.POST("", controller.Upload)
		media.PATCH("/:id", controller.UpdateAltText)
		media.DELETE("/:id", controller.Delete)
	}
}
