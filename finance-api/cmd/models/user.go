package models

type User struct {
	Id       int    `json:"id" gorm:"column:id;primaryKey"`
	Name     string `json:"name" gorm:"column:name"`
	Email    string `json:"email" gorm:"column:email;uniqueIndex"`
	Password string `json:"password" gorm:"column:password"`
}

func (User) TableName() string {
	return "users"
}

type Transaction struct {
}
