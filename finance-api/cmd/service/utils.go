package service

import (
	"errors"
	"fmt"
	"log"
	"math/rand"
	"net/mail"
	"os"
	"regexp"
	"strings"
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

func GeneratePassword() string {
	const allowed = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}\\|;':\",.<>/?`~0123456789"
	patternNum, _ := regexp.Compile("[0-9]")
	patternLower, _ := regexp.Compile("[a-z]")
	patternUpper, _ := regexp.Compile("[A-Z]")
	patternSpecial, _ := regexp.Compile("[\\^!@#$%\\^&*()_+\\-=[\\]{}\\|;':\\\",.<>/?`~]")

	pass := make([]byte, 15)
	for attempt := 0; attempt < 1; {
		for i := 0; i < 15; i++ {
			pass[i] = allowed[rand.Intn(len(allowed))]
		}
		result := string(pass)
		if patternNum.MatchString(result) && patternLower.MatchString(result) && patternUpper.MatchString(result) && patternSpecial.MatchString(result) {
			return result
		}
	}
	return string(pass)
}

/*
	Sanitization
	Email
	1. Reg exp => __@__
	2. No spaces anywhere
	3. Only 1 @
	4. No . at the start or end
	Passwords
	1. Length check
	2. Check for email, name, and common passswords
	Name
	1. Strip Spaces from front and back
	2. Remove Special Characters
	3. Only one space allowed between characters
*/

func SanitizeAndCheckEmail(email string) (bool, string) {
	email = strings.Trim(email, " ")
	if len(email) < 3 {
		return false, ""
	}
	_, err := mail.ParseAddress(email)
	return err == nil, email
}
func CheckPass(pass string) bool {
	return len(pass) >= 8
}
func SanitizeAndCheckName(dirtyStr string) (bool, string) {
	// dirtyStr = strings.Trim(dirtyStr, " ")
	// cleanStr = []
	return true, ""
}
