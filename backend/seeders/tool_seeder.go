package seeders

import (
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
	// Lookup category IDs map by slug
	var categories []models.ToolCategory
	if err := db.Find(&categories).Error; err != nil {
		return err
	}

	categoryMap := make(map[string]uint)
	for _, c := range categories {
		categoryMap[c.Slug] = c.ID
	}

	approvedSlugs := []string{
		"json-formatter",
		"json-validator",
		"json-minifier",
		"jwt-decoder",
		"base64-encoder-decoder",
		"uuid-generator",
		"timestamp-converter",
		"url-encoder-decoder",
		"regex-tester",
		"sql-formatter",
	}

	toolsData := []ToolSeedData{
		{
			Name:             "JSON Formatter",
			Slug:             "json-formatter",
			CategorySlug:     "json",
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
			Name:             "JSON Validator",
			Slug:             "json-validator",
			CategorySlug:     "json",
			ShortDescription: "Validate JSON syntax and identify formatting errors.",
			Description:      "Free online JSON Syntax Validator. Validate JSON payloads against RFC 8259 specs and identify syntax errors with exact line numbers.",
			Icon:             "CheckCircle2",
			Featured:         true,
			Popular:          false,
			IsNew:            false,
			SortOrder:        2,
			Status:           true,
			SeoTitle:         "Free Online JSON Syntax Validator | TechWebCode",
			SeoDescription:   "Validate JSON structure and pinpoint syntax error line numbers online. Free, fast, and 100% client-side.",
		},
		{
			Name:             "JSON Minifier",
			Slug:             "json-minifier",
			CategorySlug:     "json",
			ShortDescription: "Minify JSON by removing unnecessary whitespace.",
			Description:      "Free online JSON Minifier and Payload Compressor. Compress JSON into a single line string to reduce bandwidth and speed up API response times.",
			Icon:             "Minimize2",
			Featured:         false,
			Popular:          false,
			IsNew:            true,
			SortOrder:        3,
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
			SortOrder:        4,
			Status:           true,
			SeoTitle:         "Free Online JWT Decoder & Inspector | TechWebCode",
			SeoDescription:   "Decode JSON Web Tokens (JWT), inspect payload claims, and verify token expiration dates online.",
		},
		{
			Name:             "Base64 Encoder / Decoder",
			Slug:             "base64-encoder-decoder",
			CategorySlug:     "encoding",
			ShortDescription: "Encode and decode Base64 text directly in your browser.",
			Description:      "Free online Base64 Encoder and Decoder with UTF-8 support. Encode and decode text, HTTP authorization headers, and data URLs directly in your browser.",
			Icon:             "ArrowLeftRight",
			Featured:         true,
			Popular:          false,
			IsNew:            false,
			SortOrder:        5,
			Status:           true,
			SeoTitle:         "Free Online Base64 Encoder & Decoder | TechWebCode",
			SeoDescription:   "Encode and decode Base64 strings with UTF-8 support online. Fast, client-side, and free.",
		},
		{
			Name:             "UUID Generator",
			Slug:             "uuid-generator",
			CategorySlug:     "generators",
			ShortDescription: "Generate unique UUID v4 identifiers instantly.",
			Description:      "Free online UUID / GUID v4 Generator. Generate cryptographically secure v4 UUIDs individually or in bulk batches with custom formatting.",
			Icon:             "RefreshCw",
			Featured:         false,
			Popular:          true,
			IsNew:            false,
			SortOrder:        6,
			Status:           true,
			SeoTitle:         "Free Online UUID / GUID v4 Generator | TechWebCode",
			SeoDescription:   "Generate random RFC 4122 v4 UUIDs individually or in bulk online with secure browser randomness.",
		},
		{
			Name:             "Timestamp Converter",
			Slug:             "timestamp-converter",
			CategorySlug:     "date-and-time",
			ShortDescription: "Convert Unix timestamps to readable dates and back.",
			Description:      "Free online Unix Timestamp Converter. Convert Epoch seconds and milliseconds to human-readable dates, ISO 8601 strings, and GMT/UTC.",
			Icon:             "Clock",
			Featured:         true,
			Popular:          false,
			IsNew:            false,
			SortOrder:        7,
			Status:           true,
			SeoTitle:         "Free Online Unix Timestamp Converter | TechWebCode",
			SeoDescription:   "Convert Epoch timestamps to human readable local dates, UTC, and ISO 8601 strings online.",
		},
		{
			Name:             "URL Encoder / Decoder",
			Slug:             "url-encoder-decoder",
			CategorySlug:     "web",
			ShortDescription: "Encode and decode URLs and URL components safely.",
			Description:      "Free online URL Encoder and Decoder. Convert string query parameters into percent-encoded URL format or decode encoded URLs.",
			Icon:             "Link",
			Featured:         true,
			Popular:          false,
			IsNew:            false,
			SortOrder:        8,
			Status:           true,
			SeoTitle:         "Free Online URL Encoder & Decoder | TechWebCode",
			SeoDescription:   "Encode and decode percent-encoded URL query parameters online.",
		},
		{
			Name:             "Regex Tester",
			Slug:             "regex-tester",
			CategorySlug:     "web",
			ShortDescription: "Test regular expressions against text with instant results.",
			Description:      "Free online Regex Pattern Tester. Test JavaScript and PCRE regular expressions with real-time match highlighting and capture group extraction.",
			Icon:             "Code2",
			Featured:         false,
			Popular:          true,
			IsNew:            false,
			SortOrder:        9,
			Status:           true,
			SeoTitle:         "Free Online Regex Pattern Tester | TechWebCode",
			SeoDescription:   "Test regular expressions in real-time with match highlighting and group capture extraction online.",
		},
		{
			Name:             "SQL Formatter",
			Slug:             "sql-formatter",
			CategorySlug:     "database",
			ShortDescription: "Format and beautify SQL queries for better readability.",
			Description:      "Free online SQL Formatter & Query Beautifier. Format raw SQL queries for MySQL, PostgreSQL, SQLite, and SQL Server with capitalized keywords.",
			Icon:             "Database",
			Featured:         false,
			Popular:          false,
			IsNew:            true,
			SortOrder:        10,
			Status:           true,
			SeoTitle:         "Free Online SQL Query Formatter & Beautifier | TechWebCode",
			SeoDescription:   "Format and beautify raw SQL queries with proper clause indentations and capitalized keywords online.",
		},
	}

	// Deactivate any unapproved or legacy tools in the DB safely
	if err := db.Model(&models.Tool{}).Where("slug NOT IN ?", approvedSlugs).Update("status", false).Error; err != nil {
		log.Printf("[Seeder Warning] Failed to deactivate legacy unapproved tools: %v", err)
	}

	for _, item := range toolsData {
		catID, ok := categoryMap[item.CategorySlug]
		if !ok || catID == 0 {
			catID = 1
		}

		var existing models.Tool
		err := db.Where("slug = ?", item.Slug).
			Assign(models.Tool{
				CategoryID:       catID,
				Name:             item.Name,
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
			}).
			FirstOrCreate(&existing, models.Tool{Slug: item.Slug}).Error

		if err != nil {
			log.Printf("[Seeder Error] Failed to seed tool %s: %v", item.Slug, err)
			return err
		}
	}

	log.Println("[Seeder] Successfully seeded exact 10 approved initial developer tools")
	return nil
}
