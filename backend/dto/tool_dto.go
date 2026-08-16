package dto

type CreateToolRequest struct {
	CategoryID       uint   `json:"category_id" binding:"required"`
	Name             string `json:"name" binding:"required,min=2,max=150"`
	Slug             string `json:"slug"`
	ShortDescription string `json:"short_description"`
	Description      string `json:"description"`
	Icon             string `json:"icon"`
	Featured         bool   `json:"featured"`
	Popular          bool   `json:"popular"`
	IsNew            bool   `json:"is_new"`
	SortOrder        int    `json:"sort_order"`
	Status           bool   `json:"status"`
	SeoTitle         string `json:"seo_title"`
	SeoDescription   string `json:"seo_description"`
}

type UpdateToolRequest struct {
	CategoryID       uint   `json:"category_id"`
	Name             string `json:"name" binding:"required,min=2,max=150"`
	Slug             string `json:"slug"`
	ShortDescription string `json:"short_description"`
	Description      string `json:"description"`
	Icon             string `json:"icon"`
	Featured         bool   `json:"featured"`
	Popular          bool   `json:"popular"`
	IsNew            bool   `json:"is_new"`
	SortOrder        int    `json:"sort_order"`
	Status           bool   `json:"status"`
	SeoTitle         string `json:"seo_title"`
	SeoDescription   string `json:"seo_description"`
}

type CreateToolCategoryRequest struct {
	Name        string `json:"name" binding:"required,min=2,max=100"`
	Icon        string `json:"icon"`
	Description string `json:"description"`
	SortOrder   int    `json:"sort_order"`
	Status      bool   `json:"status"`
}

type UpdateToolCategoryRequest struct {
	Name        string `json:"name" binding:"required,min=2,max=100"`
	Icon        string `json:"icon"`
	Description string `json:"description"`
	SortOrder   int    `json:"sort_order"`
	Status      bool   `json:"status"`
}
