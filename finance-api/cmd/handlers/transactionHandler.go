package handlers

import (
	"finance-app/cmd/models"
	"finance-app/cmd/service"
	"finance-app/cmd/storage"
	"finance-app/constants"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/labstack/echo/v4"
	"gorm.io/datatypes"
)

// no filter and filter on exact date
func GetAllTransactions(c echo.Context) error {
	userID := c.Get("id").(uint)
	//extract  query parameterus
	params := c.QueryParams()
	//for db query at the end
	conditionString := []string{"user_id=?"}
	arguments := []any{userID}
	//if it has date format it and check for use
	if params.Has("date") {
		dateStr := params["date"][0]
		dateConv, err := time.Parse("2006-01-02", dateStr)
		if err != nil {
			return constants.StatusBadRequest400(c, "incorrect date format(must be yyyy-mm-dd)")
		}
		date := datatypes.Date{}
		err = date.Scan(dateConv)
		if err != nil {
			return constants.StatusBadRequest400(c, "incorrect date")
		}
		//adding to db query string
		conditionString = append(conditionString, "and trans_date=?")
		arguments = append(arguments, date)
	}
	//run the db query on givenn transactionns
	transactions, err := storage.GetTransactionsWithFilters(strings.Join(conditionString, " "), arguments)
	if err != nil {
		return constants.StatusInternalServerError500(c, err.Error())
	}
	if transactions == nil {
		return constants.StatusNotFound404(c, "no transactions found")
	}

	return c.JSON(http.StatusOK, map[string][]models.Transaction{"transactions": transactions})
}

func NewTransaction(c echo.Context) error {
	transactionInput := models.Transaction{}
	err := c.Bind(&transactionInput)
	if err != nil {
		return constants.StatusBadRequest400(c, err.Error())
	}
	transactionInput.UserID = c.Get("id").(uint)
	//verify and format the transaction type field
	transactionInput.TransType, err = service.SanitizeAndCheckTransType(string(transactionInput.TransType))
	if err != nil {
		return constants.StatusBadRequest400(c, err.Error())
	}

	//db query to get correct tag data based on tag id
	var tagIDs []uint
	countOfTagsBefore := 0
	for _, tag := range transactionInput.Tags {
		tagIDs = append(tagIDs, tag.ID)
		countOfTagsBefore += 1
	}
	transactionInput.Tags, err = storage.GetTagsWithIDs(tagIDs)
	if err != nil {
		return constants.StatusBadRequest400(c, err.Error())
	}
	//make sure number of tags does not change
	if countOfTagsBefore != len(transactionInput.Tags) {
		return constants.StatusCreated201(c, "request contains tag/s that dont exist")
	}
	//verify tags are of the same type as transactions
	err = service.CheckTransAndTagsType(transactionInput)
	if err != nil {
		return constants.StatusBadRequest400(c, err.Error())
	}
	if transactionInput.Amount == 0 {
		return constants.StatusBadRequest400(c, "amount must be greater than 0")
	}
	// transactionInput.TransDate, err = service.SanitizeAndCheckDate(transactionInput.TransDate)
	// if err != nil {
	// 	return constants.StatusBadRequest400(c, err.Error())
	// }
	transactionInput.TransRepeatFreq, err = service.SanitizeAndCheckTransRepeatFreq(string(transactionInput.TransRepeatFreq))
	if err != nil {
		return constants.StatusBadRequest400(c, err.Error())
	}

	err = storage.NewTransaction(&transactionInput)
	if err != nil {
		return constants.StatusInternalServerError500(c, err.Error())
	}
	return c.JSON(http.StatusCreated, map[string]any{"Transaction: ": transactionInput})
	// return nil
}
func UpdateTransaction(c echo.Context) error {
	transactionInput := models.Transaction{}
	err := c.Bind(&transactionInput)
	if err != nil {
		return constants.StatusBadRequest400(c, err.Error())
	}

	//make sure owner is the one updating
	userID := c.Get("id").(uint)
	savedTransaction, err := storage.GetTransactionWithTransID(transactionInput.ID)
	if err != nil {
		return constants.StatusBadRequest400(c, err.Error())
	}
	if savedTransaction.UserID != userID {
		return constants.StatusUnknownForbidden403(c, "unauthorized to update transaction")
	}
	transactionInput.UserID = userID
	//verify and format the transaction type field
	transactionInput.TransType, err = service.SanitizeAndCheckTransType(string(transactionInput.TransType))
	if err != nil {
		return constants.StatusBadRequest400(c, err.Error())
	}
	//db query to get correct tag data based on tag id
	var tagIDs []uint
	countOfTagsBefore := 0
	for _, tag := range transactionInput.Tags {
		tagIDs = append(tagIDs, tag.ID)
		countOfTagsBefore += 1
	}
	transactionInput.Tags, err = storage.GetTagsWithIDs(tagIDs)
	if err != nil {
		return constants.StatusBadRequest400(c, err.Error())
	}
	if countOfTagsBefore != len(transactionInput.Tags) {
		return constants.StatusCreated201(c, "request contains tag/s that dont exist")
	}
	//verify tags are of the same type as transactions
	err = service.CheckTransAndTagsType(transactionInput)
	if err != nil {
		return constants.StatusBadRequest400(c, err.Error())
	}
	if transactionInput.Amount == 0 {
		return constants.StatusBadRequest400(c, "amount must be greater than 0")
	}
	transactionInput.TransRepeatFreq, err = service.SanitizeAndCheckTransRepeatFreq(string(transactionInput.TransRepeatFreq))
	if err != nil {
		return constants.StatusBadRequest400(c, err.Error())
	}
	err = storage.UpdateTransaction(transactionInput)
	if err != nil {
		return constants.StatusInternalServerError500(c, err.Error())
	}
	return constants.StatusOK200(c, "updated")

}
func DeleteTransaction(c echo.Context) error {
	trans := c.Param("trans-id")
	fmt.Println(c.ParamNames())
	transID, err := strconv.ParseUint(trans, 10, 64)
	fmt.Println(transID)
	if err != nil {
		return constants.StatusBadRequest400(c, "invalid transaction id")
	}
	//make sure owner is deleting
	userID := c.Get("id").(uint)
	savedTransaction, err := storage.GetTransactionWithTransID(uint(transID))
	if err != nil {
		return constants.StatusBadRequest400(c, err.Error())
	}
	if savedTransaction.UserID != userID {
		return constants.StatusUnknownForbidden403(c, "unauthorized to delete transaction")
	}

	err = storage.DeleteTransaction(uint(transID))
	if err != nil {
		return constants.StatusInternalServerError500(c, err.Error())
	}

	return constants.StatusOK200(c, "transaction deleted successfully")
}
