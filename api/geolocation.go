package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
)

func GetLocation(location string) (LocationResponse, error) {
	response, err := http.Get(fmt.Sprintf("https://geocoding-api.open-meteo.com/v1/search?name=%v&count=10&language=en&format=json", url.QueryEscape(location)))
	if err != nil {
		return LocationResponse{}, err
	}
	var data LocationResponse
	err = json.NewDecoder(response.Body).Decode(&data)
	if err != nil {
		return LocationResponse{}, err
	}
	return data, nil
}
