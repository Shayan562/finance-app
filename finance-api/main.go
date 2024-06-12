package main

import (
	"finance-app/cmd/handlers"
	"finance-app/cmd/storage"

	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()

	// e.Use(middleware.Logger())
	e.POST("/signup", handlers.Signup)

	storage.ConnectToDB()

	e.Logger.Fatal((e.Start(":8080")))

}
