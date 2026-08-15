package storage

import (
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/techwebcode/techwebcode/backend/config"
)

type LocalStorage struct {
	basePath string
}

func NewLocalStorage() *LocalStorage {
	basePath := config.Get("UPLOAD_PATH")
	if basePath == "" {
		basePath = "uploads"
	}
	return &LocalStorage{basePath: basePath}
}

func (l *LocalStorage) Save(file multipart.File, header *multipart.FileHeader) (string, error) {
	filename := uuid.New().String() + filepath.Ext(header.Filename)
	return l.SaveReader(file, filename)
}

func (l *LocalStorage) SaveReader(r io.Reader, filename string) (string, error) {
	// Sanitize filename against path traversal
	safeFilename := filepath.Base(filename)
	safeFilename = strings.ReplaceAll(safeFilename, "..", "")
	if safeFilename == "" || safeFilename == "." {
		safeFilename = uuid.New().String() + ".webp"
	}

	now := time.Now()
	yearMonth := filepath.Join(now.Format("2006"), now.Format("01"))

	dir := filepath.Join(l.basePath, yearMonth)

	if err := os.MkdirAll(dir, 0755); err != nil {
		return "", err
	}

	fullPath := filepath.Join(dir, safeFilename)

	dst, err := os.Create(fullPath)
	if err != nil {
		return "", err
	}
	defer dst.Close()

	if _, err := io.Copy(dst, r); err != nil {
		_ = os.Remove(fullPath)
		return "", err
	}

	// Public relative path e.g. "media/2026/08/filename.webp"
	relativePath := filepath.Join("media", yearMonth, safeFilename)

	return relativePath, nil
}

func (l *LocalStorage) Delete(path string) error {
	cleanPath := path
	if strings.HasPrefix(cleanPath, "/media/") {
		cleanPath = filepath.Join(l.basePath, cleanPath[7:])
	} else if strings.HasPrefix(cleanPath, "media/") {
		cleanPath = filepath.Join(l.basePath, cleanPath[6:])
	} else if strings.HasPrefix(cleanPath, "/uploads/") {
		cleanPath = filepath.Join(l.basePath, cleanPath[9:])
	} else if strings.HasPrefix(cleanPath, "uploads/") {
		cleanPath = filepath.Join(l.basePath, cleanPath[8:])
	}
	return os.Remove(cleanPath)
}
