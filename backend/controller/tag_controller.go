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

type TagController struct {
	service *service.TagService
}

func NewTagController(
	service *service.TagService,
) *TagController {

	return &TagController{
		service: service,
	}
}

// POST /admin/tags
func (c *TagController) CreateTag(ctx *gin.Context) {

	var req dto.CreateTagRequest

	if err := ctx.ShouldBindJSON(&req); err != nil {
		utils.Error(ctx, http.StatusBadRequest, err.Error())
		return
	}

	tag := models.Tag{
		Name:        req.Name,
		Slug:        utils.GenerateSlug(req.Name),
		Description: req.Description,
		Status:      req.Status,
		SortOrder:   req.SortOrder,
	}

	err := c.service.Create(&tag)

	if err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Created(ctx, "Tag created successfully", tag)
}

// GET /tags or GET /admin/tags
func (c *TagController) GetTags(ctx *gin.Context) {

	page, limit, _ := utils.GetPagination(ctx)
	search := ctx.Query("search")

	tags, total, err := c.service.GetAll(page, limit, search)

	if err != nil {

		utils.Error(ctx, http.StatusInternalServerError, err.Error())

		return
	}

	utils.SuccessWithPagination(
		ctx,
		"Tags fetched successfully",
		tags,
		page,
		limit,
		int(total),
	)
}

// DELETE /admin/tags/:id
func (c *TagController) DeleteTag(ctx *gin.Context) {

	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		utils.Error(ctx, http.StatusBadRequest, "Invalid tag ID")
		return
	}

	err = c.service.Delete(uint(id))

	if err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(ctx, "Tag deleted successfully", nil)
}

// PUT /admin/tags/:id
func (c *TagController) UpdateTag(ctx *gin.Context) {

	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		utils.Error(ctx, http.StatusBadRequest, "Invalid tag ID")
		return
	}

	var req dto.UpdateTagRequest

	if err := ctx.ShouldBindJSON(&req); err != nil {
		utils.Error(ctx, http.StatusBadRequest, err.Error())
		return
	}

	tag := models.Tag{
		ID:          uint(id),
		Name:        req.Name,
		Slug:        utils.GenerateSlug(req.Name),
		Description: req.Description,
		Status:      req.Status,
		SortOrder:   req.SortOrder,
	}

	if err := c.service.Update(&tag); err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(ctx, "Tag updated successfully", tag)
}
