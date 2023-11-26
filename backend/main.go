package main

import (
	"log"
	"os"
	"wetBulb/controllers"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.SetTrustedProxies(nil)
	FEURL := os.Getenv("FEURL")
	if FEURL == "" {
		log.Fatal("missing enviroment variables!")
	}
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{FEURL}
	config.AllowMethods = []string{"GET"}
	config.AllowHeaders = []string{"*"}
	r.Use(gzip.Gzip(gzip.DefaultCompression))

	api := r.Group("/api")
	api.Use(cors.New(config))
	api.GET("/forecast", controllers.GetForecast)
	api.GET("/location", controllers.GetLocation)

	r.Run()

}
