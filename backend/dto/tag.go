package dto

type CreateTagRequest struct {
	Name        string `json:"name" binding:"required,min=2,max=100"`
	Description string `json:"description"`
	Status      bool   `json:"status"`
	SortOrder   int    `json:"sort_order"`
}

type UpdateTagRequest struct {
	Name        string `json:"name" binding:"required,min=2,max=100"`
	Description string `json:"description"`
	Status      bool   `json:"status"`
	SortOrder   int    `json:"sort_order"`
}
