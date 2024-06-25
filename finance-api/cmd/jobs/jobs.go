package jobs

import (
	"finance-app/cmd/storage"
	"fmt"
	"time"

	"gorm.io/datatypes"
)

func RecurringExpense() error {
	//get all transactions that have to be repeated
	transactions, err := storage.GetAllRepeatingTransactions()
	if err != nil {
		return err
	}
	// currDate := time.Now().UTC()
	// transactionsToAdd := []models.Transaction{}
	// for _, transaction := range transactions {
	// 	tempDate := time.Time(transaction.TransDate)
	// }
	dateTemp := datatypes.Date{}
	temp := time.Time(dateTemp)

	fmt.Println(time.Now().UTC().Sub(temp))
	fmt.Println(temp.AddDate(0, 0, 7))
	fmt.Println(time.Now().UTC())
	fmt.Println(dateTemp.Value())
	fmt.Println(transactions)

	return nil
}
