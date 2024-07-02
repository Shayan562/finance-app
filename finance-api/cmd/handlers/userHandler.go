package handlers

import (
	"finance-app/cmd/models"
	"finance-app/cmd/service"
	"finance-app/cmd/storage"
	"finance-app/constants"
	"fmt"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
)

func Signup(c echo.Context) error {
	userInput := models.User{}
	err := c.Bind(&userInput)
	if err != nil {
		c.Logger().Error(err)
		return constants.StatusBadRequest400(c, "invalid request body")
	}

	//saitizing email
	userInput.Email, err = service.SanitizeAndCheckEmail(userInput.Email)
	if err != nil {
		return constants.StatusBadRequest400(c, err.Error())
	}
	//db search for email
	userAlreadyExists, err := storage.IsEmailInUse(userInput.Email)
	if err != nil {
		c.Logger().Error(err)
		return constants.StatusInternalServerError500(c, err.Error())
	}
	if userAlreadyExists {
		return constants.StatusBadRequest400(c, "email already exists")
	}
	//sanitizing name
	userInput.Name, err = service.SanitizeAndCheckName(userInput.Name)
	if err != nil {
		return constants.StatusBadRequest400(c, err.Error())
	}

	//checking password
	err = service.CheckPass(userInput.Password, userInput.Name, userInput.Email)
	if err != nil {
		return constants.StatusBadRequest400(c, err.Error())
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
	return constants.StatusCreated201(c, "account created")
}

func Login(c echo.Context) error {
	userInput := models.User{}
	err := c.Bind(&userInput)
	if err != nil {
		c.Logger().Error(err)
		return constants.StatusBadRequest400(c, "invalid request body")
	}
	//checkig again is not big deal since the valule set will already be i accordace with us
	//checking emaill
	userInput.Email, err = service.SanitizeAndCheckEmail(userInput.Email)
	if err != nil {
		return constants.StatusBadRequest400(c, err.Error())
	}
	//checking pass
	if userInput.Password == "" {
		return constants.StatusBadRequest400(c, "invalid request body")
	}

	userDB, err := storage.GetUserWithEmail(userInput.Email)
	//some error related to db
	if err != nil {
		return constants.StatusInternalServerError500(c, err.Error())
	}
	//email is not registered
	if userDB == nil {
		return constants.StatusBadRequest400(c, "invalid email or password")
	}

	//compare input password with hashed stored passwoord
	correctPassword := service.CheckPasswordHash(userInput.Password, userDB.Password)

	//if matched gennerate jwt token
	if correctPassword {
		jwtToken, err := service.CreateJWTToken(int(userDB.ID))
		if err != nil {
			return constants.StatusInternalServerError500(c, err.Error())
		}

		cookie := new(http.Cookie)
		cookie.Name = "authToken"
		cookie.Value = fmt.Sprintf("bearer %v", jwtToken)
		cookie.Expires = time.Now().Add(2 * time.Hour)
		cookie.HttpOnly = true
		cookie.SameSite = http.SameSiteLaxMode
		cookie.Secure = false
		c.SetCookie(cookie)

		return c.NoContent(http.StatusOK)
		// userDB.Password = ""
		// return c.JSON(http.StatusAccepted, map[string]any{"token": fmt.Sprintf("bearer %v", jwtToken), "user": userDB})
	}

	return constants.StatusBadRequest400(c, "invalid email or password")

}

func UpdatePassword(c echo.Context) error {
	userInput := models.User{}
	//extracting new password and id from the body
	err := c.Bind(&userInput)
	if err != nil {
		c.Logger().Error(err)
		return constants.StatusBadRequest400(c, "invalid request body")
	}
	userInput.ID = c.Get("id").(uint)
	//early return if password not provided
	if userInput.Password == "" {
		return constants.StatusBadRequest400(c, "invalid request body")
	}
	//get user data for password creation
	user, err := storage.GetUserWithID(userInput.ID)
	//some error related to db
	if err != nil {
		return constants.StatusInternalServerError500(c, err.Error())
	}
	err = service.CheckPass(userInput.Password, user.Name, user.Email)
	if err != nil {
		return constants.StatusBadRequest400(c, err.Error())
	}

	//check if old is the same as new
	samePassword := service.CheckPasswordHash(userInput.Password, user.Password)
	if samePassword {
		return constants.StatusBadRequest400(c, "new password cannot be the same as old password")
	}

	//get password hash for storing
	userInput.Password, err = service.HashPassword(userInput.Password)
	if err != nil {
		return constants.StatusInternalServerError500(c, err.Error())
	}

	err = storage.UpdatePasswordWithID(userInput.ID, userInput.Password)
	if err != nil {
		return constants.StatusInternalServerError500(c, err.Error())
	}
	return constants.StatusAccepted202(c, "password updated successfully")
}
func ForgotPassword(c echo.Context) error {
	userInput := models.User{}
	//extracting new password and id from the body
	err := c.Bind(&userInput)
	if err != nil {
		c.Logger().Error(err)
		return constants.StatusBadRequest400(c, "invalid request body")
	}
	if userInput.Email == "" {
		return constants.StatusBadRequest400(c, "invalild email")
	}
	// email := c.QueryParam("email")

	emailInUse, err := storage.IsEmailInUse(userInput.Email)
	if err != nil {
		return constants.StatusInternalServerError500(c, err.Error())
	}
	if !(emailInUse) {
		return constants.StatusNotFound404(c, "email is not registered")
	}

	//here use thrid party mail to update and set a new password
	userInput.Password = service.GeneratePassword()
	//first send password to user then update it
	currTime := time.Now()
	err = service.SendMail(userInput.Email, userInput.Password)
	endTime := time.Since(currTime)
	fmt.Printf("TIme taken: %v\n", endTime)
	if err != nil {
		return constants.StatusInternalServerError500(c, err.Error())
	}
	//generate passwoord hash
	userInput.Password, err = service.HashPassword(userInput.Password)
	if err != nil {
		return constants.StatusInternalServerError500(c, err.Error())
	}
	err = storage.UpdatePasswordWithEmail(userInput.Email, userInput.Password)
	if err != nil {
		return constants.StatusInternalServerError500(c, err.Error())
	}

	return constants.StatusAccepted202(c, "new password has been sent on the registered email")

}

func GetUserInfo(c echo.Context) error {
	// userObj := models.User{}
	userID := c.Get("id").(uint)
	userObj, err := storage.GetUserWithID(userID)
	if err != nil {
		return constants.StatusBadRequest400(c, err.Error())
	}
	userObj.Password = ""
	return c.JSON(http.StatusAccepted, userObj)
}

func Logout(c echo.Context) error {
	cookie, err := c.Cookie("authToken")
	if err != nil {
		return constants.StatusBadRequest400(c, err.Error())
	}
	cookie.Expires = time.Now().Add(-time.Hour)
	c.SetCookie(cookie)
	return c.NoContent(http.StatusOK)
}
