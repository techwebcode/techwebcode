package utils

import (
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetPagination(c *gin.Context) (page int, limit int, offset int) {

	page = 1
	limit = 20

	if p := c.Query("page"); p != "" {
		if value, err := strconv.Atoi(p); err == nil && value > 0 {
			page = value
		}
	}

	if l := c.Query("limit"); l != "" {
		if value, err := strconv.Atoi(l); err == nil && value > 0 && value <= 100 {
			limit = value
		}
	}

	offset = (page - 1) * limit

	return
}
