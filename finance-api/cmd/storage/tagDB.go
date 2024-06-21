package storage

import (
	"errors"
	"finance-app/cmd/models"
)

func GetTags() ([]models.Tag, error) {
	tags := []models.Tag{}
	if db == nil {
		return nil, errors.New("could not connect to the db")
	}
	err := db.Find(&tags).Error
	if err != nil {
		return nil, err
	}
	return tags, nil
}
func GetTagsWithIDs(tagIDs []uint) ([]models.Tag, error) {
	tags := []models.Tag{}
	if db == nil {
		return nil, errors.New("could not connect to the db")
	}
	err := db.Find(&tags, tagIDs).Error
	if err != nil {
		return nil, err
	}
	return tags, nil
}

func GetTagsWithType(tagType string) (*[]models.Tag, error) {
	tags := []models.Tag{}
	if db == nil {
		return nil, errors.New("could not connect to the db")
	}
	err := db.Where("tag_type=?", tagType).Find(&tags).Error
	if err != nil {
		return nil, err
	}
	return &tags, nil
}

func InsertTag(tagObj *models.Tag) error {
	if db == nil {
		return errors.New("could not connect to the db")
	}
	err := db.Create(&tagObj).Error
	return err
}
