package storage

import (
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"time"

	"github.com/google/uuid"
)

type LocalStorage struct{}

func NewLocalStorage() *LocalStorage {
	return &LocalStorage{}
}

func (l *LocalStorage) Save(file multipart.File, header *multipart.FileHeader) (string, error) {

	now := time.Now()

	dir := filepath.Join(
		"uploads",
		now.Format("2006"),
		now.Format("01"),
	)

	if err := os.MkdirAll(dir, os.ModePerm); err != nil {
		return "", err
	}

	filename := uuid.New().String() + filepath.Ext(header.Filename)

	path := filepath.Join(dir, filename)

	dst, err := os.Create(path)

	if err != nil {
		return "", err
	}

	defer dst.Close()

	_, err = io.Copy(dst, file)

	if err != nil {
		return "", err
	}

	return path, nil
}

func (l *LocalStorage) Delete(path string) error {

	return os.Remove(path)
}
