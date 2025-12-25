// types/weather.types.ts

// Current Weather (Worker & Farmer)
export interface CurrentWeather {
  temperature: number;
  feelsLike?: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeedKmh: number;
  windDirection?: string;
  timestamp: string;
  // For farmer/admin responses we may include a top-level location
  location?: {
    name: string;
    latitude: number;
    longitude: number;
  };
}

// Worker specific response (includes location + forecast)
export interface WorkerWeatherResponse {
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
  current: CurrentWeather;
  forecast: Array<{
    time: string;
    temperature: number;
    condition: string;
  }>;
}

// Daily Forecast
export interface DailyForecast {
  days: Array<{
    date: string;
    dayOfWeek: string;
    minTemp: number;
    maxTemp: number;
    condition: string;
    icon: string;
    precipitationChance: number;
  }>;
}

// Hourly Forecast
export interface HourlyForecast {
  hours: Array<{
    time: string;
    temperature: number;
    condition: string;
  }>;
}

// Recommendations
export interface WeatherRecommendations {
  recommendations: Array<{
    type: string;
    priority: string;
    message: string;
  }>;
}

// Combined weather data for the page
export interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast;
  hourly: HourlyForecast;
  recommendations: WeatherRecommendations;
}