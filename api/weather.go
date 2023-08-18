package api

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func GetWeather(lat, long float64) (OpenMeteoResponse, error) {
	response, err := http.Get(fmt.Sprintf("https://api.open-meteo.com/v1/forecast?latitude=%v&longitude=%v&hourly=temperature_2m,relativehumidity_2m&forecast_days=2", lat, long))
	if err != nil {
		return OpenMeteoResponse{}, err
	}
	var data OpenMeteoResponse
	json.NewDecoder(response.Body).Decode(&data)
	return data, nil
}
