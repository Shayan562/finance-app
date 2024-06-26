package service

import (
	"errors"
	"finance-app/cmd/models"
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
	"gorm.io/datatypes"
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
	claims["exp"] = time.Now().Add(2 * time.Hour).Unix()
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

func ParseAndVerifyJWTToken(tokenString string) (uint, error) {
	secretKey := []byte(os.Getenv("SECRETKEY"))

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		_, ok := token.Method.(*jwt.SigningMethodHMAC)
		if !ok {
			return -1, fmt.Errorf(fmt.Sprintf("unexpected signing method: %v", token.Header["alg"]))
		}
		return secretKey, nil
	})
	if err != nil {
		return 0, err
	}
	// Check if the token is valid
	if !token.Valid {
		return 0, errors.New("invalid token")
	}
	// Extract the user ID from the token claims
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return 0, errors.New("problem with claims")
	}

	userID, ok := claims["user"].(float64)
	if !ok {
		return 0, errors.New("problem with userid")
	}

	return uint(userID), nil
}

func GeneratePassword() string {
	const allowed = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}\\|;':\",.<>/?`~0123456789"
	patternNum, _ := regexp.Compile("[0-9]")
	patternLower, _ := regexp.Compile("[a-z]")
	patternUpper, _ := regexp.Compile("[A-Z]")
	patternSpecial, _ := regexp.Compile("[\\^!@#$%\\^&*()_+\\-=[\\]{}\\|;':\\\",.<>/?`~]")

	passLen := 16
	pass := make([]byte, passLen)
	for attempt := 0; attempt < 1; {
		for i := 0; i < passLen; i++ {
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
	Name
	1. Strip Spaces from front and back
	2. Remove Special Characters
	3. Only one space allowed between characters
*/

func SanitizeAndCheckEmail(email string) (string, error) {
	email = strings.Trim(email, " ")
	if len(email) < 3 {
		return "", errors.New("invalid email")
	}
	_, err := mail.ParseAddress(email)
	return email, err
}

func CheckPass(pass string, name string, email string) error {
	if len(pass) < 8 {
		return errors.New("password must be atleast 8 characters long")
	}
	//checking for the users name in password
	names := strings.Split(name, " ")
	for _, n := range names {
		//user for ignoring case
		namePattern := "(?i)" + regexp.QuoteMeta(n)
		nameRegexp, err := regexp.Compile(namePattern)
		if err != nil {
			return err
		}

		if nameRegexp.MatchString(pass) {
			return errors.New("password cannot contain your name")
		}
	}
	//checking for the users email in password
	email = strings.Split(email, "@")[0]
	email = strings.Trim(email, " ")
	email = "(?i)" + regexp.QuoteMeta(email)
	emailRegexp, err := regexp.Compile(email)
	if err != nil {
		return err
	}
	if emailRegexp.MatchString(pass) {
		return errors.New("password cannot contain your email")
	}
	//checking for common terms
	terms := []string{"(?i)password", "(?i)admin", "(?i)pass123"}
	for _, t := range terms {
		//user for ignoring case
		termRegexp, err := regexp.Compile(t)
		if err != nil {
			return err
		}
		if termRegexp.MatchString(pass) {
			return errors.New("password cannot contain common terms like password")
		}
	}
	//checking for other requirements
	patternNum, _ := regexp.Compile("[0-9]")
	patternLower, _ := regexp.Compile("[a-z]")
	patternUpper, _ := regexp.Compile("[A-Z]")
	patternSpecial, _ := regexp.Compile("[\\^!@#$%\\^&*()_+\\-=[\\]{}\\|;':\\\",.<>/?`~]")

	switch {
	case !(patternNum.MatchString(pass)):
		return errors.New("password must contain numbers")
	case !(patternLower.MatchString(pass)):
		return errors.New("password must contain lowercase characters")
	case !(patternUpper.MatchString(pass)):
		return errors.New("password must contain uppercase characters")
	case !(patternSpecial.MatchString(pass)):
		return errors.New("password must contain special characters")
	}

	return nil
}

func SanitizeAndCheckName(name string) (string, error) {
	name = strings.Trim(name, " ")
	if len(name) <= 1 {
		return "", errors.New("name too small")
	}
	if len(name) >= 50 {
		return "", errors.New("name too long")
	}
	return name, nil
}

func SanitizeAndCheckTransType(transType string) (models.TransTypes, error) {
	if transType == "" {
		return "", errors.New("missing type(income or expense)")
	}
	transType = strings.ToLower(transType)
	transType = strings.TrimSpace(transType)
	switch transType {
	case "income", "inc", "i", "+":
		return models.Income, nil
	case "expense", "exp", "e", "-":
		return models.Expense, nil
	default:
		return "", errors.New("invalid transaction or tag type(must be income or expense)")
	}
}

func SanitizeAndCheckTransRepeatFreq(transFreq string) (models.TransRepeatFreq, error) {
	if transFreq == "" {
		return models.None, nil
	}
	transFreq = strings.ToLower(transFreq)
	transFreq = strings.TrimSpace(transFreq)
	switch transFreq {
	case "none", "no", "n":
		return models.None, nil
	case "weekly", "week", "w":
		return models.Weekly, nil
	case "monthly", "month", "m":
		return models.Monthly, nil
	case "yearly", "year", "y":
		return models.Yearly, nil
	default:
		return "", errors.New("invalid recurring frequency(must be none, weekly, monthly, or yearly)")
	}

}

func CheckTransAndTagsType(transObj models.Transaction) error {
	if transObj.Tags == nil { //no tags so correct
		return nil
	}
	for _, tag := range transObj.Tags {
		if tag.TagType.String() != transObj.TransType.String() {
			return errors.New("transaction type and tag type mismatch")
		}
	}
	return nil
}

func SanitizeAndCheckDate(dateObj datatypes.Date) (datatypes.Date, error) {
	var temp []byte
	dateObj.GobDecode(temp)
	fmt.Println(temp)

	println(dateObj.Value())
	return dateObj, nil
}
