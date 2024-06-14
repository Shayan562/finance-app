package storage

import (
	"fmt"
	"log"
	"os"

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

	fmt.Println("Successfully Connected to Database")
}

func GetDB() *gorm.DB {
	return db
}

func CloseConnection() {
	instance, _ := db.DB()
	instance.Close()
}
