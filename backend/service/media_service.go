package service

import (
	"errors"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"

	"github.com/google/uuid"
	"github.com/techwebcode/techwebcode/backend/models"
	"github.com/techwebcode/techwebcode/backend/repository"
	"github.com/techwebcode/techwebcode/backend/storage"
	"github.com/techwebcode/techwebcode/backend/utils"
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

func (m *MediaService) Upload(file multipart.File, header *multipart.FileHeader) (*models.Media, error) {
	// 1. Validate file size & binary content magic bytes
	if err := utils.ValidateImageContent(file, header); err != nil {
		return nil, err
	}

	// 2. Generate safe collision-resistant filename
	safeFilename := utils.GenerateSafeFilename(header.Filename)

	// 3. Process & optimize image into WebP format
	processed, err := utils.ProcessAndOptimizeImage(file)
	if err != nil {
		return nil, err
	}
	defer func() {
		_ = processed.TempFile.Close()
		_ = os.Remove(processed.TempFile.Name())
	}()

	// 4. Save WebP image to persistent storage
	savedPath, err := m.storage.SaveReader(processed.TempFile, safeFilename)
	if err != nil {
		return nil, errors.New("Unable to process this image. Please try another file.")
	}

	// Normalize public URL
	publicURL := savedPath
	if !strings.HasPrefix(publicURL, "/") && !strings.HasPrefix(publicURL, "http") {
		publicURL = "/" + publicURL
	}

	// 5. Build Media record
	media := &models.Media{
		UUID:         uuid.New().String(),
		FileName:     filepath.Base(savedPath),
		OriginalName: header.Filename,
		FilePath:     savedPath,
		URL:          publicURL,
		MimeType:     "image/webp",
		Extension:    ".webp",
		FileSize:     processed.Size,
		Width:        processed.Width,
		Height:       processed.Height,
		AltText:      "",
	}

	// 6. Create database record (Atomic rollback if DB fails)
	if err := m.repository.Create(media); err != nil {
		_ = m.storage.Delete(savedPath)
		return nil, errors.New("Failed to save media record.")
	}

	return media, nil
}

func (m *MediaService) GetAll(page, limit int, search string) ([]models.Media, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 24
	}
	return m.repository.GetAll(page, limit, search)
}

func (m *MediaService) GetByID(id uint) (*models.Media, error) {
	return m.repository.FindByID(id)
}

func (m *MediaService) UpdateAltText(id uint, altText string) (*models.Media, error) {
	return m.repository.UpdateAltText(id, strings.TrimSpace(altText))
}

func (m *MediaService) Delete(id uint) error {
	media, err := m.repository.FindByID(id)
	if err != nil {
		return errors.New("media file not found")
	}

	// Check if referenced by an article
	isReferenced, err := m.repository.IsReferencedByArticle(id)
	if err == nil && isReferenced {
		return errors.New("This image is currently used by one or more articles.")
	}

	// Delete from storage
	_ = m.storage.Delete(media.FilePath)

	// Delete record from DB
	return m.repository.Delete(id)
}
