package utils

import (
	"strings"

	"github.com/gosimple/slug"
)

func GenerateSlug(text string) string {
	return slug.Make(strings.TrimSpace(text))
}
