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

type ToolController struct {
	service *service.ToolService
}

func NewToolController(service *service.ToolService) *ToolController {
	return &ToolController{
		service: service,
	}
}

// GET /api/v1/tools (Public Endpoint - filters active tools)
func (c *ToolController) GetTools(ctx *gin.Context) {
	page, limit, _ := utils.GetPagination(ctx)
	categorySlug := ctx.Query("category")
	search := ctx.Query("search")

	var featured *bool
	if val := ctx.Query("featured"); val != "" {
		b, err := strconv.ParseBool(val)
		if err == nil {
			featured = &b
		}
	}

	var popular *bool
	if val := ctx.Query("popular"); val != "" {
		b, err := strconv.ParseBool(val)
		if err == nil {
			popular = &b
		}
	}

	var isNew *bool
	if val := ctx.Query("is_new"); val != "" {
		b, err := strconv.ParseBool(val)
		if err == nil {
			isNew = &b
		}
	}

	tools, total, err := c.service.GetTools(page, limit, categorySlug, featured, popular, isNew, search, true)
	if err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	utils.SuccessWithPagination(
		ctx,
		"Tools fetched successfully",
		tools,
		page,
		limit,
		int(total),
	)
}

// GET /api/v1/admin/tools (Admin Endpoint - returns all tools including inactive)
func (c *ToolController) GetAdminTools(ctx *gin.Context) {
	page, limit, _ := utils.GetPagination(ctx)
	categorySlug := ctx.Query("category")
	search := ctx.Query("search")

	tools, total, err := c.service.GetTools(page, limit, categorySlug, nil, nil, nil, search, false)
	if err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	utils.SuccessWithPagination(
		ctx,
		"Admin tools fetched successfully",
		tools,
		page,
		limit,
		int(total),
	)
}

// GET /api/v1/tools/featured
func (c *ToolController) GetFeaturedTools(ctx *gin.Context) {
	tools, err := c.service.GetFeatured()
	if err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(ctx, "Featured tools fetched successfully", tools)
}

// GET /api/v1/tools/categories (Public)
func (c *ToolController) GetCategories(ctx *gin.Context) {
	categories, err := c.service.GetCategories(true)
	if err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(ctx, "Tool categories fetched successfully", categories)
}

// GET /api/v1/admin/tool-categories (Admin)
func (c *ToolController) GetAdminCategories(ctx *gin.Context) {
	categories, err := c.service.GetCategories(false)
	if err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(ctx, "Admin tool categories fetched successfully", categories)
}

// GET /api/v1/admin/tool-categories/:id (Admin)
func (c *ToolController) GetCategoryByID(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		utils.Error(ctx, http.StatusBadRequest, "Invalid category ID")
		return
	}

	category, err := c.service.GetCategoryByID(uint(id))
	if err != nil {
		utils.Error(ctx, http.StatusNotFound, "Tool category not found")
		return
	}

	utils.Success(ctx, "Tool category fetched successfully", category)
}

// GET /api/v1/tools/:slug (Public)
func (c *ToolController) GetToolBySlug(ctx *gin.Context) {
	slug := ctx.Param("slug")

	tool, err := c.service.GetToolBySlug(slug)
	if err != nil {
		utils.Error(ctx, http.StatusNotFound, "Tool not found")
		return
	}

	utils.Success(ctx, "Tool details fetched successfully", tool)
}

// GET /api/v1/admin/tools/:id (Admin)
func (c *ToolController) GetToolByID(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		utils.Error(ctx, http.StatusBadRequest, "Invalid tool ID")
		return
	}

	tool, err := c.service.GetToolByID(uint(id))
	if err != nil {
		utils.Error(ctx, http.StatusNotFound, "Tool not found")
		return
	}

	utils.Success(ctx, "Tool fetched successfully", tool)
}

// POST /api/v1/admin/tools
func (c *ToolController) CreateTool(ctx *gin.Context) {
	var req dto.CreateToolRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		utils.Error(ctx, http.StatusBadRequest, err.Error())
		return
	}

	tool := models.Tool{
		CategoryID:       req.CategoryID,
		Name:             req.Name,
		Slug:             utils.GenerateSlug(req.Name),
		ShortDescription: req.ShortDescription,
		Description:      req.Description,
		Icon:             req.Icon,
		Featured:         req.Featured,
		Popular:          req.Popular,
		IsNew:            req.IsNew,
		SortOrder:        req.SortOrder,
		Status:           req.Status,
		SeoTitle:         req.SeoTitle,
		SeoDescription:   req.SeoDescription,
	}

	if err := c.service.CreateTool(&tool); err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Created(ctx, "Tool created successfully", tool)
}

// PUT /api/v1/admin/tools/:id
func (c *ToolController) UpdateTool(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		utils.Error(ctx, http.StatusBadRequest, "Invalid tool ID")
		return
	}

	var req dto.UpdateToolRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		utils.Error(ctx, http.StatusBadRequest, err.Error())
		return
	}

	tool := models.Tool{
		ID:               uint(id),
		CategoryID:       req.CategoryID,
		Name:             req.Name,
		Slug:             utils.GenerateSlug(req.Name),
		ShortDescription: req.ShortDescription,
		Description:      req.Description,
		Icon:             req.Icon,
		Featured:         req.Featured,
		Popular:          req.Popular,
		IsNew:            req.IsNew,
		SortOrder:        req.SortOrder,
		Status:           req.Status,
		SeoTitle:         req.SeoTitle,
		SeoDescription:   req.SeoDescription,
	}

	if err := c.service.UpdateTool(&tool); err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(ctx, "Tool updated successfully", tool)
}

// DELETE /api/v1/admin/tools/:id
func (c *ToolController) DeleteTool(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		utils.Error(ctx, http.StatusBadRequest, "Invalid tool ID")
		return
	}

	if err := c.service.DeleteTool(uint(id)); err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(ctx, "Tool deleted successfully", nil)
}

// POST /api/v1/admin/tool-categories
func (c *ToolController) CreateCategory(ctx *gin.Context) {
	var req dto.CreateToolCategoryRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		utils.Error(ctx, http.StatusBadRequest, err.Error())
		return
	}

	category := models.ToolCategory{
		Name:        req.Name,
		Slug:        utils.GenerateSlug(req.Name),
		Icon:        req.Icon,
		Description: req.Description,
		SortOrder:   req.SortOrder,
		Status:      req.Status,
	}

	if err := c.service.CreateCategory(&category); err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Created(ctx, "Tool category created successfully", category)
}

// PUT /api/v1/admin/tool-categories/:id
func (c *ToolController) UpdateCategory(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		utils.Error(ctx, http.StatusBadRequest, "Invalid category ID")
		return
	}

	var req dto.UpdateToolCategoryRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		utils.Error(ctx, http.StatusBadRequest, err.Error())
		return
	}

	category := models.ToolCategory{
		ID:          uint(id),
		Name:        req.Name,
		Slug:        utils.GenerateSlug(req.Name),
		Icon:        req.Icon,
		Description: req.Description,
		SortOrder:   req.SortOrder,
		Status:      req.Status,
	}

	if err := c.service.UpdateCategory(&category); err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(ctx, "Tool category updated successfully", category)
}

// DELETE /api/v1/admin/tool-categories/:id
func (c *ToolController) DeleteCategory(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		utils.Error(ctx, http.StatusBadRequest, "Invalid category ID")
		return
	}

	if err := c.service.DeleteCategory(uint(id)); err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(ctx, "Tool category deleted successfully", nil)
}
