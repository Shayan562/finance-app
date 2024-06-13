package main

import (
	"finance-app/cmd/handlers"
	"finance-app/cmd/storage"
	"finance-app/middlewares"

	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()

	// e.Use(middleware.Logger())
	e.POST("/signup", handlers.Signup)
	e.POST("/login", handlers.Login)
	e.PATCH("/update-password", handlers.UpdatePassword, middlewares.AuthMiddleware)

	// e.GET("/test", func(c echo.Context) error {
	// 	userInput := models.User{}
	// 	err := c.Bind(&userInput)
	// 	userInput.Id = c.Get("id").(int)
	// 	if err != nil {
	// 		return c.JSON(301, err.Error())
	// 	}
	// 	return c.JSON(200, userInput)

	// }, middlewares.AuthMiddleware)

	// strTest, _ := service.CreateJWTToken(123)
	// fmt.Printf("Token: %v", strTest)

	storage.ConnectToDB()

	e.Logger.Fatal((e.Start(":8081")))

}
