package service

import (
	"errors"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func CreateJWTToken(id int) (string, error) {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
		return "", err
	}
	secretKey := []byte(os.Getenv("SECRETKEY"))

	claims := jwt.MapClaims{}
	claims["exp"] = time.Now().Add(2 * time.Hour).Unix() //for testing reasons
	claims["authorized"] = true
	claims["user"] = id

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		return "", err
	}
	// fmt.Println(tokenString)
	return tokenString, nil
}

func ParseAndVerifyJWTToken(tokenString string) (int, error) {
	secretKey := []byte(os.Getenv("SECRETKEY"))

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		_, ok := token.Method.(*jwt.SigningMethodHMAC)
		if !ok {
			return -1, fmt.Errorf(fmt.Sprintf("unexpected signing method: %v", token.Header["alg"]))
		}
		return secretKey, nil
	})
	if err != nil {
		return -1, err
	}
	// Check if the token is valid
	if !token.Valid {
		return -1, errors.New("invalid token")
	}
	// Extract the user ID from the token claims
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return -1, errors.New("problem with claims")
	}

	userID, ok := claims["user"].(float64)
	if !ok {
		return -1, errors.New("problem with userid")
	}

	return int(userID), nil
}
