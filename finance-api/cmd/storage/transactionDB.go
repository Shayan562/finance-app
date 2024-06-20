package storage

import (
	"errors"
	"finance-app/cmd/models"
)

func NewTransaction(transactionObj *models.Transaction) error {
	if db == nil {
		return errors.New("could not connect to the db")
	}
	err := db.Create(&transactionObj).Error
	return err
}
func GetAllTransactionsWithUserID(userID uint) (*[]models.Transaction, error) {
	if db == nil {
		return nil, errors.New("could not connect to the db")
	}
	transactions := []models.Transaction{}
	err := db.Preload("Tags").Where("user_id=?", userID).Find(&transactions).Error

	if err != nil {
		return nil, err
	}
	return &transactions, nil
}
