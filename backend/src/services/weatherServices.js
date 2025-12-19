const axios = require("axios");
const NodeCache = require("node-cache");
const weatherCache = new NodeCache({ stdTTL: 900 });

// Open-Meteo Base URLs
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";
const GEO_API = "https://geocoding-api.open-meteo.com/v1/search";

// --- HELPER: Map WMO Codes to String/Icons ---
// Open-Meteo uses WMO codes: https://open-meteo.com/en/docs
const mapWmoCode = (code) => {
  if (code === 0) return { condition: "Clear", icon: "sunny" };
  if (code >= 1 && code <= 3)
    return { condition: "Partly Cloudy", icon: "partly_cloudy" };
  if (code === 45 || code === 48) return { condition: "Foggy", icon: "cloudy" };
  if (code >= 51 && code <= 67) return { condition: "Rain", icon: "rainy" };
  if (code >= 71 && code <= 77) return { condition: "Snow", icon: "snowy" };
  if (code >= 80 && code <= 82)
    return { condition: "Heavy Rain", icon: "rainy" };
  if (code >= 95) return { condition: "Thunderstorm", icon: "storm" };
  return { condition: "Unknown", icon: "cloudy" };
};

const weatherService = {
  // 1. HELPER: Convert City Name -> Lat/Lon
  async getCoordinates(city) {
    const cacheKey = `geo_${city}`;
    if (weatherCache.has(cacheKey)) return weatherCache.get(cacheKey);

    try {
      // Fetch lat/lon for the city
      const response = await axios.get(
        `${GEO_API}?name=${city}&count=1&language=en&format=json`
      );

      if (!response.data.results || response.data.results.length === 0) {
        throw new Error(`Location '${city}' not found`);
      }

      const { latitude, longitude, name } = response.data.results[0];
      const result = { latitude, longitude, name };

      // Cache coordinates forever (cities don't move)
      weatherCache.set(cacheKey, result, 0);
      return result;
    } catch (error) {
      console.error("Geocoding Error:", error.message);
      throw new Error("Failed to find location coordinates");
    }
  },

  // 2. Fetch Weather Data (The Heavy Lifter)
  async getWeatherData(lat, lon) {
    const cacheKey = `weather_${lat}_${lon}`;
    if (weatherCache.has(cacheKey)) return weatherCache.get(cacheKey);

    // Requesting Current, Hourly (24h), and Daily (7d) in one go
    const url = `${WEATHER_API}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

    try {
      const response = await axios.get(url);
      weatherCache.set(cacheKey, response.data);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch weather data from Open-Meteo");
    }
  },

  // --- MAPPERS (Transform Open-Meteo JSON to Your App's JSON) ---

  // For Worker (Snapshot)
  formatForWorker(data, locationName) {
    const current = data.current;
    const wmo = mapWmoCode(current.weather_code);

    return {
      location: {
        name: locationName,
        latitude: data.latitude,
        longitude: data.longitude,
      },
      current: {
        temperature: Math.round(current.temperature_2m),
        condition: wmo.condition,
        icon: wmo.icon,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        timestamp: current.time,
      },
      // Next 6 hours forecast
      forecast: data.hourly.time.slice(0, 6).map((time, index) => ({
        time: time,
        temperature: Math.round(data.hourly.temperature_2m[index]),
        condition: mapWmoCode(data.hourly.weather_code[index]).condition,
      })),
    };
  },

  // For Farmer (Current)
  formatForFarmerCurrent(data, location) {
    const current = data.current;
    const wmo = mapWmoCode(current.weather_code);

    return {
      location: location
        ? {
            name: location.name,
            latitude: location.latitude,
            longitude: location.longitude,
          }
        : undefined,
      temperature: Math.round(current.temperature_2m),
      condition: wmo.condition,
      icon: wmo.icon,
      humidity: current.relative_humidity_2m,
      windSpeedKmh: current.wind_speed_10m,
      timestamp: current.time,
    };
  },

  // For Farmer (Daily)
  formatForFarmerDaily(data) {
    return {
      days: data.daily.time.map((date, index) => {
        const wmo = mapWmoCode(data.daily.weather_code[index]);
        return {
          date: date,
          dayOfWeek: new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
          }),
          minTemp: Math.round(data.daily.temperature_2m_min[index]),
          maxTemp: Math.round(data.daily.temperature_2m_max[index]),
          condition: wmo.condition,
          icon: wmo.icon,
          precipitationChance:
            data.daily.precipitation_probability_max[index] || 0,
        };
      }),
    };
  },

  // For Farmer (Hourly)
  formatForFarmerHourly(data) {
    // Get next 24 hours
    const currentHourIndex = new Date().getHours();

    return {
      hours: data.hourly.time
        .slice(currentHourIndex, currentHourIndex + 24)
        .map((time, index) => {
          // Adjust index to match sliced time
          const realIndex = currentHourIndex + index;
          const wmo = mapWmoCode(data.hourly.weather_code[realIndex]);
          return {
            time: time,
            temperature: Math.round(data.hourly.temperature_2m[realIndex]),
            condition: wmo.condition,
          };
        }),
    };
  },

  generateRecommendations(data) {
    const recs = [];
    const maxTemp = data.daily.temperature_2m_max[0];
    const rainChance = data.daily.precipitation_probability_max[0];

    if (maxTemp > 30) {
      recs.push({
        type: "irrigation",
        priority: "high",
        message: "Heatwave warning. Increase irrigation.",
      });
    }
    if (rainChance > 50) {
      recs.push({
        type: "planning",
        priority: "medium",
        message: "Rain expected today. Delay pesticide spraying.",
      });
    } else {
      recs.push({
        type: "irrigation",
        priority: "low",
        message: "No rain expected. Standard irrigation schedule.",
      });
    }

    return { recommendations: recs };
  },
};

module.exports = weatherService;