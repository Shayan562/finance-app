package handlers

import (
	"finance-app/cmd/models"
	"finance-app/cmd/service"
	"finance-app/cmd/storage"
	"finance-app/constants"
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
)

// get all tags(no filter). 1 filter 'type' (income and expense)
func GetTags(c echo.Context) error {
	tagType := c.QueryParam("type")

	if tagType == "" { //get all the available tags
		tags, err := storage.GetTags()
		if err != nil {
			return constants.StatusInternalServerError500(c, err.Error())
		}
		return c.JSON(http.StatusOK, map[string]any{"tags": tags})
	}

	//get tags of a certain type only
	tagTypeCleaned, err := service.SanitizeAndCheckTransType(tagType)
	if err != nil {
		return constants.StatusBadRequest400(c, err.Error())
	}
	tags, err := storage.GetTagsWithType(tagTypeCleaned.String())
	if err != nil {
		return constants.StatusInternalServerError500(c, err.Error())
	}
	return c.JSON(http.StatusOK, map[string]any{"tags": *tags})
}

func NewTag(c echo.Context) error {
	tagInput := models.Tag{}
	err := c.Bind(&tagInput)
	if err != nil {
		c.Logger().Error(err)
		return constants.StatusBadRequest400(c, err.Error())
	}
	//check tag details
	if tagInput.TagName == "" {
		return constants.StatusBadRequest400(c, "missing tag name")
	}
	if tagInput.TagType == "" {
		return constants.StatusBadRequest400(c, "missing tag type")
	}

	tagInput.TagType, err = service.SanitizeAndCheckTransType(string(tagInput.TagType))
	if err != nil {
		return constants.StatusBadRequest400(c, err.Error())
	}

	tagInput.TagName = strings.ToLower(tagInput.TagName)
	tagInput.TagName = strings.Title(tagInput.TagName)
	// //check if that tag already exists
	// currTag := "(?i)" + regexp.QuoteMeta(tagInput.TagName)
	// existingTags, err := storage.GetTags()
	// for _, t := range *existingTags {

	// }

	//if the tag does not already exist
	err = storage.InsertTag(&tagInput)
	if err != nil {
		return constants.StatusInternalServerError500(c, err.Error())
	}

	return constants.StatusCreated201(c, "tag created successfully")

}
