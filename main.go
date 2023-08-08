package main

import (
	"net/http"
	"wetBulb/controllers"

	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.SetTrustedProxies(nil)

	r.Use(gzip.Gzip(gzip.DefaultCompression))
	r.GET("/", func(c *gin.Context) {
		c.Request.URL.Path = "/home"
		r.HandleContext(c)
	})
	api := r.Group("/api")
	api.GET("/forecast", controllers.GetForecast)
	api.GET("/location", controllers.GetLocation)
	r.StaticFS("/home", http.Dir("./public"))
	r.Run()

}
