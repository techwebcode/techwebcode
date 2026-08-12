package service

import (
	"errors"

	"github.com/techwebcode/techwebcode/backend/models"
	"github.com/techwebcode/techwebcode/backend/repository"
)

type ToolService struct {
	repo *repository.ToolRepository
}

func NewToolService(repo *repository.ToolRepository) *ToolService {
	return &ToolService{
		repo: repo,
	}
}

func (s *ToolService) GetTools(page, limit int, categorySlug string, featured, popular, isNew *bool, search string, onlyActive bool) ([]models.Tool, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}
	return s.repo.FindAll(page, limit, categorySlug, featured, popular, isNew, search, onlyActive)
}

func (s *ToolService) GetAll(page, limit int, categorySlug string, featured, popular, isNew *bool, search string) ([]models.Tool, int64, error) {
	return s.GetTools(page, limit, categorySlug, featured, popular, isNew, search, true)
}

func (s *ToolService) GetFeatured() ([]models.Tool, error) {
	return s.repo.FindFeatured()
}

func (s *ToolService) GetToolBySlug(slug string) (*models.Tool, error) {
	if slug == "" {
		return nil, errors.New("tool slug is required")
	}
	return s.repo.FindBySlug(slug)
}

func (s *ToolService) GetBySlug(slug string) (*models.Tool, error) {
	return s.GetToolBySlug(slug)
}

func (s *ToolService) GetToolByID(id uint) (*models.Tool, error) {
	if id == 0 {
		return nil, errors.New("invalid tool id")
	}
	return s.repo.FindByID(id)
}

func (s *ToolService) GetCategories(onlyActive bool) ([]models.ToolCategory, error) {
	return s.repo.FindCategories(onlyActive)
}

func (s *ToolService) GetCategoryByID(id uint) (*models.ToolCategory, error) {
	if id == 0 {
		return nil, errors.New("invalid category id")
	}
	return s.repo.FindCategoryByID(id)
}

func (s *ToolService) FindByCategory(categorySlug string) ([]models.Tool, error) {
	if categorySlug == "" {
		return nil, errors.New("category slug is required")
	}
	return s.repo.FindByCategory(categorySlug)
}

func (s *ToolService) SearchTools(query string) ([]models.Tool, error) {
	if query == "" {
		return nil, errors.New("search query is required")
	}
	return s.repo.Search(query)
}

func (s *ToolService) CreateTool(tool *models.Tool) error {
	if tool.Name == "" {
		return errors.New("tool name is required")
	}
	if tool.CategoryID == 0 {
		return errors.New("tool category_id is required")
	}
	if tool.Slug == "" {
		return errors.New("tool slug is required")
	}
	return s.repo.Create(tool)
}

func (s *ToolService) Create(tool *models.Tool) error {
	return s.CreateTool(tool)
}

func (s *ToolService) UpdateTool(tool *models.Tool) error {
	if tool.ID == 0 {
		return errors.New("invalid tool id")
	}
	if tool.Name == "" {
		return errors.New("tool name is required")
	}
	return s.repo.Update(tool)
}

func (s *ToolService) Update(tool *models.Tool) error {
	return s.UpdateTool(tool)
}

func (s *ToolService) DeleteTool(id uint) error {
	if id == 0 {
		return errors.New("invalid tool id")
	}
	return s.repo.Delete(id)
}

func (s *ToolService) Delete(id uint) error {
	return s.DeleteTool(id)
}

func (s *ToolService) CreateCategory(category *models.ToolCategory) error {
	if category.Name == "" {
		return errors.New("category name is required")
	}
	if category.Slug == "" {
		return errors.New("category slug is required")
	}
	return s.repo.CreateCategory(category)
}

func (s *ToolService) UpdateCategory(category *models.ToolCategory) error {
	if category.ID == 0 {
		return errors.New("invalid category id")
	}
	if category.Name == "" {
		return errors.New("category name is required")
	}
	return s.repo.UpdateCategory(category)
}

func (s *ToolService) DeleteCategory(id uint) error {
	if id == 0 {
		return errors.New("invalid category id")
	}
	return s.repo.DeleteCategory(id)
}
