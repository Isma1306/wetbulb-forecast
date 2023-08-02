package controllers

import (
	"net/http"
	"strconv"
	"wetBulb/api"
	"wetBulb/utils"

	"github.com/gin-gonic/gin"
)

func GetWetBulbCurrent(c *gin.Context) {
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
	wetBulb := utils.CalcWetBulb(response.Hourly.Temperature2M[0], response.Hourly.Relativehumidity2M[0])

	c.JSON(http.StatusOK, wetBulb)

}

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

	c.JSON(http.StatusOK, forecast)

	// line := utils.GenerateLineChart(forecast)

	// line.Render(c.Writer)

}
