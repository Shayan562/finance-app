package handlers

import (
	"finance-app/cmd/models"
	"finance-app/cmd/service"
	"finance-app/cmd/storage"
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
)

func Signup(c echo.Context) error {
	userInput := models.User{}
	err := c.Bind(&userInput)
	if err != nil {
		c.Logger().Error(err)
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}
	//further checkes for pass will be on the frontend. This is additional
	if userInput.Name == "" || userInput.Password == "" || userInput.Email == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	//db search for email
	userAlreadyExists, err := storage.IsEmailInUse(userInput.Email)

	if err != nil {
		c.Logger().Error(err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	if userAlreadyExists {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Email already exists"})
	}

	//get password hash to store
	userInput.Password, err = service.HashPassword(userInput.Password)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	err = storage.InsertUser(userInput)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, map[string]string{"msg": "Account Created"})
}

func Login(c echo.Context) error {
	userInput := models.User{}
	err := c.Bind(&userInput)
	if err != nil {
		c.Logger().Error(err)
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}
	if userInput.Password == "" || userInput.Email == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	userDB, err := storage.GetUserWithEmail(userInput.Email)
	//some error related to db
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	//email is not registered
	if userDB == nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid email or password"})
	}

	//compare input password with hashed stored passwoord
	correctPassword := service.CheckPasswordHash(userInput.Password, userDB.Password)

	//if matched gennerate jwt token
	if correctPassword {
		jwtToken, err := service.CreateJWTToken(userDB.Id)
		fmt.Println(userDB)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}
		userDB.Password = ""
		return c.JSON(http.StatusAccepted, map[string]any{"token": fmt.Sprintf("bearer %v", jwtToken), "user": userDB})
	}

	return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid email or password"})

}

func UpdatePassword(c echo.Context) error {
	userInput := models.User{}
	//extracting new password and id from the body
	err := c.Bind(&userInput)
	if err != nil {
		c.Logger().Error(err)
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}
	if userInput.Password == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	oldPassword, err := storage.GetUserOldPasswordWithID(userInput.Id)
	//some error related to db
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	//check if old is the same as new
	samePassword := service.CheckPasswordHash(userInput.Password, oldPassword)
	if samePassword {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "new password cannot be the same as old password"})
	}

	//get password hash for storing
	userInput.Password, err = service.HashPassword(userInput.Password)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	err = storage.UpdatePassword(userInput.Id, userInput.Password)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusAccepted, map[string]string{"error": "password updated successfully"})
}
