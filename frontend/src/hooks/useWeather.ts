// hooks/useWeather.ts

import { useState, useEffect } from "react";
import { weatherService } from "@/services/weather.services";
import {
  CurrentWeather,
  DailyForecast,
  HourlyForecast,
  WeatherRecommendations,
  WorkerWeatherResponse,
} from "@/types/weather.types";

/**
 * Hook to fetch current weather
 */
export function useCurrentWeather(latitude?: number, longitude?: number) {
  const [weather, setWeather] = useState<
    CurrentWeather | WorkerWeatherResponse | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true);
        setError(null);
        const data = await weatherService.getCurrentWeather(
          latitude,
          longitude
        );
        setWeather(data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch weather");
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [latitude, longitude]);

  return { weather, loading, error };
}

/**
 * Hook to fetch daily forecast
 */
export function useDailyForecast() {
  const [forecast, setForecast] = useState<DailyForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchForecast() {
      try {
        setLoading(true);
        setError(null);
        const data = await weatherService.getDailyForecast();
        setForecast(data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch forecast");
      } finally {
        setLoading(false);
      }
    }

    fetchForecast();
  }, []);

  return { forecast, loading, error };
}

/**
 * Hook to fetch hourly forecast
 */
export function useHourlyForecast() {
  const [forecast, setForecast] = useState<HourlyForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchForecast() {
      try {
        setLoading(true);
        setError(null);
        const data = await weatherService.getHourlyForecast();
        setForecast(data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch forecast");
      } finally {
        setLoading(false);
      }
    }

    fetchForecast();
  }, []);

  return { forecast, loading, error };
}

/**
 * Hook to fetch recommendations
 */
export function useRecommendations() {
  const [recommendations, setRecommendations] =
    useState<WeatherRecommendations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setLoading(true);
        setError(null);
        const data = await weatherService.getRecommendations();
        setRecommendations(data);
      } catch (err: any) {
        setError(
          err.response?.data?.error || "Failed to fetch recommendations"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  return { recommendations, loading, error };
}

/**
 * Combined hook to fetch all weather data at once
 * Use this for the main weather page
 */
export function useWeather() {
  const currentWeather = useCurrentWeather();
  const dailyForecast = useDailyForecast();
  const hourlyForecast = useHourlyForecast();
  const recommendations = useRecommendations();

  const loading =
    currentWeather.loading ||
    dailyForecast.loading ||
    hourlyForecast.loading ||
    recommendations.loading;

  const error =
    currentWeather.error ||
    dailyForecast.error ||
    hourlyForecast.error ||
    recommendations.error;

  return {
    current: currentWeather.weather,
    daily: dailyForecast.forecast,
    hourly: hourlyForecast.forecast,
    recommendations: recommendations.recommendations,
    loading,
    error,
  };
}
