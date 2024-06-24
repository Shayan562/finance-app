package storage

import (
	"errors"
	"finance-app/cmd/models"

	"gorm.io/datatypes"
)

func NewTransaction(transactionObj *models.Transaction) error {
	if db == nil {
		return errors.New("could not connect to the db")
	}
	err := db.Create(&transactionObj).Error
	return err
}
func DeleteTransaction(transID uint) error {
	if db == nil {
		return errors.New("could not connect to the db")
	}
	err := db.Delete(&models.Transaction{}, transID).Error
	return err
}
func GetAllTransactionsWithUserID(userID uint) ([]models.Transaction, error) {
	if db == nil {
		return nil, errors.New("could not connect to the db")
	}
	transactions := []models.Transaction{}
	err := db.Preload("Tags").Where("user_id=?", userID).Find(&transactions).Error

	if err != nil {
		return nil, err
	}
	return transactions, nil
}
func GetTransactionWithTransID(transID uint) (*models.Transaction, error) {
	if db == nil {
		return nil, errors.New("could not connect to the db")
	}
	transactions := models.Transaction{}
	err := db.Find(&transactions, transID).Error
	if err != nil {
		return nil, err
	}
	return &transactions, nil
}
func UpdateTransaction(transObj models.Transaction) error {
	if db == nil {
		return errors.New("could not connect to the db")
	}
	db.Save(transObj)
	return nil
}
func GetTransactionWithDate(userID uint, dateObj datatypes.Date) ([]models.Transaction, error) {
	if db == nil {
		return nil, errors.New("could not connect to the db")
	}
	transactions := []models.Transaction{}
	err := db.Preload("Tags").Where("trans_date=? and user_id=?", dateObj, userID).Find(&transactions).Error
	if err != nil {
		return nil, err
	}
	return transactions, err
}
func GetTransactionsWithFilters(conditionString string, arguments []any) ([]models.Transaction, error) {
	if db == nil {
		return nil, errors.New("could not connect to the db")
	}
	transactions := []models.Transaction{}
	err := db.Preload("Tags").Where(conditionString, arguments...).Find(&transactions).Error
	if err != nil {
		return nil, err
	}
	return transactions, err
}
