package controller

import (
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/techwebcode/techwebcode/backend/dto"
	"github.com/techwebcode/techwebcode/backend/service"
	"github.com/techwebcode/techwebcode/backend/utils"
)

type ArticleController struct {
	service *service.ArticleService
}

func NewArticleController(
	service *service.ArticleService,
) *ArticleController {

	return &ArticleController{
		service: service,
	}
}

func (a *ArticleController) CreateArticle(c *gin.Context) {
	var req dto.CreateArticleRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, err)
		return
	}

	article, err := a.service.Create(&req)

	if err != nil {
		utils.InternalServerError(c, err)
		return
	}

	utils.Created(c, "Article created successfully", article)
}

func (a *ArticleController) GetArticles(c *gin.Context) {

	page, limit, _ := utils.GetPagination(c)

	search := c.Query("search")

	var categoryID uint

	if category := c.Query("category"); category != "" {

		id, _ := strconv.Atoi(category)

		categoryID = uint(id)
	}

	articles, total, err := a.service.GetAll(
		page,
		limit,
		search,
		categoryID,
	)

	if err != nil {

		utils.InternalServerError(c, err)

		return
	}

	utils.SuccessWithPagination(
		c,
		"Articles fetched successfully",
		articles,
		page,
		limit,
		int(total),
	)
}

func (a *ArticleController) GetArticle(c *gin.Context) {

	slug := c.Param("slug")

	article, err := a.service.GetBySlug(slug)

	if err != nil {

		utils.NotFound(c, "Article not found")

		return
	}

	utils.Success(
		c,
		"Article fetched successfully",
		article,
	)
}

func (a *ArticleController) DeleteArticle(c *gin.Context) {

	id, _ := strconv.Atoi(c.Param("id"))

	err := a.service.Delete(uint(id))

	if err != nil {

		utils.InternalServerError(c, err)

		return
	}

	utils.Success(c, "Article deleted successfully", nil)
}
