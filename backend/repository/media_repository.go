package repository

import (
	"github.com/techwebcode/techwebcode/backend/database"
	"github.com/techwebcode/techwebcode/backend/models"
)

type MediaRepository struct {
	*BaseRepository[models.Media]
}

func NewMediaRepository() *MediaRepository {

	return &MediaRepository{

		BaseRepository: NewBaseRepository[models.Media](database.DB),
	}
}
