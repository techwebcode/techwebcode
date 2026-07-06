package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func BadRequest(c *gin.Context, err error) {
	Error(c, http.StatusBadRequest, err.Error())
}

func InternalServerError(c *gin.Context, err error) {
	Error(c, http.StatusInternalServerError, err.Error())
}

func NotFound(c *gin.Context, message string) {
	Error(c, http.StatusNotFound, message)
}
