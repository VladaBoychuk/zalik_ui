export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface WeatherWind {
  speed: number;
  deg: number;
  gust?: number;
}

export interface WeatherSys {
  country: string;
  sunrise: number;
  sunset: number;
}

export interface WeatherCoord {
  lon: number;
  lat: number;
}

export interface WeatherData {
  id: number;
  name: string;
  coord: WeatherCoord;
  weather: WeatherCondition[];
  main: WeatherMain;
  wind: WeatherWind;
  sys: WeatherSys;
  visibility: number;
  dt: number;
  timezone: number;
  cod: number;
}

export interface GeoLocation {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export type WeatherType = 'clear' | 'clouds' | 'rain' | 'snow' | 'thunder' | 'mist' | 'default';
