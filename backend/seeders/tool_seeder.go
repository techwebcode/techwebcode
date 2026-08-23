package seeders

import (
	"errors"
	"log"

	"github.com/techwebcode/techwebcode/backend/models"
	"gorm.io/gorm"
)

type ToolSeedData struct {
	Name             string
	Slug             string
	CategorySlug     string
	ShortDescription string
	Description      string
	Icon             string
	Featured         bool
	Popular          bool
	IsNew            bool
	SortOrder        int
	Status           bool
	SeoTitle         string
	SeoDescription   string
}

func SeedTools(db *gorm.DB) error {
	// Fetch tool categories mapping by slug
	var categories []models.ToolCategory
	if err := db.Find(&categories).Error; err != nil {
		log.Printf("[Seeder Error] Failed to fetch tool categories: %v", err)
		return err
	}

	categoryMap := make(map[string]uint)
	for _, c := range categories {
		categoryMap[c.Slug] = c.ID
	}

	// Complete list of built-in TechWebCode tools
	toolsData := []ToolSeedData{
		{
			Name:             "JSON Formatter",
			Slug:             "json-formatter",
			CategorySlug:     "json-and-data",
			ShortDescription: "Format, beautify, and inspect JSON data instantly.",
			Description:      "Free online JSON Formatter and Beautifier. Format, validate, and inspect JSON structure instantly in your browser with 100% client-side data privacy.",
			Icon:             "FileCode",
			Featured:         true,
			Popular:          true,
			IsNew:            false,
			SortOrder:        1,
			Status:           true,
			SeoTitle:         "Free Online JSON Formatter & Beautifier | TechWebCode",
			SeoDescription:   "Format, beautify, and validate JSON data online with Monaco editor. Free, fast, and privacy-first browser tool.",
		},
		{
			Name:             "YAML Formatter & Kubernetes Secret Tool",
			Slug:             "yaml-formatter",
			CategorySlug:     "yaml-and-kubernetes",
			ShortDescription: "Format and validate YAML files, and encode or decode Kubernetes Secret values online.",
			Description:      "Free online YAML Formatter & Kubernetes Secret Tool. Format and validate YAML files, and encode or decode Kubernetes Secret values online with 100% client-side data privacy.",
			Icon:             "FileText",
			Featured:         true,
			Popular:          true,
			IsNew:            true,
			SortOrder:        3,
			Status:           true,
			SeoTitle:         "YAML Formatter & Kubernetes Secret Tool | TechWebCode",
			SeoDescription:   "Format and validate YAML files, and encode or decode Kubernetes Secret values online. Free, fast, and privacy-first browser tool.",
		},
		{
			Name:             "JSON Validator",
			Slug:             "json-validator",
			CategorySlug:     "json-and-data",
			ShortDescription: "Validate JSON syntax and identify formatting errors.",
			Description:      "Free online JSON Syntax Validator. Validate JSON payloads against RFC 8259 specs and identify syntax errors with exact line numbers.",
			Icon:             "CheckCircle2",
			Featured:         true,
			Popular:          false,
			IsNew:            false,
			SortOrder:        5,
			Status:           true,
			SeoTitle:         "Free Online JSON Syntax Validator | TechWebCode",
			SeoDescription:   "Validate JSON structure and pinpoint syntax error line numbers online. Free, fast, and 100% client-side.",
		},
		{
			Name:             "JSON Minifier",
			Slug:             "json-minifier",
			CategorySlug:     "json-and-data",
			ShortDescription: "Minify JSON by removing unnecessary whitespace.",
			Description:      "Free online JSON Minifier and Payload Compressor. Compress JSON into a single line string to reduce bandwidth and speed up API response times.",
			Icon:             "Minimize2",
			Featured:         false,
			Popular:          false,
			IsNew:            true,
			SortOrder:        6,
			Status:           true,
			SeoTitle:         "Free Online JSON Minifier & Payload Compressor | TechWebCode",
			SeoDescription:   "Minify and compress JSON payloads online. Strip whitespace and view payload size compression metrics.",
		},
		{
			Name:             "JWT Decoder",
			Slug:             "jwt-decoder",
			CategorySlug:     "security",
			ShortDescription: "Decode and inspect JWT headers and payloads locally.",
			Description:      "Free online JWT Decoder & Inspector. Inspect JSON Web Token headers, payload claims, and token expiration status client-side in your browser.",
			Icon:             "Key",
			Featured:         true,
			Popular:          false,
			IsNew:            false,
			SortOrder:        7,
			Status:           true,
			SeoTitle:         "Free Online JWT Decoder & Inspector | TechWebCode",
			SeoDescription:   "Decode JSON Web Tokens (JWT), inspect payload claims, and verify token expiration dates online.",
		},
		{
			Name:             "Base64 Encoder / Decoder",
			Slug:             "base64",
			CategorySlug:     "text-and-encoding",
			ShortDescription: "Encode and decode Base64 text directly in your browser.",
			Description:      "Free online Base64 Encoder and Decoder with UTF-8 support. Encode and decode text, HTTP authorization headers, and data URLs directly in your browser.",
			Icon:             "ArrowLeftRight",
			Featured:         true,
			Popular:          false,
			IsNew:            false,
			SortOrder:        9,
			Status:           true,
			SeoTitle:         "Free Online Base64 Encoder & Decoder | TechWebCode",
			SeoDescription:   "Encode and decode Base64 strings with UTF-8 support online. Fast, client-side, and free.",
		},
		{
			Name:             "UUID / GUID Generator",
			Slug:             "uuid-generator",
			CategorySlug:     "generators",
			ShortDescription: "Generate unique UUID v4 identifiers instantly.",
			Description:      "Free online UUID / GUID v4 Generator. Generate cryptographically secure v4 UUIDs individually or in bulk batches with custom formatting.",
			Icon:             "RefreshCw",
			Featured:         false,
			Popular:          true,
			IsNew:            false,
			SortOrder:        10,
			Status:           true,
			SeoTitle:         "Free Online UUID / GUID v4 Generator | TechWebCode",
			SeoDescription:   "Generate random RFC 4122 v4 UUIDs individually or in bulk online with secure browser randomness.",
		},
		{
			Name:             "Unix Timestamp Converter",
			Slug:             "timestamp-converter",
			CategorySlug:     "date-and-time",
			ShortDescription: "Convert Unix timestamps to readable dates and back.",
			Description:      "Free online Unix Timestamp Converter. Convert Epoch seconds and milliseconds to human-readable dates, ISO 8601 strings, and GMT/UTC.",
			Icon:             "Clock",
			Featured:         true,
			Popular:          false,
			IsNew:            false,
			SortOrder:        11,
			Status:           true,
			SeoTitle:         "Free Online Unix Timestamp Converter | TechWebCode",
			SeoDescription:   "Convert Epoch timestamps to human readable local dates, UTC, and ISO 8601 strings online.",
		},
		{
			Name:             "URL Encoder / Decoder",
			Slug:             "url-encoder",
			CategorySlug:     "text-and-encoding",
			ShortDescription: "Percent-encode and decode URL query parameters.",
			Description:      "Free online URL Percent Encoder and Decoder. Safely encode special characters for query strings or parse percent-encoded URL parameters.",
			Icon:             "Link",
			Featured:         false,
			Popular:          false,
			IsNew:            false,
			SortOrder:        13,
			Status:           true,
			SeoTitle:         "Free Online URL Encoder & Decoder | TechWebCode",
			SeoDescription:   "Percent-encode special characters in URLs or decode URL parameters online.",
		},
		{
			Name:             "Regex Tester & Explainer",
			Slug:             "regex-tester",
			CategorySlug:     "regex-and-sql",
			ShortDescription: "Test regular expressions with real-time match highlighting and breakdown.",
			Description:      "Free online Regex Tester & Explainer. Test Regular Expressions against text in real-time with syntax highlighting, group extraction, and automated plain English explanations.",
			Icon:             "Code2",
			Featured:         true,
			Popular:          true,
			IsNew:            false,
			SortOrder:        14,
			Status:           true,
			SeoTitle:         "Free Online Regex Tester & Explainer | TechWebCode",
			SeoDescription:   "Test regular expressions with real-time match highlighting, regex cheat sheet, capture group extraction, and plain English explanation.",
		},
		{
			Name:             "SQL Query Formatter",
			Slug:             "sql-formatter",
			CategorySlug:     "regex-and-sql",
			ShortDescription: "Format and beautify raw SQL queries across dialects.",
			Description:      "Free online SQL Query Formatter and Beautifier. Format messy SQL queries, convert keyword casing, and clean up database scripts for MySQL, PostgreSQL, SQLite, and Transact-SQL.",
			Icon:             "Database",
			Featured:         false,
			Popular:          true,
			IsNew:            false,
			SortOrder:        15,
			Status:           true,
			SeoTitle:         "Free Online SQL Query Formatter & Beautifier | TechWebCode",
			SeoDescription:   "Format and beautify SQL queries across MySQL, PostgreSQL, SQLite, and T-SQL online. Indent, format keywords, and clean up database scripts.",
		},
		{
			Name:             "Deployment Config Doctor",
			Slug:             "deployment-config-doctor",
			CategorySlug:     "api-and-devops",
			ShortDescription: "Diagnose Docker, Kubernetes, and deployment configuration issues.",
			Description:      "Analyze Docker, Kubernetes, environment, Nginx, Next.js and CI/CD configuration for deployment errors, security issues and cross-file mismatches client-side in your browser.",
			Icon:             "ShieldCheck",
			Featured:         true,
			Popular:          true,
			IsNew:            true,
			SortOrder:        16,
			Status:           true,
			SeoTitle:         "Deployment Config Doctor — Docker, Kubernetes & Environment Checker | TechWebCode",
			SeoDescription:   "Analyze Docker, Kubernetes, environment, Nginx, Next.js and CI/CD configuration for deployment errors, security issues and cross-file mismatches.",
		},
		{
			Name:             "API Contract & Response Compatibility Checker",
			Slug:             "api-contract-checker",
			CategorySlug:     "api-and-devops",
			ShortDescription: "Compare API response payloads for breaking changes, field removals, and type mismatches.",
			Description:      "Compare API responses and detect breaking changes, type mismatches, removed fields, and structural payload alterations client-side in your browser.",
			Icon:             "ArrowRightLeft",
			Featured:         true,
			Popular:          true,
			IsNew:            true,
			SortOrder:        17,
			Status:           true,
			SeoTitle:         "API Contract & Response Compatibility Checker | TechWebCode",
			SeoDescription:   "Compare API responses and detect breaking changes, type mismatches, removed fields, and structural payload alterations client-side in your browser.",
		},
		{
			Name:             "Code Difference Checker",
			Slug:             "code-diff-checker",
			CategorySlug:     "json-and-data",
			ShortDescription: "Compare two versions of code side-by-side or unified to spot additions, deletions, and modifications.",
			Description:      "Compare two versions of code side-by-side or unified online with TechWebCode's Code Difference Checker. Instantly highlight added, removed, and modified lines with 100% client-side browser privacy.",
			Icon:             "FileCode",
			Featured:         true,
			Popular:          true,
			IsNew:            true,
			SortOrder:        18,
			Status:           true,
			SeoTitle:         "Code Difference Checker — Side-by-Side Code Diff Online | TechWebCode",
			SeoDescription:   "Compare two versions of code online with TechWebCode's Code Difference Checker. Side-by-side view, git-style unified diff, word-level diff, change navigation, and 100% client-side privacy.",
		},
	}

	// Verify no duplicate slugs exist in seed data array
	seenSlugs := make(map[string]bool)
	for _, item := range toolsData {
		if seenSlugs[item.Slug] {
			return errors.New("duplicate slug in tool seed data: " + item.Slug)
		}
		seenSlugs[item.Slug] = true
	}

	createdCount := 0
	existingCount := 0

	// Idempotently insert missing built-in tools inside a database transaction
	err := db.Transaction(func(tx *gorm.DB) error {
		for _, item := range toolsData {
			var count int64
			if err := tx.Model(&models.Tool{}).Where("slug = ?", item.Slug).Count(&count).Error; err != nil {
				log.Printf("[Seeder Error] Failed to query tool slug %s: %v", item.Slug, err)
				return err
			}

			if count > 0 {
				// Record already exists; do not overwrite user or admin modifications
				existingCount++
				continue
			}

			// Tool does not exist; insert new built-in tool record
			catID, ok := categoryMap[item.CategorySlug]
			if !ok || catID == 0 {
				catID = 1
			}

			newTool := models.Tool{
				CategoryID:       catID,
				Name:             item.Name,
				Slug:             item.Slug,
				ShortDescription: item.ShortDescription,
				Description:      item.Description,
				Icon:             item.Icon,
				Featured:         item.Featured,
				Popular:          item.Popular,
				IsNew:            item.IsNew,
				SortOrder:        item.SortOrder,
				Status:           item.Status,
				SeoTitle:         item.SeoTitle,
				SeoDescription:   item.SeoDescription,
			}

			if err := tx.Create(&newTool).Error; err != nil {
				log.Printf("[Seeder Error] Failed to create tool %s: %v", item.Slug, err)
				return err
			}
			createdCount++
		}
		return nil
	})

	if err != nil {
		return err
	}

	log.Printf("[Seeder] Tools Seeding Completed | Created: %d | Existing: %d", createdCount, existingCount)
	return nil
}
