package main

import (
	"net/http"
	"wetBulb/controllers"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.SetTrustedProxies(nil)
	r.LoadHTMLGlob("./templates/*.html")
	// r.Static("/assets", "./assets")
	// r.StaticFile("/favicon.ico", "./resources/favicon.ico")
	api := r.Group("/api")
	api.GET("/wetBulb", controllers.GetWetBulbCurrent)
	api.GET("/forecast", controllers.GetForecast)
	api.GET("/location", controllers.GetLocation)
	r.StaticFS("/home", http.Dir("./assets"))
	// r.GET("/", func(c *gin.Context) {
	// 	c.HTML(http.StatusOK, "index.html", nil)
	// })
	r.Run()

}
