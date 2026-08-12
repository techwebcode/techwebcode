package repository

import (
	"github.com/techwebcode/techwebcode/backend/database"
	"github.com/techwebcode/techwebcode/backend/models"
)

type ArticleRepository struct{}

func NewArticleRepository() *ArticleRepository {
	return &ArticleRepository{}
}

func (r *ArticleRepository) Create(article *models.Article) error {
	if database.DB == nil {
		return ErrDatabaseNil
	}
	return database.DB.Create(article).Error
}

func (r *ArticleRepository) GetBySlug(slug string) (*models.Article, error) {
	if database.DB == nil {
		return nil, ErrDatabaseNil
	}
	var article models.Article

	err := database.DB.
		Preload("Category").
		Where("slug = ?", slug).
		First(&article).Error

	if err != nil {
		return nil, err
	}

	return &article, nil
}

func (r *ArticleRepository) GetByID(id uint) (*models.Article, error) {
	if database.DB == nil {
		return nil, ErrDatabaseNil
	}
	var article models.Article

	err := database.DB.First(&article, id).Error

	if err != nil {
		return nil, err
	}

	return &article, nil
}

func (r *ArticleRepository) Delete(id uint) error {
	if database.DB == nil {
		return ErrDatabaseNil
	}
	return database.DB.Delete(&models.Article{}, id).Error
}

func (r *ArticleRepository) GetAll(page, limit int, search string, categoryID uint) ([]models.Article, int64, error) {
	if database.DB == nil {
		return nil, 0, ErrDatabaseNil
	}
	var articles []models.Article
	var total int64

	query := database.DB.Model(&models.Article{})

	if search != "" {
		query = query.Where("title LIKE ?", "%"+search+"%")
	}

	if categoryID > 0 {
		query = query.Where("category_id = ?", categoryID)
	}

	query.Count(&total)

	err := query.
		Preload("Category").
		Order("published_at DESC, id DESC").
		Limit(limit).
		Offset((page - 1) * limit).
		Find(&articles).Error

	return articles, total, err
}

func (r *ArticleRepository) GetFeatured(limit int) ([]models.Article, error) {
	if database.DB == nil {
		return nil, ErrDatabaseNil
	}
	var articles []models.Article

	err := database.DB.
		Preload("Category").
		Where("is_featured = ? AND status = ?", 1, "published").
		Order("published_at DESC, id DESC").
		Limit(limit).
		Find(&articles).Error

	return articles, err
}

func (r *ArticleRepository) GetTrending(limit int) ([]models.Article, error) {
	if database.DB == nil {
		return nil, ErrDatabaseNil
	}
	var articles []models.Article

	err := database.DB.
		Preload("Category").
		Where("status = ?", "published").
		Order("view_count DESC, id DESC").
		Limit(limit).
		Find(&articles).Error

	return articles, err
}
