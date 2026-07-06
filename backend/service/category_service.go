package service

import (
	"github.com/techwebcode/techwebcode/backend/models"
	"github.com/techwebcode/techwebcode/backend/repository"
)

type CategoryService struct {
	repo *repository.CategoryRepository
}

func NewCategoryService(
	repo *repository.CategoryRepository,
) *CategoryService {

	return &CategoryService{
		repo: repo,
	}
}
func (s *CategoryService) Create(category *models.Category) error {
	return s.repo.Create(category)
}

func (s *CategoryService) GetAll(page, limit int) ([]models.Category, int64, error) {
	return s.repo.GetAll(page, limit)
}

func (s *CategoryService) GetByID(id uint) (*models.Category, error) {
	return s.repo.FindByID(id)
}

func (s *CategoryService) Update(category *models.Category) error {
	return s.repo.Update(category)
}

func (s *CategoryService) Delete(id uint) error {
	return s.repo.Delete(id)
}
