package service

import (
	"mime/multipart"

	"github.com/techwebcode/techwebcode/backend/repository"
	"github.com/techwebcode/techwebcode/backend/storage"
)

type MediaService struct {
	repository *repository.MediaRepository
	storage    storage.Storage
}

func NewMediaService(
	repo *repository.MediaRepository,
	storage storage.Storage,
) *MediaService {

	return &MediaService{
		repository: repo,
		storage:    storage,
	}
}

func (m *MediaService) Upload(file multipart.File, header *multipart.FileHeader) (string, error) {

	return m.storage.Save(file, header)
}
