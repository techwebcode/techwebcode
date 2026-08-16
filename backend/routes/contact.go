package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/techwebcode/techwebcode/backend/controller"
)

func RegisterContactPublicRoutes(rg *gin.RouterGroup, cc *controller.ContactController) {
	rg.POST("/contact", cc.SubmitContactMessage)
}

func RegisterContactAdminRoutes(rg *gin.RouterGroup, cc *controller.ContactController) {
	contact := rg.Group("/contact-messages")
	{
		contact.GET("", cc.GetContactMessages)
		contact.GET("/:id", cc.GetContactMessageByID)
		contact.PUT("/:id/status", cc.UpdateContactMessageStatus)
		contact.DELETE("/:id", cc.DeleteContactMessage)
	}
}
