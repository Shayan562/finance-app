package main

import (
	"finance-app/cmd/handlers"
	"finance-app/cmd/storage"
	"finance-app/middlewares"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	// "github.com/go-co-op/gocron/v2"
)

func main() {
	e := echo.New()

	e.Use(middleware.RateLimiter(middleware.NewRateLimiterMemoryStore(20)))
	// e.Use(middleware.Logger())
	//routes for users related tasks
	e.POST("/signup", handlers.Signup)
	e.POST("/login", handlers.Login)
	e.POST("/forgot-password", handlers.ForgotPassword)
	e.PATCH("/update-password", handlers.UpdatePassword, middlewares.AuthMiddleware)
	//routes for tag related  tasks
	e.GET("/tags", handlers.GetTags, middlewares.AuthMiddleware)
	e.POST("/tag", handlers.NewTag, middlewares.AuthMiddleware)
	//transaction related tasks
	e.GET("/transactions", handlers.GetAllTransactions, middlewares.AuthMiddleware)
	e.POST("/transaction", handlers.NewTransaction, middlewares.AuthMiddleware)
	e.PUT("/transaction", handlers.UpdateTransaction, middlewares.AuthMiddleware) //to be reviewed once ui is implemented
	e.DELETE("/transaction/:trans-id", handlers.DeleteTransaction, middlewares.AuthMiddleware)

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

	// go schedule()

	// defer storage.CloseConnection()

	// go schedule()
	e.Logger.Fatal((e.Start(":8081")))

}

// func schedule() { //make  it go to sleep aswell use ticker to  invoke it

// 	for {
// 		//running for every 9 seconds
// 		timeNow := time.Now().UTC()
// 		timeToStart := time.Now().UTC().Add(3 * time.Second)
// 		sleepDuration := timeToStart.Sub(timeNow)
// 		time.Sleep(sleepDuration)
// 		fmt.Printf("-------------\nScheduler Invoked @ %v\n", time.Now().Second())
// 		// ticker.Reset(2 * time.Second)
// 		// ticker := time.NewTicker(1 * time.Second)
// 		ticker2 := time.NewTicker(1 * time.Second)

// 		// if v := <-ticker.C; !v.IsZero() {
// 		// 	go myJob()
// 		// }
// 		// if v := <-ticker2.C; !v.IsZero() {
// 		// 	go myJob2()
// 		// 	}
// 		// <-ticker.C
// 		go myJob()
// 		<-ticker2.C
// 		go myJob2()

// 		// ticker.Stop()
// 		ticker2.Stop()
// 	}
// }

// func myJob() {
// 	fmt.Printf("Running Job 1@ %v\n", time.Now().Second())
// }
// func myJob2() {
// 	fmt.Printf("Running Job 2@ %v\n", time.Now().Second())
// 	time.Sleep(2 * time.Second)
// }
