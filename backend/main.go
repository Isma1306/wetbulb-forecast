package main

import (
	"wetBulb/controllers"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.SetTrustedProxies(nil)
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"https://wetbulb-8f6k.onrender.com"}
	// config.AllowOrigins = []string{"*"}
	config.AllowMethods = []string{"GET"}
	config.AllowHeaders = []string{"*"}
	// r.Use(cors.New(config))
	r.Use(gzip.Gzip(gzip.DefaultCompression))
	// r.GET("/", func(c *gin.Context) {
	// 	c.Request.URL.Path = "/home"
	// 	r.HandleContext(c)
	// })
	api := r.Group("/api")
	api.Use(cors.New(config))
	api.GET("/forecast", controllers.GetForecast)
	api.GET("/location", controllers.GetLocation)
	// r.StaticFS("/home", http.Dir("./public"))
	r.Run()

}
