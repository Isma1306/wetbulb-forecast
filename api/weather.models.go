package api

type WeatherResponse struct {
	Type     string   `json:"type"`
	Geometry Geometry `json:"geometry"`
}
type Geometry struct {
	Type        string    `json:"type"`
	Coordinates []float64 `json:"coordinates"`
}

type CurrentWeather struct {
	Temperature   float64 `json:"temperature"`
	Windspeed     float64 `json:"windspeed"`
	Winddirection float64 `json:"winddirection"`
	Weathercode   int     `json:"weathercode"`
	IsDay         int     `json:"is_day"`
	Time          string  `json:"time"`
}

type OpenMeteoResponse struct {
	CurrentWeather       CurrentWeather `json:"current_weather"`
	Latitude             float64        `json:"latitude"`
	Longitude            float64        `json:"longitude"`
	GenerationtimeMs     float64        `json:"generationtime_ms"`
	UtcOffsetSeconds     int            `json:"utc_offset_seconds"`
	Timezone             string         `json:"timezone"`
	TimezoneAbbreviation string         `json:"timezone_abbreviation"`
	Elevation            float64        `json:"elevation"`
	HourlyUnits          struct {
		Time               string `json:"time"`
		Temperature2M      string `json:"temperature_2m"`
		Relativehumidity2M string `json:"relativehumidity_2m"`
	} `json:"hourly_units"`
	Hourly struct {
		Time               []string  `json:"time"`
		Temperature2M      []float64 `json:"temperature_2m"`
		Relativehumidity2M []float64 `json:"relativehumidity_2m"`
		WetBulb2M          []float64
	} `json:"hourly"`
}
