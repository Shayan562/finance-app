package storage

import (
	"finance-app/cmd/models"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func ConnectToDB() {
	//init environment variables
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbSSLMode := os.Getenv("DB_SSLMODE")

	//db connection
	dsn := fmt.Sprintf("user=%v password=%v dbname=%v host=%v port=%v sslmode=%v", dbUser, dbPass, dbName, dbHost, dbPort, dbSSLMode)
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic(err.Error())
	}

	instance, err := db.DB()
	if err != nil {
		log.Fatal("Couldnt configure db")
	}
	instance.SetConnMaxIdleTime(time.Minute * 5)
	instance.SetMaxIdleConns(1)
	// instance.SetMaxOpenConns(50)

	fmt.Println("Successfully Connected to Database")
}

func GetDB() *gorm.DB {
	return db
}

func CloseConnection() {
	instance, _ := db.DB()
	instance.Close()
}

func Migrate() {
	db.AutoMigrate(&models.User{}, &models.Transaction{}, &models.Tag{})
}
