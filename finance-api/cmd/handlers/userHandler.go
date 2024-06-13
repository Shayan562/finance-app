package handlers

import (
	"finance-app/cmd/models"
	"finance-app/cmd/service"
	"finance-app/cmd/storage"
	"finance-app/constants"
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
)

func Signup(c echo.Context) error {
	userInput := models.User{}
	err := c.Bind(&userInput)
	if err != nil {
		c.Logger().Error(err)
		return constants.StatusBadRequest400(c, "Invalid request body")
	}
	validMail := false
	validMail, userInput.Email = service.SanitizeAndCheckEmail(userInput.Email)

	validPass := service.CheckPass(userInput.Password)
	//further checkes for pass will be on the frontend. This is additional
	if userInput.Name == "" || validPass && validMail {
		return constants.StatusBadRequest400(c, "Invalid request body")
	}

	//db search for email
	userAlreadyExists, err := storage.IsEmailInUse(userInput.Email)

	if err != nil {
		c.Logger().Error(err)
		return constants.StatusInternalServerError500(c, err.Error())
	}

	if userAlreadyExists {
		return constants.StatusBadRequest400(c, "Email already exists")
	}

	//get password hash to store
	userInput.Password, err = service.HashPassword(userInput.Password)
	if err != nil {
		return constants.StatusInternalServerError500(c, err.Error())
	}

	err = storage.InsertUser(userInput)
	if err != nil {
		return constants.StatusInternalServerError500(c, err.Error())
	}
	return constants.StatusCreated201(c, "Account Created")
}

func Login(c echo.Context) error {
	userInput := models.User{}
	err := c.Bind(&userInput)
	if err != nil {
		c.Logger().Error(err)
		return constants.StatusBadRequest400(c, "Invalid request body")
	}
	if userInput.Password == "" || userInput.Email == "" {
		return constants.StatusBadRequest400(c, "Invalid request body")
	}

	userDB, err := storage.GetUserWithEmail(userInput.Email)
	//some error related to db
	if err != nil {
		return constants.StatusInternalServerError500(c, err.Error())
	}
	//email is not registered
	if userDB == nil {
		return constants.StatusBadRequest400(c, "Invalid email or password")
	}

	//compare input password with hashed stored passwoord
	correctPassword := service.CheckPasswordHash(userInput.Password, userDB.Password)

	//if matched gennerate jwt token
	if correctPassword {
		jwtToken, err := service.CreateJWTToken(userDB.Id)
		fmt.Println(userDB)
		if err != nil {
			return constants.StatusInternalServerError500(c, err.Error())
		}
		// testID, err := service.ParseAndVerifyJWTToken(jwtToken)
		// if err == nil {
		// 	fmt.Printf("Extracted UserID: %d", testID)
		// } else {
		// 	fmt.Printf("Error with validation: %v", err.Error())
		// }
		userDB.Password = ""
		return c.JSON(http.StatusAccepted, map[string]any{"token": fmt.Sprintf("bearer %v", jwtToken), "user": userDB})
	}

	return constants.StatusBadRequest400(c, "Invalid email or password")

}

func UpdatePassword(c echo.Context) error {
	userInput := models.User{}
	//extracting new password and id from the body
	err := c.Bind(&userInput)
	if err != nil {
		c.Logger().Error(err)
		return constants.StatusBadRequest400(c, "Invalid request body")
	}
	if userInput.Password == "" {
		return constants.StatusBadRequest400(c, "Invalid request body")
	}
	userInput.Id = c.Get("id").(int)

	oldPassword, err := storage.GetUserOldPasswordWithID(userInput.Id)
	//some error related to db
	if err != nil {
		return constants.StatusInternalServerError500(c, err.Error())
	}

	//check if old is the same as new
	samePassword := service.CheckPasswordHash(userInput.Password, oldPassword)
	if samePassword {
		return constants.StatusBadRequest400(c, "new password cannot be the same as old password")
	}

	//get password hash for storing
	userInput.Password, err = service.HashPassword(userInput.Password)
	if err != nil {
		return constants.StatusInternalServerError500(c, err.Error())
	}

	err = storage.UpdatePassword(userInput.Id, userInput.Password)
	if err != nil {
		return constants.StatusInternalServerError500(c, err.Error())
	}
	return constants.StatusAccepted202(c, "password updated successfully")
}
