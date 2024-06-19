package models

import (
	"gorm.io/datatypes"
)

type User struct {
	ID           uint          `gorm:"primaryKey;autoIncrement;" json:"userID"`
	Name         string        `gorm:"notNull" json:"name"`
	Email        string        `gorm:"notNull;uniqueIndex" json:"email"`
	Password     string        `gorm:"notNull" json:"password"`
	Transactions []Transaction `json:"transactions"`
}

//	func (User) TableName() string {
//		return "users"
//	}
type TransTypes int

const (
	Expense TransTypes = iota
	Income
)

type TimeFrame int

const (
	None TimeFrame = iota
	Weekly
	Monthly
	Yearly
)

type Transaction struct {
	ID        uint           `gorm:"primaryKey;autoIncrement;" json:"transactionID"`
	UserID    uint           `gorm:"notNull;uniqueIndex" json:"UserID"`
	TransType TransTypes     `gorm:"notNull;" json:"transactionType"`
	TimeFrame TimeFrame      `gorm:"notNull;default:0;" json:"timeFrame"`
	Amount    uint           `gorm:"notNull;" json:"amount"`
	TransDate datatypes.Date `gorm:"notNull;" json:"transactionDate"`
	Note      *string        `json:"note"`
	Tags      []Tag          `gorm:"many2many:transaction_tags;" json:"transactionTags"`
}

type Tag struct {
	ID      uint       `gorm:"notNull;" json:"tagID"`
	TagName string     `gorm:"notNull;uniqueIndex" json:"tagName"`
	TagType TransTypes `gorm:"notNull;" json:"tagType"`
}
