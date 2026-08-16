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

	RegisterTagPublicRoutes(
		public,
		boot.TagController,
	)

	RegisterArticlePublicRoutes(
		public,
		boot.ArticleController,
	)

	RegisterToolPublicRoutes(
		public,
		boot.ToolController,
	)

	RegisterContactPublicRoutes(
		public,
		boot.ContactController,
	)

	admin := router.Group("/api/v1/admin")

	RegisterAdminRoutes(admin)

	RegisterCategoryAdminRoutes(
		admin,
		boot.CategoryController,
	)

	RegisterTagAdminRoutes(
		admin,
		boot.TagController,
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

	RegisterMediaAdminRoutes(
		admin,
		boot.MediaController,
	)

	RegisterContactAdminRoutes(
		admin,
		boot.ContactController,
	)
}
