package api

type LocationResponse struct {
	Results          []Results `json:"results,omitempty"`
	GenerationtimeMs float64   `json:"generationtime_ms,omitempty"`
}
type Results struct {
	ID          int      `json:"id,omitempty"`
	Name        string   `json:"name,omitempty"`
	Latitude    float64  `json:"latitude,omitempty"`
	Longitude   float64  `json:"longitude,omitempty"`
	Elevation   float64  `json:"elevation,omitempty"`
	FeatureCode string   `json:"feature_code,omitempty"`
	CountryCode string   `json:"country_code,omitempty"`
	Admin1ID    int      `json:"admin1_id,omitempty"`
	Admin3ID    int      `json:"admin3_id,omitempty"`
	Admin4ID    int      `json:"admin4_id,omitempty"`
	Timezone    string   `json:"timezone,omitempty"`
	Population  int      `json:"population,omitempty"`
	Postcodes   []string `json:"postcodes,omitempty"`
	CountryID   int      `json:"country_id,omitempty"`
	Country     string   `json:"country,omitempty"`
	Admin1      string   `json:"admin1,omitempty"`
	Admin3      string   `json:"admin3,omitempty"`
	Admin4      string   `json:"admin4,omitempty"`
	Admin2ID    int      `json:"admin2_id,omitempty"`
	Admin2      string   `json:"admin2,omitempty"`
}
