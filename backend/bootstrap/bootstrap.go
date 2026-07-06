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
}

func New() *Bootstrap {

	// repositories
	categoryRepo := repository.NewCategoryRepository()
	articleRepo := repository.NewArticleRepository()
	mediaRepo := repository.NewMediaRepository()

	// services
	categoryService := service.NewCategoryService(categoryRepo)
	articleService := service.NewArticleService(articleRepo, categoryRepo)
	mediaService := service.NewMediaService(mediaRepo, storage.NewLocalStorage())

	// controllers
	categoryController := controller.NewCategoryController(categoryService)
	articleController := controller.NewArticleController(articleService)
	uploadController := controller.NewUploadController(mediaService)

	return &Bootstrap{
		CategoryController: categoryController,
		ArticleController:  articleController,
		UploadController:   uploadController,
	}
}
