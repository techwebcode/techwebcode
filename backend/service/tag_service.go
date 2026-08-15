package service

import (
	"github.com/techwebcode/techwebcode/backend/models"
	"github.com/techwebcode/techwebcode/backend/repository"
)

type TagService struct {
	repo *repository.TagRepository
}

func NewTagService(
	repo *repository.TagRepository,
) *TagService {

	return &TagService{
		repo: repo,
	}
}

func (s *TagService) Create(tag *models.Tag) error {
	return s.repo.Create(tag)
}

func (s *TagService) GetAll(page, limit int, search string) ([]models.Tag, int64, error) {
	return s.repo.GetAll(page, limit, search)
}

func (s *TagService) GetByID(id uint) (*models.Tag, error) {
	return s.repo.FindByID(id)
}

func (s *TagService) Update(tag *models.Tag) error {
	return s.repo.UpdateTag(tag)
}

func (s *TagService) Delete(id uint) error {
	return s.repo.Delete(id)
}
