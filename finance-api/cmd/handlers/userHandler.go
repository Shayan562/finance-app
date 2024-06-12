package handlers

import (
	"finance-app/cmd/models"
	"finance-app/cmd/service"
	"finance-app/cmd/storage"
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
	//compare input password with hashed stored passwoord
	//if matched gennerate jwt token
	return c.JSON(http.StatusOK, userDB)
	// cmpare := service.CheckPasswordHash(userInput.Password, userDB.Password)
}
