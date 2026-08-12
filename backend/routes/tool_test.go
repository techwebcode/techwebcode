package routes_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/techwebcode/techwebcode/backend/bootstrap"
	"github.com/techwebcode/techwebcode/backend/config"
	"github.com/techwebcode/techwebcode/backend/routes"
)

func setupTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	boot := bootstrap.New()
	routes.Setup(router, boot)
	return router
}

func TestGetToolsPublicEndpoint(t *testing.T) {
	router := setupTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/tools", nil)
	resp := httptest.NewRecorder()

	router.ServeHTTP(resp, req)

	if resp.Code == http.StatusNotFound {
		t.Errorf("Expected route /api/v1/tools to exist, got 404")
	}
}

func TestGetFeaturedToolsEndpoint(t *testing.T) {
	router := setupTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/tools/featured", nil)
	resp := httptest.NewRecorder()

	router.ServeHTTP(resp, req)

	if resp.Code == http.StatusNotFound {
		t.Errorf("Expected route /api/v1/tools/featured to exist, got 404")
	}
}

func TestGetToolCategoriesEndpoint(t *testing.T) {
	router := setupTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/tools/categories", nil)
	resp := httptest.NewRecorder()

	router.ServeHTTP(resp, req)

	if resp.Code == http.StatusNotFound {
		t.Errorf("Expected route /api/v1/tools/categories to exist, got 404")
	}
}

func TestGetToolBySlugEndpoint(t *testing.T) {
	router := setupTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/tools/sample-tool", nil)
	resp := httptest.NewRecorder()

	router.ServeHTTP(resp, req)

	var res map[string]interface{}
	if err := json.Unmarshal(resp.Body.Bytes(), &res); err != nil {
		t.Errorf("Expected valid JSON response from /api/v1/tools/:slug handler, got error: %v", err)
	}

	if res["message"] != "Tool not found" {
		t.Errorf("Expected message 'Tool not found', got %v", res["message"])
	}
}

func TestAdminCreateToolCategoryWithoutSecret(t *testing.T) {
	router := setupTestRouter()

	body, _ := json.Marshal(map[string]interface{}{
		"name": "Developer Utilities",
	})

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/admin/tools/categories", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()

	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusUnauthorized {
		t.Errorf("Expected HTTP 401 Unauthorized without admin secret header for category creation, got %d", resp.Code)
	}
}

func TestAdminCreateToolCategoryWithValidSecretInvalidBody(t *testing.T) {
	router := setupTestRouter()
	config.LoadEnv()

	adminSecret := config.Get("ADMIN_SECRET")
	if adminSecret == "" {
		adminSecret = "test-secret"
		t.Setenv("ADMIN_SECRET", adminSecret)
	}

	body, _ := json.Marshal(map[string]interface{}{
		"description": "missing name field",
	})

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/admin/tools/categories", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Admin-Secret", adminSecret)
	resp := httptest.NewRecorder()

	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Errorf("Expected HTTP 400 Bad Request for missing category name field, got %d", resp.Code)
	}
}

func TestAdminToolEndpointWithoutSecret(t *testing.T) {
	router := setupTestRouter()

	body, _ := json.Marshal(map[string]interface{}{
		"name": "Test Tool",
	})

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/admin/tools", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()

	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusUnauthorized {
		t.Errorf("Expected HTTP 401 Unauthorized without admin secret header, got %d", resp.Code)
	}
}

func TestAdminToolEndpointWithInvalidSecret(t *testing.T) {
	router := setupTestRouter()

	body, _ := json.Marshal(map[string]interface{}{
		"name": "Test Tool",
	})

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/admin/tools", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Admin-Secret", "wrong-secret")
	resp := httptest.NewRecorder()

	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusUnauthorized {
		t.Errorf("Expected HTTP 401 Unauthorized with invalid admin secret, got %d", resp.Code)
	}
}

func TestAdminToolEndpointWithValidSecretInvalidBody(t *testing.T) {
	router := setupTestRouter()
	config.LoadEnv()

	adminSecret := config.Get("ADMIN_SECRET")
	if adminSecret == "" {
		adminSecret = "test-secret"
		t.Setenv("ADMIN_SECRET", adminSecret)
	}

	body, _ := json.Marshal(map[string]interface{}{
		"short_description": "invalid payload missing required fields",
	})

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/admin/tools", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Admin-Secret", adminSecret)
	resp := httptest.NewRecorder()

	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Errorf("Expected HTTP 400 Bad Request for missing required fields, got %d", resp.Code)
	}
}

func TestAdminUpdateToolWithoutSecret(t *testing.T) {
	router := setupTestRouter()

	body, _ := json.Marshal(map[string]interface{}{
		"name": "Updated Tool Name",
	})

	req, _ := http.NewRequest(http.MethodPut, "/api/v1/admin/tools/1", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()

	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusUnauthorized {
		t.Errorf("Expected HTTP 401 Unauthorized for PUT without admin secret, got %d", resp.Code)
	}
}

func TestAdminDeleteToolWithoutSecret(t *testing.T) {
	router := setupTestRouter()

	req, _ := http.NewRequest(http.MethodDelete, "/api/v1/admin/tools/1", nil)
	resp := httptest.NewRecorder()

	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusUnauthorized {
		t.Errorf("Expected HTTP 401 Unauthorized for DELETE without admin secret, got %d", resp.Code)
	}
}
