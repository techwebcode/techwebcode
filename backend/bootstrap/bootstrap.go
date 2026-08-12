package bootstrap

import (
	"github.com/techwebcode/techwebcode/backend/controller"
	"github.com/techwebcode/techwebcode/backend/repository"
	"github.com/techwebcode/techwebcode/backend/service"
	"github.com/techwebcode/techwebcode/backend/storage"
)

type Bootstrap struct {
	CategoryController *controller.CategoryController
	ArticleController  *controller.ArticleController
	UploadController   *controller.UploadController
	ToolController     *controller.ToolController
}

func New() *Bootstrap {

	// repositories
	categoryRepo := repository.NewCategoryRepository()
	articleRepo := repository.NewArticleRepository()
	mediaRepo := repository.NewMediaRepository()
	toolRepo := repository.NewToolRepository()

	// services
	categoryService := service.NewCategoryService(categoryRepo)
	articleService := service.NewArticleService(articleRepo, categoryRepo)
	mediaService := service.NewMediaService(mediaRepo, storage.NewLocalStorage())
	toolService := service.NewToolService(toolRepo)

	// controllers
	categoryController := controller.NewCategoryController(categoryService)
	articleController := controller.NewArticleController(articleService)
	uploadController := controller.NewUploadController(mediaService)
	toolController := controller.NewToolController(toolService)

	return &Bootstrap{
		CategoryController: categoryController,
		ArticleController:  articleController,
		UploadController:   uploadController,
		ToolController:     toolController,
	}
}
