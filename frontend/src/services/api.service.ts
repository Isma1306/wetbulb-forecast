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
  admin1?: string;
  admin2?: string;
  admin3?: string;


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
  time: string[];
  date: Date[];
  temperature_2m: (number)[];
  relativehumidity_2m: (number)[];
  WetBulb2M: (number)[];
}



export async function searchLocations(query: string) {
  if (query.trim() === "") return [];
  const response = await fetch(
    `/api/location?q=${encodeURI(query.trim())}`
  );
  const parsedResponse = await response.json();
  return parsedResponse.results as LocationResult[];
}


export async function getForecast(location: LocationResult) {
  const { latitude, longitude } = location;
  const response = await fetch(
    `/api/forecast/?lat=${encodeURI(String(latitude))}&lon=${encodeURI(String(longitude))}`
  );
  const results = await response.json() as Forecast;

  results.hourly.date = results.hourly.time?.map(time => {
    const date = new Date(time);
    return date;
  });

  return results.hourly;
}