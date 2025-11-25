export interface Weather {
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  location: string;
}

export interface Forecast {
  date: string;
  temperature: number;
  condition: string;
}
