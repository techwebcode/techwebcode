package utils

import (
	"bytes"

	"github.com/yuin/goldmark"
)

func MarkdownToHTML(markdown string) (string, error) {

	var buf bytes.Buffer

	err := goldmark.Convert(
		[]byte(markdown),
		&buf,
	)

	if err != nil {
		return "", err
	}

	return buf.String(), nil
}
