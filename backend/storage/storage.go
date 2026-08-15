package storage

import (
	"io"
	"mime/multipart"
)

type Storage interface {
	Save(file multipart.File, header *multipart.FileHeader) (string, error)
	SaveReader(r io.Reader, filename string) (string, error)
	Delete(path string) error
}
