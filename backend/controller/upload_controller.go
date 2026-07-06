package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/techwebcode/techwebcode/backend/service"
	"github.com/techwebcode/techwebcode/backend/utils"
)

type UploadController struct {
	service *service.MediaService
}

func NewUploadController(
	service *service.MediaService,
) *UploadController {

	return &UploadController{
		service: service,
	}
}

func (a *UploadController) UploadImage(c *gin.Context) {

	file, header, err := c.Request.FormFile("image")

	if err != nil {
		utils.Error(c, http.StatusBadRequest, "Image is required")
		return
	}

	defer file.Close()

	if err := utils.ValidateImage(header); err != nil {

		utils.BadRequest(c, err)

		return
	}

	path, err := a.service.Upload(file, header)

	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, "Image uploaded successfully", gin.H{
		"url": path,
	})
}
