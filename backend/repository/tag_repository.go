package repository

import (
	"github.com/techwebcode/techwebcode/backend/database"
	"github.com/techwebcode/techwebcode/backend/models"
)

type TagRepository struct {
	*BaseRepository[models.Tag]
}

func NewTagRepository() *TagRepository {

	return &TagRepository{

		BaseRepository: NewBaseRepository[models.Tag](database.DB),
	}
}

// Get All Tags
func (r *TagRepository) GetAll(page, limit int, search string) ([]models.Tag, int64, error) {

	var tags []models.Tag
	var total int64

	query := database.DB.Model(&models.Tag{})

	if search != "" {
		query = query.Where("name LIKE ? OR slug LIKE ?", "%"+search+"%", "%"+search+"%")
	}

	query.Count(&total)

	err := query.
		Order("sort_order ASC, id DESC").
		Limit(limit).
		Offset((page - 1) * limit).
		Find(&tags).Error

	return tags, total, err
}

// Update Tag
func (r *TagRepository) UpdateTag(tag *models.Tag) error {
	return database.DB.Model(tag).Where("id = ?", tag.ID).Updates(map[string]interface{}{
		"name":        tag.Name,
		"slug":        tag.Slug,
		"description": tag.Description,
		"status":      tag.Status,
		"sort_order":  tag.SortOrder,
	}).Error
}
