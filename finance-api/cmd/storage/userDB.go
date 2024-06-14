package storage

import (
	"errors"
	"finance-app/cmd/models"
)

func GetUserWithEmail(userEmail string) (*models.User, error) {
	var user models.User
	//db error
	if db == nil {
		return nil, errors.New("could not connect to the db")
	}
	//running query
	err := db.Where("email = ?", userEmail).First(&user).Error
	//query error of some kinnd
	if err != nil && err.Error() != "record not found" {
		return nil, err
	}
	//user doesnot exist
	if user.Id == 0 {
		return nil, nil
	}
	return &user, nil
}
func GetUserWithID(userID int) (*models.User, error) {
	var user models.User
	//db error
	if db == nil {
		return nil, errors.New("could not connect to the db")
	}
	//running query
	err := db.Where("id = ?", userID).First(&user).Error
	//query error of some kinnd
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func GetUserOldPasswordWithID(userID int) (string, error) {
	var user models.User
	if db == nil {
		return "", errors.New("could not connect to the db")
	}
	//query
	err := db.Model(&models.User{}).Where("id =?", userID).Select("password").Find(&user).Error
	if err != nil {
		return "", err
	}
	return user.Password, nil
}

func IsEmailInUse(userEmail string) (bool, error) {
	var count int64
	//db error
	if db == nil {
		return false, errors.New("could not connect to the db")
	}
	//find the count of email in db. should be 0 or 1
	err := db.Model(&models.User{}).Where("email = ?", userEmail).Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func InsertUser(userObj models.User) error {
	//db error
	if db == nil {
		return errors.New("could not connect to the db")
	}
	err := db.Create(&userObj).Error
	return err
}
func UpdatePasswordWithID(userID int, newPassword string) error {
	//db error
	if db == nil {
		return errors.New("could not connect to the db")
	}
	err := db.Model(&models.User{}).Where("id = ?", userID).Update("password", newPassword).Error
	return err
}
func UpdatePasswordWithEmail(userEmail string, newPassword string) error {
	if db == nil {
		return errors.New("could not connect to the db")
	}
	err := db.Model(&models.User{}).Where("email=?", userEmail).Update("password", newPassword).Error
	return err
}
