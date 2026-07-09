package repository

import (
	"github.com/techwebcode/techwebcode/backend/models"
	"gorm.io/gorm"
)

type BaseRepository[T any] struct {
	db *gorm.DB
}

func NewBaseRepository[T any](db *gorm.DB) *BaseRepository[T] {
	return &BaseRepository[T]{
		db: db,
	}
}

func (r *BaseRepository[T]) Create(entity *T) error {
	return r.db.Create(entity).Error
}

func (r *CategoryRepository) UpdateCategory(category *models.Category) error {

	return r.db.
		Model(&models.Category{}).
		Where("id = ?", category.ID).
		Updates(map[string]interface{}{
			"name":        category.Name,
			"slug":        category.Slug,
			"description": category.Description,
			"status":      category.Status,
			"sort_order":  category.SortOrder,
		}).Error
}

func (r *BaseRepository[T]) Delete(id uint) error {

	var entity T

	return r.db.Delete(&entity, id).Error
}

func (r *BaseRepository[T]) FindByID(id uint) (*T, error) {

	var entity T

	err := r.db.First(&entity, id).Error

	if err != nil {
		return nil, err
	}

	return &entity, nil
}

func (r *BaseRepository[T]) GetAll() ([]T, error) {

	var entities []T

	err := r.db.Find(&entities).Error

	return entities, err
}
