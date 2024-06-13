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
	e.POST("/login", handlers.Login)
	e.PATCH("/update-password", handlers.UpdatePassword)

	// strTest, _ := service.CreateJWTToken(123)
	// fmt.Printf("Token: %v", strTest)

	storage.ConnectToDB()

	e.Logger.Fatal((e.Start(":8081")))

}
