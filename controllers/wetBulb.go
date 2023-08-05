package controllers

import (
	"net/http"
	"strconv"
	"wetBulb/api"
	"wetBulb/utils"

	"github.com/gin-gonic/gin"
)

func GetForecast(c *gin.Context) {
	lat, err := strconv.ParseFloat(c.Query("lat"), 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, "missing lat")
		return
	}
	lon, err := strconv.ParseFloat(c.Query("lon"), 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, "missing lon")
		return
	}

	response, err := api.GetWeather(lat, lon)

	if err != nil {
		c.Status(http.StatusInternalServerError)
	}
	forecast := utils.AddWetbulb(response)
	utils.FormatDates(&forecast.Hourly.Time)
	c.JSON(http.StatusOK, forecast)

}
