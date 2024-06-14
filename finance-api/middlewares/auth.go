package middlewares

import (
	"finance-app/cmd/service"
	"finance-app/constants"
	"strings"

	"github.com/labstack/echo/v4"
)

func AuthMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		token := c.Request().Header.Get("Authorization")
		//extracting token
		token = strings.Split(token, " ")[1]
		// token = token[:len(token)-1]
		//extracting id
		userID, _ := service.ParseAndVerifyJWTToken(token)
		if userID == -1 {
			return constants.StatusUnauthorized401(c, "authentication failed")
		} else {
			c.Set("id", userID)
		}
		return next(c)
	}
}
