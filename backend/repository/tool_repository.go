package repository

import (
	"errors"

	"github.com/techwebcode/techwebcode/backend/database"
	"github.com/techwebcode/techwebcode/backend/models"
)

var ErrDatabaseNil = errors.New("database connection is not initialized")

type ToolRepository struct{}

func NewToolRepository() *ToolRepository {
	return &ToolRepository{}
}

func (r *ToolRepository) Create(tool *models.Tool) error {
	if database.DB == nil {
		return ErrDatabaseNil
	}
	return database.DB.Create(tool).Error
}

func (r *ToolRepository) Update(tool *models.Tool) error {
	if database.DB == nil {
		return ErrDatabaseNil
	}
	return database.DB.Model(&models.Tool{}).
		Where("id = ?", tool.ID).
		Updates(map[string]interface{}{
			"category_id":       tool.CategoryID,
			"name":              tool.Name,
			"slug":              tool.Slug,
			"short_description": tool.ShortDescription,
			"description":       tool.Description,
			"icon":              tool.Icon,
			"featured":          tool.Featured,
			"popular":           tool.Popular,
			"is_new":            tool.IsNew,
			"sort_order":        tool.SortOrder,
			"status":            tool.Status,
			"seo_title":         tool.SeoTitle,
			"seo_description":   tool.SeoDescription,
		}).Error
}

func (r *ToolRepository) Delete(id uint) error {
	if database.DB == nil {
		return ErrDatabaseNil
	}
	return database.DB.Delete(&models.Tool{}, id).Error
}

func (r *ToolRepository) FindByID(id uint) (*models.Tool, error) {
	if database.DB == nil {
		return nil, ErrDatabaseNil
	}
	var tool models.Tool
	err := database.DB.Preload("Category").First(&tool, id).Error
	if err != nil {
		return nil, err
	}
	return &tool, nil
}

func (r *ToolRepository) FindBySlug(slug string) (*models.Tool, error) {
	if database.DB == nil {
		return nil, ErrDatabaseNil
	}
	var tool models.Tool
	err := database.DB.Preload("Category").Where("slug = ?", slug).First(&tool).Error
	if err != nil {
		return nil, err
	}
	return &tool, nil
}

func (r *ToolRepository) FindAll(page, limit int, categorySlug string, featured, popular, isNew *bool, search string, onlyActive bool) ([]models.Tool, int64, error) {
	if database.DB == nil {
		return nil, 0, ErrDatabaseNil
	}
	var tools []models.Tool
	var total int64

	query := database.DB.Model(&models.Tool{})

	if onlyActive {
		query = query.Where("status = ?", true)
	}

	if categorySlug != "" {
		var category models.ToolCategory
		if err := database.DB.Where("slug = ?", categorySlug).First(&category).Error; err == nil {
			query = query.Where("category_id = ?", category.ID)
		}
	}

	if featured != nil {
		query = query.Where("featured = ?", *featured)
	}

	if popular != nil {
		query = query.Where("popular = ?", *popular)
	}

	if isNew != nil {
		query = query.Where("is_new = ?", *isNew)
	}

	if search != "" {
		searchTerm := "%" + search + "%"
		query = query.Where("name LIKE ? OR short_description LIKE ? OR slug LIKE ?", searchTerm, searchTerm, searchTerm)
	}

	query.Count(&total)

	err := query.
		Preload("Category").
		Order("sort_order ASC, id DESC").
		Limit(limit).
		Offset((page - 1) * limit).
		Find(&tools).Error

	return tools, total, err
}

func (r *ToolRepository) FindByCategory(categorySlug string) ([]models.Tool, error) {
	if database.DB == nil {
		return nil, ErrDatabaseNil
	}
	var tools []models.Tool
	var category models.ToolCategory

	if err := database.DB.Where("slug = ?", categorySlug).First(&category).Error; err != nil {
		return nil, err
	}

	err := database.DB.
		Preload("Category").
		Where("category_id = ? AND status = ?", category.ID, true).
		Order("sort_order ASC, id DESC").
		Find(&tools).Error

	return tools, err
}

func (r *ToolRepository) Search(searchTerm string) ([]models.Tool, error) {
	if database.DB == nil {
		return nil, ErrDatabaseNil
	}
	var tools []models.Tool
	queryStr := "%" + searchTerm + "%"

	err := database.DB.
		Preload("Category").
		Where("status = ? AND (name LIKE ? OR short_description LIKE ? OR slug LIKE ?)", true, queryStr, queryStr, queryStr).
		Order("sort_order ASC, id DESC").
		Find(&tools).Error

	return tools, err
}

func (r *ToolRepository) FindFeatured() ([]models.Tool, error) {
	if database.DB == nil {
		return nil, ErrDatabaseNil
	}
	var tools []models.Tool
	err := database.DB.
		Preload("Category").
		Where("featured = ? AND status = ?", true, true).
		Order("sort_order ASC, id DESC").
		Find(&tools).Error

	return tools, err
}

func (r *ToolRepository) FindCategories(onlyActive bool) ([]models.ToolCategory, error) {
	if database.DB == nil {
		return nil, ErrDatabaseNil
	}
	var categories []models.ToolCategory
	query := database.DB.Model(&models.ToolCategory{})
	if onlyActive {
		query = query.Where("status = ?", true)
	}

	err := query.Order("sort_order ASC, id DESC").Find(&categories).Error
	return categories, err
}

func (r *ToolRepository) FindCategoryByID(id uint) (*models.ToolCategory, error) {
	if database.DB == nil {
		return nil, ErrDatabaseNil
	}
	var category models.ToolCategory
	err := database.DB.First(&category, id).Error
	if err != nil {
		return nil, err
	}
	return &category, nil
}

func (r *ToolRepository) CreateCategory(category *models.ToolCategory) error {
	if database.DB == nil {
		return ErrDatabaseNil
	}
	return database.DB.Create(category).Error
}

func (r *ToolRepository) UpdateCategory(category *models.ToolCategory) error {
	if database.DB == nil {
		return ErrDatabaseNil
	}
	return database.DB.Model(&models.ToolCategory{}).
		Where("id = ?", category.ID).
		Updates(map[string]interface{}{
			"name":        category.Name,
			"slug":        category.Slug,
			"icon":        category.Icon,
			"description": category.Description,
			"sort_order":  category.SortOrder,
			"status":      category.Status,
		}).Error
}

func (r *ToolRepository) DeleteCategory(id uint) error {
	if database.DB == nil {
		return ErrDatabaseNil
	}
	return database.DB.Delete(&models.ToolCategory{}, id).Error
}
