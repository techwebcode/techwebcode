package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/techwebcode/backend/controller"
)

func Setup(r *gin.Engine) {

	api := r.Group("/api")

	{
		api.GET("/health", controller.Health)
	}
}