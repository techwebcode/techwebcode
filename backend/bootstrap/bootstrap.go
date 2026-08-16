package bootstrap

import (
	"github.com/techwebcode/techwebcode/backend/controller"
	"github.com/techwebcode/techwebcode/backend/database"
	"github.com/techwebcode/techwebcode/backend/repository"
	"github.com/techwebcode/techwebcode/backend/service"
	"github.com/techwebcode/techwebcode/backend/storage"
)

type Bootstrap struct {
	CategoryController *controller.CategoryController
	TagController      *controller.TagController
	ArticleController  *controller.ArticleController
	UploadController   *controller.UploadController
	ToolController     *controller.ToolController
	MediaController    *controller.MediaController
	ContactController  *controller.ContactController
}

func New() *Bootstrap {

	// repositories
	categoryRepo := repository.NewCategoryRepository()
	tagRepo := repository.NewTagRepository()
	articleRepo := repository.NewArticleRepository()
	mediaRepo := repository.NewMediaRepository()
	toolRepo := repository.NewToolRepository()

	// services
	categoryService := service.NewCategoryService(categoryRepo)
	tagService := service.NewTagService(tagRepo)
	articleService := service.NewArticleService(articleRepo, categoryRepo, toolRepo, mediaRepo)
	mediaService := service.NewMediaService(mediaRepo, storage.NewLocalStorage())
	toolService := service.NewToolService(toolRepo)

	// controllers
	categoryController := controller.NewCategoryController(categoryService)
	tagController := controller.NewTagController(tagService)
	articleController := controller.NewArticleController(articleService)
	uploadController := controller.NewUploadController(mediaService)
	toolController := controller.NewToolController(toolService)
	mediaController := controller.NewMediaController(mediaService)
	contactController := controller.NewContactController(database.DB)

	return &Bootstrap{
		CategoryController: categoryController,
		TagController:      tagController,
		ArticleController:  articleController,
		UploadController:   uploadController,
		ToolController:     toolController,
		MediaController:    mediaController,
		ContactController:  contactController,
	}
}
