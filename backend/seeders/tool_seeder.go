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

	toolsData := []ToolSeedData{
		{
			Name:             "JSON Formatter",
			Slug:             "json-formatter",
			CategorySlug:     "json",
			ShortDescription: "Format, beautify, and inspect JSON payloads with 2, 4, or 8 space indentations.",
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
			ShortDescription: "Validate JSON syntax against RFC 8259 specifications and pinpoint parse error locations.",
			Description:      "Free online JSON Syntax Validator. Validate JSON payloads and identify syntax errors with line numbers and character positions.",
			Icon:             "CheckCircle2",
			Featured:         true,
			Popular:          true,
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
			ShortDescription: "Compress and minify JSON payloads by stripping whitespace and newlines for API optimization.",
			Description:      "Free online JSON Minifier and Compressor. Compress JSON into a single line string to reduce bandwidth and speed up API response times.",
			Icon:             "Minimize2",
			Featured:         true,
			Popular:          true,
			IsNew:            false,
			SortOrder:        3,
			Status:           true,
			SeoTitle:         "Free Online JSON Minifier & Payload Compressor | TechWebCode",
			SeoDescription:   "Minify and compress JSON payloads online. Strip whitespace and view payload size compression metrics.",
		},
		{
			Name:             "JWT Decoder",
			Slug:             "jwt-decoder",
			CategorySlug:     "security",
			ShortDescription: "Decode Base64 JSON Web Tokens (JWT) to inspect Header, Payload claims, and expiration date.",
			Description:      "Free online JWT Decoder & Inspector. Inspect JSON Web Token headers, payload claims, and token expiration status client-side in your browser.",
			Icon:             "Key",
			Featured:         true,
			Popular:          true,
			IsNew:            true,
			SortOrder:        4,
			Status:           true,
			SeoTitle:         "Free Online JWT Decoder & Inspector | TechWebCode",
			SeoDescription:   "Decode JSON Web Tokens (JWT), inspect payload claims, and verify token expiration dates online.",
		},
		{
			Name:             "Base64 Encoder / Decoder",
			Slug:             "base64-encoder-decoder",
			CategorySlug:     "encoding",
			ShortDescription: "Encode text strings into Base64 format or decode Base64 back to plain UTF-8 text.",
			Description:      "Free online Base64 Encoder and Decoder with UTF-8 support. Encode and decode text, HTTP authorization headers, and data URLs.",
			Icon:             "ArrowLeftRight",
			Featured:         true,
			Popular:          true,
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
			ShortDescription: "Generate cryptographically secure RFC 4122 Version 4 UUIDs (GUIDs) individually or in bulk.",
			Description:      "Free online UUID / GUID v4 Generator. Generate cryptographically secure v4 UUIDs individually or in bulk batches with custom formatting.",
			Icon:             "RefreshCw",
			Featured:         true,
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
			ShortDescription: "Convert Unix Epoch timestamps (seconds & milliseconds) to readable local dates, UTC, and ISO 8601 strings.",
			Description:      "Free online Unix Timestamp Converter. Convert Epoch seconds and milliseconds to human-readable dates, ISO 8601 strings, and GMT/UTC.",
			Icon:             "Clock",
			Featured:         true,
			Popular:          true,
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
			ShortDescription: "Encode query parameters into percent-encoded URL format, or decode percent-encoded strings.",
			Description:      "Free online URL Encoder and Decoder. Convert string query parameters into percent-encoded URL format or decode encoded URLs.",
			Icon:             "Link",
			Featured:         false,
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
			ShortDescription: "Test regular expression patterns in real-time with match highlighting and group extraction.",
			Description:      "Free online Regex Pattern Tester. Test JavaScript and PCRE regular expressions with real-time match highlighting and capture group extraction.",
			Icon:             "Code2",
			Featured:         true,
			Popular:          true,
			IsNew:            true,
			SortOrder:        9,
			Status:           true,
			SeoTitle:         "Free Online Regex Pattern Tester | TechWebCode",
			SeoDescription:   "Test regular expressions in real-time with match highlighting and group capture extraction online.",
		},
		{
			Name:             "SQL Formatter",
			Slug:             "sql-formatter",
			CategorySlug:     "database",
			ShortDescription: "Beautify and format complex SQL queries with proper clause indentations and capitalized keywords.",
			Description:      "Free online SQL Formatter & Query Beautifier. Format raw SQL queries for MySQL, PostgreSQL, SQLite, and SQL Server.",
			Icon:             "Database",
			Featured:         true,
			Popular:          true,
			IsNew:            false,
			SortOrder:        10,
			Status:           true,
			SeoTitle:         "Free Online SQL Query Formatter & Beautifier | TechWebCode",
			SeoDescription:   "Format and beautify raw SQL queries with proper clause indentations and capitalized keywords online.",
		},
	}

	for _, item := range toolsData {
		catID, ok := categoryMap[item.CategorySlug]
		if !ok || catID == 0 {
			// Fallback to Category 1 if category slug not found
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

	log.Println("[Seeder] Successfully seeded initial developer tools")
	return nil
}
