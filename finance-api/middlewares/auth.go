package middlewares

import (
	"finance-app/cmd/service"
	"finance-app/constants"
	"strings"

	"github.com/labstack/echo/v4"
)

func AuthMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		// token := c.Request().Header.Get("Authorization")
		cookie, err := c.Cookie("authToken")
		if err != nil {
			return constants.StatusBadRequest400(c, err.Error())
		}
		token := cookie.Value
		//extracting token
		token = strings.Split(token, " ")[1]
		//extracting id
		userID, _ := service.ParseAndVerifyJWTToken(token)
		if userID == 0 {
			return constants.StatusUnauthorized401(c, "authentication failed: invalid user id")
		} else {
			c.Set("id", userID)
		}
		return next(c)
	}
}
