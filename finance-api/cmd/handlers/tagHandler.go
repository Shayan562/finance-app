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

func GetAllTags(c echo.Context) error {
	tags, err := storage.GetTags()
	if err != nil {
		return constants.StatusInternalServerError500(c, err.Error())
	}
	// fmt.Println((*tags)[0])
	return c.JSON(http.StatusOK, *tags)

}

func GetTags(c echo.Context) error {
	category := c.Param("type")
	tagType, err := service.SanitizeAndCheckTransType(category)
	if err != nil {
		return constants.StatusBadRequest400(c, err.Error())
	}

	tags, err := storage.GetTagsWithType(tagType.String())
	if err != nil {
		return constants.StatusInternalServerError500(c, err.Error())
	}
	return c.JSON(http.StatusOK, *tags)

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
