package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/techwebcode/techwebcode/backend/dto"
	"github.com/techwebcode/techwebcode/backend/models"
	"github.com/techwebcode/techwebcode/backend/service"
	"github.com/techwebcode/techwebcode/backend/utils"
)

type CategoryController struct {
	service *service.CategoryService
}

func NewCategoryController(
	service *service.CategoryService,
) *CategoryController {

	return &CategoryController{
		service: service,
	}
}

// POST /admin/categories
func (c *CategoryController) CreateCategory(ctx *gin.Context) {

	var category models.Category

	if err := ctx.ShouldBindJSON(&category); err != nil {
		utils.Error(ctx, http.StatusBadRequest, err.Error())
		return
	}

	category.Slug = utils.GenerateSlug(category.Name)

	err := c.service.Create(&category)

	if err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Created(ctx, "Category created successfully", category)
}

// GET /categories
func (c *CategoryController) GetCategories(ctx *gin.Context) {

	page, limit, _ := utils.GetPagination(ctx)

	categories, total, err := c.service.GetAll(page, limit)

	if err != nil {

		utils.Error(ctx, 500, err.Error())

		return
	}

	utils.SuccessWithPagination(
		ctx,
		"Categories fetched successfully",
		categories,
		page,
		limit,
		int(total),
	)
}

// DELETE /admin/categories/:id
func (c *CategoryController) DeleteCategory(ctx *gin.Context) {

	id, _ := strconv.Atoi(ctx.Param("id"))

	err := c.service.Delete(uint(id))

	if err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(ctx, "Category deleted successfully", nil)
}

// PUT /admin/categories/:id
func (c *CategoryController) UpdateCategory(ctx *gin.Context) {

	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		utils.Error(ctx, http.StatusBadRequest, "Invalid category ID")
		return
	}

	var req dto.UpdateCategoryRequest

	if err := ctx.ShouldBindJSON(&req); err != nil {
		utils.Error(ctx, http.StatusBadRequest, err.Error())
		return
	}

	category := models.Category{
		ID:          uint(id),
		Name:        req.Name,
		Slug:        utils.GenerateSlug(req.Name),
		Description: req.Description,
		Status:      req.Status,
		SortOrder:   req.SortOrder,
	}

	if err := c.service.Update(&category); err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(ctx, "Category updated successfully", category)
}
