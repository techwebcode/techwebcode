package routes

import (
	"github.com/gin-gonic/gin"

	"github.com/techwebcode/techwebcode/backend/controller"
)

func RegisterUploadRoutes(router *gin.RouterGroup, controller *controller.UploadController) {

	router.POST("/upload", controller.UploadImage)
}
