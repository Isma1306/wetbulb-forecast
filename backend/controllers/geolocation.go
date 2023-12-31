package controllers

import (
	"net/http"
	"wetBulb/api"

	"github.com/gin-gonic/gin"
)

func GetLocation(c *gin.Context) {
	location := c.Query("q")
	if location == "" {
		c.JSON(http.StatusBadRequest, "no location requested")
		return
	}

	response, err := api.GetLocation(location)
	if err != nil {
		c.Status(http.StatusInternalServerError)
	}

	c.Status(http.StatusAccepted)
	c.JSON(200, response)

}
