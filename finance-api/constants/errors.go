package constants

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func StatusOK200(c echo.Context, msg string) error {
	return c.JSON(http.StatusOK, map[string]string{"msg": msg})
}
func StatusCreated201(c echo.Context, msg string) error {
	return c.JSON(http.StatusCreated, map[string]string{"msg": msg})
}
func StatusAccepted202(c echo.Context, msg string) error {
	return c.JSON(http.StatusAccepted, map[string]string{"msg": msg})
}
func StatusBadRequest400(c echo.Context, err string) error {
	return c.JSON(http.StatusBadRequest, map[string]string{"error": err})
}
func StatusUnauthorized401(c echo.Context, err string) error {
	return c.JSON(http.StatusUnauthorized, map[string]string{"error": err})
}
func StatusUnknownForbidden403(c echo.Context, err string) error {
	return c.JSON(http.StatusForbidden, map[string]string{"error": err})
}
func StatusNotFound404(c echo.Context, err string) error {
	return c.JSON(http.StatusNotFound, map[string]string{"error": err})
}
func StatusInternalServerError500(c echo.Context, err string) error {
	return c.JSON(http.StatusInternalServerError, map[string]string{"error": err})
}
func StatusServiceUnavailable503(c echo.Context, err string) error {
	return c.JSON(http.StatusServiceUnavailable, map[string]string{"error": err})
}
