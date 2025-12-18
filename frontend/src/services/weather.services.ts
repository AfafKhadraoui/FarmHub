// services/weather.service.ts

import api from "@/lib/api";
import {
  CurrentWeather,
  DailyForecast,
  HourlyForecast,
  WeatherRecommendations,
  WorkerWeatherResponse,
} from "@/types/weather.types";

export const weatherService = {
  /**
   * Get current weather
   */
  getCurrentWeather: async (
    latitude?: number,
    longitude?: number
  ): Promise<CurrentWeather | WorkerWeatherResponse> => {
    try {
      const params = new URLSearchParams();
      if (latitude && longitude) {
        params.append("latitude", latitude.toString());
        params.append("longitude", longitude.toString());
      }

      const response = await api.get(
        `/weather/current${params.toString() ? `?${params.toString()}` : ""}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching current weather:", error);
      throw error;
    }
  },

  /**
   * Get 7-day forecast 
   */
  getDailyForecast: async (): Promise<DailyForecast> => {
    try {
      const response = await api.get("/weather/forecast/daily");
      return response.data;
    } catch (error) {
      console.error("Error fetching daily forecast:", error);
      throw error;
    }
  },

  /**
   * Get 24-hour forecast 
   */
  getHourlyForecast: async (): Promise<HourlyForecast> => {
    try {
      const response = await api.get("/weather/forecast/hourly");
      return response.data;
    } catch (error) {
      console.error("Error fetching hourly forecast:", error);
      throw error;
    }
  },

  /**
   * Get farming recommendations 
   */
  getRecommendations: async (): Promise<WeatherRecommendations> => {
    try {
      const response = await api.get("/weather/recommendations");
      return response.data;
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      throw error;
    }
  },
};