package routes

import (
	"github.com/gin-gonic/gin"

	"github.com/techwebcode/techwebcode/backend/controller"
)

func RegisterArticlePublicRoutes(router *gin.RouterGroup, controller *controller.ArticleController) {

	router.GET(
		"/articles",
		controller.GetArticles,
	)

	router.GET(
		"/articles/:slug",
		controller.GetArticle,
	)
}

func RegisterArticleAdminRoutes(router *gin.RouterGroup, controller *controller.ArticleController) {

	router.POST(
		"/articles",
		controller.CreateArticle,
	)

	router.DELETE(
		"/articles/:id",
		controller.DeleteArticle,
	)
}
