package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/techwebcode/techwebcode/backend/bootstrap"
)

func Setup(
	router *gin.Engine,
	boot *bootstrap.Bootstrap,
) {

	public := router.Group("/api/v1")

	RegisterPublicRoutes(public)

	RegisterCategoryPublicRoutes(
		public,
		boot.CategoryController,
	)

	RegisterArticlePublicRoutes(
		public,
		boot.ArticleController,
	)

	RegisterToolPublicRoutes(
		public,
		boot.ToolController,
	)

	admin := router.Group("/api/v1/admin")

	RegisterAdminRoutes(admin)

	RegisterCategoryAdminRoutes(
		admin,
		boot.CategoryController,
	)

	RegisterArticleAdminRoutes(
		admin,
		boot.ArticleController,
	)

	RegisterToolAdminRoutes(
		admin,
		boot.ToolController,
	)

	RegisterUploadRoutes(
		admin,
		boot.UploadController,
	)
}
