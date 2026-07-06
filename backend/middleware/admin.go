package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/techwebcode/techwebcode/backend/config"
)

func AdminMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {

		adminKey := c.GetHeader("X-Admin-Key")

		if adminKey == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Admin key is required",
			})
			return
		}

		if adminKey != config.Get("ADMIN_SECRET") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Invalid admin key",
			})
			return
		}

		c.Next()
	}
}