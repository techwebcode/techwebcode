package repository

import (
	"github.com/techwebcode/techwebcode/backend/database"
	"github.com/techwebcode/techwebcode/backend/models"
)

type MediaRepository struct {
	*BaseRepository[models.Media]
}

func NewMediaRepository() *MediaRepository {
	return &MediaRepository{
		BaseRepository: NewBaseRepository[models.Media](database.DB),
	}
}

func (r *MediaRepository) GetAll(page, limit int, search string) ([]models.Media, int64, error) {
	if database.DB == nil {
		return nil, 0, ErrDatabaseNil
	}

	var mediaItems []models.Media
	var total int64

	query := database.DB.Model(&models.Media{})

	if search != "" {
		searchTerm := "%" + search + "%"
		query = query.Where("file_name LIKE ? OR original_name LIKE ? OR alt_text LIKE ?", searchTerm, searchTerm, searchTerm)
	}

	query.Count(&total)

	err := query.
		Order("id DESC").
		Limit(limit).
		Offset((page - 1) * limit).
		Find(&mediaItems).Error

	return mediaItems, total, err
}

func (r *MediaRepository) FindByID(id uint) (*models.Media, error) {
	if database.DB == nil {
		return nil, ErrDatabaseNil
	}

	var media models.Media
	err := database.DB.First(&media, id).Error
	if err != nil {
		return nil, err
	}
	return &media, nil
}

func (r *MediaRepository) UpdateAltText(id uint, altText string) (*models.Media, error) {
	if database.DB == nil {
		return nil, ErrDatabaseNil
	}

	var media models.Media
	if err := database.DB.First(&media, id).Error; err != nil {
		return nil, err
	}

	media.AltText = altText
	if err := database.DB.Save(&media).Error; err != nil {
		return nil, err
	}

	return &media, nil
}

func (r *MediaRepository) IsReferencedByArticle(mediaID uint) (bool, error) {
	if database.DB == nil {
		return false, ErrDatabaseNil
	}

	var media models.Media
	if err := database.DB.First(&media, mediaID).Error; err != nil {
		return false, err
	}

	var count int64
	if media.URL != "" {
		database.DB.Model(&models.Article{}).
			Where("featured_image_id = ? OR featured_image = ? OR featured_image LIKE ?", mediaID, media.URL, "%"+media.FileName+"%").
			Count(&count)
	} else {
		database.DB.Model(&models.Article{}).
			Where("featured_image_id = ?", mediaID).
			Count(&count)
	}

	return count > 0, nil
}

func (r *MediaRepository) Delete(id uint) error {
	if database.DB == nil {
		return ErrDatabaseNil
	}
	return database.DB.Delete(&models.Media{}, id).Error
}
