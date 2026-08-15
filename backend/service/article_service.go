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
	toolRepo     *repository.ToolRepository
}

func NewArticleService(
	articleRepo *repository.ArticleRepository,
	categoryRepo *repository.CategoryRepository,
	toolRepo *repository.ToolRepository,
) *ArticleService {

	return &ArticleService{
		articleRepo:  articleRepo,
		categoryRepo: categoryRepo,
		toolRepo:     toolRepo,
	}
}

func (s *ArticleService) Create(req *dto.CreateArticleRequest) (*models.Article, error) {

	// Check category exists
	_, err := s.categoryRepo.FindByID(req.CategoryID)

	if err != nil {
		return nil, errors.New("category not found")
	}

	// Validate primary tool if provided
	if req.PrimaryToolID != nil && *req.PrimaryToolID > 0 {
		_, err := s.toolRepo.FindByID(*req.PrimaryToolID)
		if err != nil {
			return nil, errors.New("selected primary tool not found")
		}
	}

	// Slug resolution & sanitization
	slugToUse := strings.TrimSpace(req.Slug)
	if slugToUse == "" {
		slugToUse = utils.GenerateSlug(req.Title)
	} else {
		slugToUse = utils.GenerateSlug(slugToUse)
	}

	if slugToUse == "" {
		return nil, errors.New("slug is required")
	}

	// Check if slug already exists in DB
	existing, _ := s.articleRepo.GetBySlug(slugToUse)
	if existing != nil && existing.ID != 0 {
		return nil, errors.New("slug already exists")
	}

	html, err := utils.MarkdownToHTML(req.ContentMarkdown)

	if err != nil {
		return nil, err
	}

	article := &models.Article{

		CategoryID: req.CategoryID,

		PrimaryToolID: req.PrimaryToolID,

		Title: strings.TrimSpace(req.Title),

		Slug: slugToUse,

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
		if strings.Contains(strings.ToLower(err.Error()), "duplicate") || strings.Contains(strings.ToLower(err.Error()), "unique") {
			return nil, errors.New("slug already exists")
		}
		return nil, err
	}

	return article, nil
}

func (s *ArticleService) Update(id uint, req *dto.UpdateArticleRequest) (*models.Article, error) {
	article, err := s.articleRepo.GetByID(id)
	if err != nil {
		return nil, errors.New("article not found")
	}

	if req.CategoryID > 0 {
		_, err := s.categoryRepo.FindByID(req.CategoryID)
		if err != nil {
			return nil, errors.New("category not found")
		}
		article.CategoryID = req.CategoryID
	}

	if req.Slug != "" {
		newSlug := utils.GenerateSlug(req.Slug)
		if newSlug != article.Slug {
			existing, _ := s.articleRepo.GetBySlug(newSlug)
			if existing != nil && existing.ID != article.ID {
				return nil, errors.New("slug already exists")
			}
			article.Slug = newSlug
		}
	}

	if req.Title != "" {
		article.Title = strings.TrimSpace(req.Title)
	}

	if req.ContentMarkdown != "" {
		article.ContentMarkdown = req.ContentMarkdown
		html, err := utils.MarkdownToHTML(req.ContentMarkdown)
		if err == nil {
			article.ContentHTML = html
		}
		article.ReadingTime = calculateReadingTime(req.ContentMarkdown)
	}

	article.Excerpt = req.Excerpt
	article.FeaturedImage = req.FeaturedImage
	article.SeoTitle = req.SeoTitle
	article.SeoDescription = req.SeoDescription
	article.CanonicalURL = req.CanonicalURL
	article.IsFeatured = req.IsFeatured

	if req.PrimaryToolID != nil {
		if *req.PrimaryToolID > 0 {
			_, err := s.toolRepo.FindByID(*req.PrimaryToolID)
			if err != nil {
				return nil, errors.New("selected primary tool not found")
			}
			article.PrimaryToolID = req.PrimaryToolID
		} else {
			article.PrimaryToolID = nil
			article.PrimaryTool = nil
		}
	}

	// Status transition rules
	if req.Status != "" {
		oldStatus := article.Status
		newStatus := req.Status

		if newStatus == "published" {
			if oldStatus != "published" || article.PublishedAt == nil {
				now := time.Now()
				article.PublishedAt = &now
			}
			article.Status = "published"
		} else if newStatus == "draft" {
			article.Status = "draft"
			article.PublishedAt = nil
		}
	}

	err = s.articleRepo.Update(article)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "duplicate") || strings.Contains(strings.ToLower(err.Error()), "unique") {
			return nil, errors.New("slug already exists")
		}
		return nil, err
	}

	if article.PrimaryToolID != nil && *article.PrimaryToolID > 0 {
		tool, _ := s.toolRepo.FindByID(*article.PrimaryToolID)
		article.PrimaryTool = tool
	} else {
		article.PrimaryTool = nil
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
	statusFilter string,
) ([]models.Article, int64, error) {

	return s.articleRepo.GetAll(
		page,
		limit,
		search,
		categoryID,
		statusFilter,
	)
}

func (s *ArticleService) GetFeatured(limit int) ([]models.Article, error) {
	if limit <= 0 {
		limit = 5
	}
	return s.articleRepo.GetFeatured(limit)
}

func (s *ArticleService) GetTrending(limit int) ([]models.Article, error) {
	if limit <= 0 {
		limit = 5
	}
	return s.articleRepo.GetTrending(limit)
}

func (s *ArticleService) GetBySlug(slug string) (*models.Article, error) {

	return s.articleRepo.GetBySlug(slug)
}

func (s *ArticleService) GetPublishedBySlug(slug string) (*models.Article, error) {

	return s.articleRepo.GetPublishedBySlug(slug)
}

func (s *ArticleService) Delete(id uint) error {

	return s.articleRepo.Delete(id)
}
