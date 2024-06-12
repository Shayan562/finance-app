package main

import (
	"finance-app/cmd/handlers"

	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()

	// e.Use(middleware.Recover())
	e.POST("/signup", handlers.Signup)
	e.Logger.Fatal((e.Start(":8080")))

}
