package main

import (
	"finance-app/cmd/handlers"
	"finance-app/cmd/storage"
	"finance-app/middlewares"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()

	e.Use(middleware.RateLimiter(middleware.NewRateLimiterMemoryStore(20)))
	// e.Use(middleware.Logger())
	e.POST("/signup", handlers.Signup)
	e.POST("/login", handlers.Login)
	e.POST("/forgot-password", handlers.ForgotPassword)
	e.PATCH("/update-password", handlers.UpdatePassword, middlewares.AuthMiddleware)

	e.GET("/tags", handlers.GetAllTags, middlewares.AuthMiddleware)
	e.GET("/tags/:type", handlers.GetTags, middlewares.AuthMiddleware)
	e.POST("/tag", handlers.NewTag, middlewares.AuthMiddleware)

	e.GET("/transactions", handlers.GetAllTransactions, middlewares.AuthMiddleware)
	e.POST("/transaction", handlers.NewTransaction, middlewares.AuthMiddleware)

	// e.GET("/test", func(c echo.Context) error {
	// 	userInput := models.User{}
	// 	err := c.Bind(&userInput)
	// 	userInput.Id = c.Get("id").(int)
	// 	if err != nil {
	// 		return c.JSON(301, err.Error())
	// 	}
	// 	return c.JSON(200, userInput)
	// }, middlewares.AuthMiddleware)

	storage.ConnectToDB()
	storage.Migrate()
	// defer storage.CloseConnection()

	e.Logger.Fatal((e.Start(":8081")))

}
