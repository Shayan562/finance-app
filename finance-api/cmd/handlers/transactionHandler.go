package handlers

import (
	"finance-app/cmd/models"
	"finance-app/cmd/service"
	"finance-app/cmd/storage"
	"finance-app/constants"
	"net/http"

	"github.com/labstack/echo/v4"
)

func GetAllTransactions(c echo.Context) error {
	userID := c.Get("id").(uint)
	transactions, err := storage.GetAllTransactionsWithUserID(userID)
	if err != nil {
		return constants.StatusInternalServerError500(c, err.Error())
	}
	// fmt.Println((*tags)[0])
	return c.JSON(http.StatusOK, *transactions)

}
func NewTransaction(c echo.Context) error {
	transactionInput := models.Transaction{}
	err := c.Bind(&transactionInput)
	if err != nil {
		return constants.StatusBadRequest400(c, err.Error())
	}
	//verify alll fields
	transactionInput.TransRepeatFreq, err = service.SanitizeAndCheckTransRepeatFreq(string(transactionInput.TransRepeatFreq))
	if err != nil {
		return constants.StatusBadRequest400(c, err.Error())
	}
	transactionInput.TransType, err = service.SanitizeAndCheckTransType(string(transactionInput.TransType))
	if err != nil {
		return constants.StatusBadRequest400(c, err.Error())
	}
	if transactionInput.Amount <= 0 {
		return constants.StatusBadRequest400(c, "amount must be greater than 0")
	}

	err = storage.NewTransaction(&transactionInput)
	if err != nil {
		return constants.StatusInternalServerError500(c, err.Error())
	}
	return c.JSON(http.StatusCreated, map[string]any{"Transaction: ": transactionInput})
	// return nil
}
func UpdateTransaction(c echo.Context) error {
	return nil
}
func DeleteTransaction(c echo.Context) error {
	return nil
}
