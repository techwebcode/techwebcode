package service

import (
	"errors"
	"strings"
	"time"

	"github.com/techwebcode/techwebcode/backend/dto"
	"github.com/techwebcode/techwebcode/backend/models"
	"github.com/techwebcode/techwebcode/backend/repository"
	"github.com/techwebcode/techwebcode/backend/utils"
)

type ArticleService struct {
	articleRepo  *repository.ArticleRepository
	categoryRepo *repository.CategoryRepository
}

func NewArticleService(
	articleRepo *repository.ArticleRepository,
	categoryRepo *repository.CategoryRepository,
) *ArticleService {

	return &ArticleService{
		articleRepo:  articleRepo,
		categoryRepo: categoryRepo,
	}
}

func (s *ArticleService) Create(req *dto.CreateArticleRequest) (*models.Article, error) {

	// Check category exists
	_, err := s.categoryRepo.FindByID(req.CategoryID)

	if err != nil {
		return nil, errors.New("category not found")
	}

	html, err := utils.MarkdownToHTML(req.ContentMarkdown)

	if err != nil {
		return nil, err
	}

	article := &models.Article{

		CategoryID: req.CategoryID,

		Title: strings.TrimSpace(req.Title),

		Slug: utils.GenerateSlug(req.Title),

		Excerpt: req.Excerpt,

		ContentMarkdown: req.ContentMarkdown,

		ContentHTML: html,

		FeaturedImage: req.FeaturedImage,

		SeoTitle: req.SeoTitle,

		SeoDescription: req.SeoDescription,

		CanonicalURL: req.CanonicalURL,

		IsFeatured: req.IsFeatured,

		Status: req.Status,
	}

	// Default status
	if article.Status == "" {
		article.Status = "draft"
	}

	// Reading Time
	article.ReadingTime = calculateReadingTime(article.ContentMarkdown)

	// Published Time
	if article.Status == "published" {
		now := time.Now()
		article.PublishedAt = &now
	}

	err = s.articleRepo.Create(article)

	if err != nil {
		return nil, err
	}

	return article, nil
}

func calculateReadingTime(content string) int {

	words := len(strings.Fields(content))

	minutes := words / 200

	if minutes < 1 {
		return 1
	}

	return minutes
}

func (s *ArticleService) GetAll(
	page,
	limit int,
	search string,
	categoryID uint,
) ([]models.Article, int64, error) {

	return s.articleRepo.GetAll(
		page,
		limit,
		search,
		categoryID,
	)
}

func (s *ArticleService) GetBySlug(slug string) (*models.Article, error) {

	return s.articleRepo.GetBySlug(slug)
}

func (s *ArticleService) Delete(id uint) error {

	return s.articleRepo.Delete(id)
}
