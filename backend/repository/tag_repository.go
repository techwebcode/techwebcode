package repository

import (
	"github.com/techwebcode/techwebcode/backend/database"
	"github.com/techwebcode/techwebcode/backend/models"
)

type TagRepository struct {
	*BaseRepository[models.Tag]
}

func NewTagRepository() *TagRepository {

	return &TagRepository{

		BaseRepository: NewBaseRepository[models.Tag](database.DB),
	}
}
