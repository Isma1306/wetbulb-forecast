type ResultItem = {
  title: string,
  author_name: string[];

};

export type LocationResult = {
  name: string;
  latitude: number;
  longitude: number;
  country_code: string;
  country_id: string;
  country: string;


};

export interface Forecast {
  current_weather: CurrentWeather;
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: HourlyUnits;
  hourly: Hourly;
}
export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
}
export interface HourlyUnits {
  time: string;
  temperature_2m: string;
  relativehumidity_2m: string;
}
export interface Hourly {
  time?: (string)[] | null;
  temperature_2m?: (number)[] | null;
  relativehumidity_2m?: (number)[] | null;
  WetBulb2M?: (number)[] | null;
}



export async function searchLocations(query: string) {
  if (query.trim() === "") return [];
  const response = await fetch(
    `http://localhost:8080/api/location?q=${encodeURI(query)}`
  );
  const parsedResponse = await response.json();
  return parsedResponse.results as LocationResult[];
}


export async function getCurrentWeather(location: LocationResult) {
  const { latitude, longitude } = location;
  const response = await fetch(
    `http://localhost:8080/api/wetBulb/?lat=${encodeURI(String(latitude))}&lon=${encodeURI(String(longitude))}`
  );
  const parsedResults = await response.json();


  return parsedResults.toFixed(2) as number;
}

export async function getForecast(location: LocationResult) {
  const { latitude, longitude } = location;
  const response = await fetch(
    `http://localhost:8080/api/forecast/?lat=${encodeURI(String(latitude))}&lon=${encodeURI(String(longitude))}`
  );
  const results = await response.json();



  return results.hourly as Hourly;
}