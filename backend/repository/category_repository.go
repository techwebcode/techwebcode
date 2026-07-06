package repository

import (
	"github.com/techwebcode/techwebcode/backend/database"
	"github.com/techwebcode/techwebcode/backend/models"
)

type CategoryRepository struct {
	*BaseRepository[models.Category]
}

func NewCategoryRepository() *CategoryRepository {

	return &CategoryRepository{

		BaseRepository: NewBaseRepository[models.Category](database.DB),
	}
}

// Get All Categories
func (r *CategoryRepository) GetAll(page, limit int) ([]models.Category, int64, error) {

	var categories []models.Category

	var total int64

	database.DB.Model(&models.Category{}).Count(&total)

	err := database.DB.
		Order("sort_order ASC,id DESC").
		Limit(limit).
		Offset((page - 1) * limit).
		Find(&categories).Error

	return categories, total, err
}

// Get By Slug
func (r *CategoryRepository) GetBySlug(slug string) (*models.Category, error) {
	var category models.Category

	err := database.DB.Where("slug = ?", slug).First(&category).Error

	if err != nil {
		return nil, err
	}

	return &category, nil
}
