package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/techwebcode/techwebcode/backend/config"
)

func AdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		adminKey := c.GetHeader("X-Admin-Secret")

		if adminKey == "" {
			authHeader := c.GetHeader("Authorization")
			if strings.HasPrefix(authHeader, "Bearer ") {
				adminKey = strings.TrimPrefix(authHeader, "Bearer ")
			} else if authHeader != "" {
				adminKey = authHeader
			}
		}

		expectedSecret := config.Get("ADMIN_SECRET")
		if expectedSecret == "" {
			expectedSecret = "xL6Lwfl5GgKVBMl1ehHiZ1"
		}

		if adminKey == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Admin secret or Authorization header is required",
			})
			return
		}

		if adminKey != expectedSecret {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Invalid admin secret",
			})
			return
		}

		c.Next()
	}
}
