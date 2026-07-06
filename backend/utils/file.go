package utils

import (
	"errors"
	"mime/multipart"
	"path/filepath"
	"strings"
)

var allowedExtensions = map[string]bool{

	".jpg": true,

	".jpeg": true,

	".png": true,

	".webp": true,
}

const MaxUploadSize = 5 << 20

func ValidateImage(header *multipart.FileHeader) error {

	if header.Size > MaxUploadSize {

		return errors.New("maximum file size is 5MB")
	}

	ext := strings.ToLower(filepath.Ext(header.Filename))

	if !allowedExtensions[ext] {

		return errors.New("unsupported image format")
	}

	return nil
}
