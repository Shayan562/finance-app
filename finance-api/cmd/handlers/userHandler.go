package handlers

import (
	"finance-app/cmd/models"
	"net/http"

	"github.com/labstack/echo/v4"
)

func Signup(c echo.Context) error {
	u := models.User{}
	if err := c.Bind(&u); err != nil {
		c.Logger().Error(err)
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}
	return c.JSON(http.StatusCreated, u)
}
