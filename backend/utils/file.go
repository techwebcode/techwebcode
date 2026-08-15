package utils

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/chai2010/webp"
	"github.com/disintegration/imaging"
	"github.com/google/uuid"
	"github.com/gosimple/slug"
)

const MaxUploadSize = 10 * 1024 * 1024 // 10 MB

var allowedMimeTypes = map[string]bool{
	"image/jpeg": true,
	"image/png":  true,
	"image/webp": true,
	"image/gif":  true,
	"image/avif": true,
}

var forbiddenExtensions = map[string]bool{
	".php":   true,
	".js":    true,
	".html":  true,
	".htm":   true,
	".sh":    true,
	".exe":   true,
	".svg":   true, // Block SVG to prevent script/XSS injection
	".bat":   true,
	".cmd":   true,
	".cgi":   true,
	".pl":    true,
}

func ValidateImage(header *multipart.FileHeader) error {
	if header.Size > MaxUploadSize {
		return errors.New("Image is too large. Maximum file size is 10 MB.")
	}

	ext := strings.ToLower(filepath.Ext(header.Filename))
	if forbiddenExtensions[ext] {
		return errors.New("Unsupported image format. Please upload JPG, PNG, WebP, or AVIF.")
	}

	return nil
}

func ValidateImageContent(file multipart.File, header *multipart.FileHeader) error {
	if err := ValidateImage(header); err != nil {
		return err
	}

	// Magic byte inspection (read first 512 bytes)
	buf := make([]byte, 512)
	n, err := file.Read(buf)
	if err != nil && err != io.EOF {
		return errors.New("The uploaded file is not a valid image.")
	}

	// Seek back to start
	if _, err := file.Seek(0, 0); err != nil {
		return errors.New("The uploaded file is not a valid image.")
	}

	detectedMime := http.DetectContentType(buf[:n])
	// Also strip charset if present
	if idx := strings.Index(detectedMime, ";"); idx != -1 {
		detectedMime = detectedMime[:idx]
	}
	detectedMime = strings.TrimSpace(strings.ToLower(detectedMime))

	if !allowedMimeTypes[detectedMime] {
		return errors.New("Unsupported image format. Please upload JPG, PNG, WebP, or AVIF.")
	}

	return nil
}

func GenerateSafeFilename(originalName string) string {
	ext := filepath.Ext(originalName)
	base := originalName[:len(originalName)-len(ext)]

	// Prevent path traversal
	base = filepath.Base(base)
	base = strings.ReplaceAll(base, "..", "")
	base = strings.ReplaceAll(base, "/", "")
	base = strings.ReplaceAll(base, "\\", "")
	base = strings.ReplaceAll(base, "\x00", "")

	slugified := slug.Make(base)
	if slugified == "" {
		slugified = "image"
	}

	shortUUID := uuid.New().String()[:8]
	return fmt.Sprintf("%s-%s.webp", slugified, shortUUID)
}

type ProcessedImage struct {
	TempFile *os.File
	Size     int64
	Width    int
	Height   int
}

func ProcessAndOptimizeImage(file multipart.File) (*ProcessedImage, error) {
	// Decode image with auto-orientation and EXIF stripping
	img, err := imaging.Decode(file, imaging.AutoOrientation(true))
	if err != nil {
		return nil, errors.New("The uploaded file is not a valid image.")
	}

	bounds := img.Bounds()
	width := bounds.Dx()
	height := bounds.Dy()

	// Dimension limits check
	if width > 10000 || height > 10000 {
		return nil, errors.New("Image dimensions exceed the allowed limit.")
	}

	// Scale down extremely large images exceeding 2560px width proportionally
	if width > 2560 {
		img = imaging.Resize(img, 2560, 0, imaging.Lanczos)
		width = img.Bounds().Dx()
		height = img.Bounds().Dy()
	}

	// Create temporary file for atomic WebP encoding
	tempFile, err := os.CreateTemp("", "opt-webp-*.tmp")
	if err != nil {
		return nil, errors.New("Unable to process this image. Please try another file.")
	}

	// Encode to optimized WebP format (quality: 82)
	options := &webp.Options{
		Lossless: false,
		Quality:  82,
	}

	var buf bytes.Buffer
	if err := webp.Encode(&buf, img, options); err != nil {
		tempFile.Close()
		os.Remove(tempFile.Name())
		return nil, errors.New("Unable to process this image. Please try another file.")
	}

	n, err := io.Copy(tempFile, &buf)
	if err != nil {
		tempFile.Close()
		os.Remove(tempFile.Name())
		return nil, errors.New("Unable to process this image. Please try another file.")
	}

	if _, err := tempFile.Seek(0, 0); err != nil {
		tempFile.Close()
		os.Remove(tempFile.Name())
		return nil, errors.New("Unable to process this image. Please try another file.")
	}

	return &ProcessedImage{
		TempFile: tempFile,
		Size:     n,
		Width:    width,
		Height:   height,
	}, nil
}
