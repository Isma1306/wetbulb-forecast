package utils

import (
	"math"
	"wetBulb/api"
)

func CalcWetBulb(temp, hum float64) float64 {
	first := temp * math.Atan(0.151977*math.Pow((hum+8.313659), 0.5))
	second := math.Atan(temp + hum)
	third := math.Atan(hum - 1.676331)
	fourth := 0.00391838 * math.Pow(math.Pow(hum, 3), 0.5) * math.Atan(0.023101*hum)
	return first + second - third + fourth - 4.686035
}

func AddWetbulb(forecast api.OpenMeteoResponse) api.OpenMeteoResponse {
	length := len(forecast.Hourly.Temperature2M)
	wetBulb2m := []float64{}
	for i := 0; i < length; i++ {
		wetBulb2m = append(wetBulb2m, CalcWetBulb(forecast.Hourly.Temperature2M[i], forecast.Hourly.Relativehumidity2M[i]))
	}
	forecast.Hourly.WetBulb2M = wetBulb2m
	return forecast
}
