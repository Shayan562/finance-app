package models

import (
	"gorm.io/datatypes"
)

type TransTypes string

const (
	Expense TransTypes = "Expense"
	Income  TransTypes = "Income"
)

func (t *TransTypes) String() string {
	switch *t {
	case Expense:
		return "Expense"
	case Income:
		return "Income"
	}
	return ""
}

type TimeFrame string

const (
	None    TimeFrame = "None"
	Weekly  TimeFrame = "Weekly"
	Monthly TimeFrame = "Monthly"
	Yearly  TimeFrame = "Yearly"
)

type User struct {
	ID           uint          `gorm:"primaryKey;autoIncrement;" json:"userID"`
	Name         string        `gorm:"notNull" json:"name"`
	Email        string        `gorm:"notNull;uniqueIndex" json:"email"`
	Password     string        `gorm:"notNull" json:"password"`
	Transactions []Transaction `json:"transactions"`
}

type Transaction struct {
	ID        uint           `gorm:"primaryKey;autoIncrement;" json:"transactionID"`
	UserID    uint           `gorm:"notNull;uniqueIndex" json:"UserID"`
	TransType TransTypes     `gorm:"notNull;type:transaction_type;" json:"transactionType"`
	TimeFrame TimeFrame      `gorm:"notNull;type:time_frame;default:'None'" json:"timeFrame"`
	Amount    uint           `gorm:"notNull;" json:"amount"`
	TransDate datatypes.Date `gorm:"notNull;" json:"transactionDate"`
	Note      *string        `json:"note"`
	Tags      []Tag          `gorm:"many2many:transaction_tags;" json:"transactionTags"`
}

type Tag struct {
	ID      uint       `gorm:"notNull;primaryKey" json:"tagID"`
	TagName string     `gorm:"notNull;uniqueIndex:idx_tag_name_type;" json:"tagName"`
	TagType TransTypes `gorm:"notNull;uniqueIndex:idx_tag_name_type;type:transaction_type;" json:"tagType"`
}
