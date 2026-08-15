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
		"/articles/featured",
		controller.GetFeaturedArticles,
	)

	router.GET(
		"/articles/trending",
		controller.GetTrendingArticles,
	)

	router.GET(
		"/articles/:slug",
		controller.GetArticle,
	)
}

func RegisterArticleAdminRoutes(router *gin.RouterGroup, controller *controller.ArticleController) {

	router.GET(
		"/articles",
		controller.GetAdminArticles,
	)

	router.POST(
		"/articles",
		controller.CreateArticle,
	)

	router.PUT(
		"/articles/:id",
		controller.UpdateArticle,
	)

	router.DELETE(
		"/articles/:id",
		controller.DeleteArticle,
	)
}
