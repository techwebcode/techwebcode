package controller

import (
	"math"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/techwebcode/techwebcode/backend/service"
	"github.com/techwebcode/techwebcode/backend/utils"
)

type MediaController struct {
	service *service.MediaService
}

func NewMediaController(
	service *service.MediaService,
) *MediaController {
	return &MediaController{
		service: service,
	}
}

func (mc *MediaController) GetAll(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "24"))
	search := c.Query("search")

	mediaItems, total, err := mc.service.GetAll(page, limit, search)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, "Unable to load media. Please try again.")
		return
	}

	totalPages := int(math.Ceil(float64(total) / float64(limit)))
	if totalPages < 1 {
		totalPages = 1
	}

	utils.Success(c, "Media items fetched successfully", gin.H{
		"items": mediaItems,
		"pagination": gin.H{
			"page":       page,
			"limit":      limit,
			"total":      total,
			"totalPages": totalPages,
		},
	})
}

func (mc *MediaController) GetByID(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "Invalid media ID")
		return
	}

	media, err := mc.service.GetByID(uint(id))
	if err != nil {
		utils.Error(c, http.StatusNotFound, "Media not found")
		return
	}

	utils.Success(c, "Media details fetched successfully", media)
}

func (mc *MediaController) Upload(c *gin.Context) {
	file, header, err := c.Request.FormFile("image")
	if err != nil {
		// Fallback check for "file" field
		var errFile error
		file, header, errFile = c.Request.FormFile("file")
		if errFile != nil {
			utils.Error(c, http.StatusBadRequest, "Please select an image file to upload.")
			return
		}
	}
	defer file.Close()

	if err := utils.ValidateImage(header); err != nil {
		utils.Error(c, http.StatusBadRequest, "Unsupported file type. Please upload JPG, PNG, WebP, SVG, or GIF.")
		return
	}

	media, err := mc.service.Upload(file, header)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, "Failed to upload image. Please try again.")
		return
	}

	utils.Success(c, "Media uploaded successfully", media)
}

func (mc *MediaController) UpdateAltText(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "Invalid media ID")
		return
	}

	var requestBody struct {
		AltText string `json:"alt_text"`
	}

	if err := c.ShouldBindJSON(&requestBody); err != nil {
		utils.Error(c, http.StatusBadRequest, "Invalid request payload")
		return
	}

	media, err := mc.service.UpdateAltText(uint(id), requestBody.AltText)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, "Failed to update alt text")
		return
	}

	utils.Success(c, "Alt text updated successfully", media)
}

func (mc *MediaController) Delete(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "Invalid media ID")
		return
	}

	if err := mc.service.Delete(uint(id)); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.Success(c, "Media deleted successfully", nil)
}
