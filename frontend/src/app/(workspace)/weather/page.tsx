"use client";

import { MapPin, CheckCircle, AlertCircle, Calendar } from "lucide-react";
import React from "react";
import { useWeather } from "@/hooks/useWeather";
import { CurrentWeather, WorkerWeatherResponse } from "@/types/weather.types";

export default function WeatherPage() {
  // Fetch all weather data using the combined hook
  const { current, daily, hourly, recommendations, loading, error } =
    useWeather();

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50] mx-auto mb-4"></div>
          <p className="text-[#6B7280]">Loading weather data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="text-red-500 mx-auto mb-3" size={48} />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Failed to Load Weather
          </h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Worker responses include a nested `current` and a top-level `location`.
  // Farmer/admin responses return the current fields at the top-level (may also include a top-level `location`).
  const isWorkerWeather = (weather: any): weather is WorkerWeatherResponse => {
    return (
      weather &&
      typeof weather === "object" &&
      "current" in weather &&
      "location" in weather
    );
  };

  // Extract current weather data (handle both worker and farmer formats)
  const currentWeather = isWorkerWeather(current)
    ? current.current
    : (current as CurrentWeather | null);

  // Get location name (prefer worker.location, else farmer top-level location)
  const locationName = isWorkerWeather(current)
    ? current.location.name
    : current && (current as any).location
    ? (current as any).location.name
    : "Farm Location";

  // Get weather icon emoji
  const getWeatherIcon = (icon: string) => {
    const iconMap: { [key: string]: string } = {
      sunny: "☀️",
      partly_cloudy: "⛅",
      cloudy: "☁️",
      rainy: "🌧️",
      stormy: "⛈️",
      snowy: "❄️",
      clear: "🌙",
    };
    return iconMap[icon] || "☀️";
  };

  // Get recommendation icon and color
  const getRecommendationStyle = (type: string, priority: string) => {
    if (priority === "high") {
      return {
        icon: AlertCircle,
        bgColor: "#FFF3E0",
        iconColor: "#FF9800",
      };
    }
    if (type === "irrigation") {
      return {
        icon: CheckCircle,
        bgColor: "#E8F5E9",
        iconColor: "#4CAF50",
      };
    }
    return {
      icon: Calendar,
      bgColor: "#E3F2FD",
      iconColor: "#2196F3",
    };
  };

  // Format day name
  const formatDayName = (dayOfWeek: string) => {
    return dayOfWeek.substring(0, 3);
  };

  // If no data available
  if (!currentWeather || !daily || !hourly || !recommendations) {
    return (
      <div className="text-center py-12">
        <p className="text-[#6B7280]">No weather data available</p>
      </div>
    );
  }

  return (
    <>
      {/* Weather Page Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          {/* Left - Title Section */}
          <div>
            <h1
              className="font-bold text-[#1F2937]"
              style={{ fontFamily: "Poppins, sans-serif", fontSize: "30px" }}
            >
              Weather
            </h1>
            <p className="mt-2 text-[#6B7280]">
              Real-time weather for your farm
            </p>
          </div>

          {/* Right - Location Badge */}
          <div className="flex items-center gap-2 bg-[#F9FAFB] border border-[#E5E7EB] px-5 py-2.5 rounded-lg">
            <MapPin size={20} className="text-[#6B7280]" />
            <span className="font-medium text-[#1F2937]">{locationName}</span>
          </div>
        </div>
      </div>

      {/* Current Weather Card */}
      <div className="mb-8 bg-white border border-[#E5E7EB] rounded-2xl p-12 shadow-sm  text-center ">
        <div className="text-[120px] mb-6">
          {getWeatherIcon(currentWeather.icon)}
        </div>

        <div
          className="font-bold text-[#1F2937] mb-3"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "64px",
            lineHeight: "1",
          }}
        >
          {currentWeather.temperature}°C
        </div>

        <div className="font-semibold text-[#6B7280] text-[24px] mb-8">
          {currentWeather.condition}
        </div>

        <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div>
            <div className="text-[#9CA3AF] mb-1">Feels like:</div>
            <div className="text-[#1F2937] font-semibold">
              {currentWeather.feelsLike || currentWeather.temperature}°C
            </div>
          </div>
          <div>
            <div className="text-[#9CA3AF] mb-1">Humidity:</div>
            <div className="text-[#1F2937] font-semibold">
              {currentWeather.humidity}%
            </div>
          </div>
          <div>
            <div className="text-[#9CA3AF] mb-1">Wind:</div>
            <div className="text-[#1F2937] font-semibold">
              {currentWeather.windSpeedKmh} km/h{" "}
              {currentWeather.windDirection || ""}
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="mb-8">
        <h2
          className="font-semibold text-[#1F2937] mb-5"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "20px" }}
        >
          7-Day Forecast
        </h2>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
          <div className="flex justify-center gap-4 overflow-x-auto">
            {daily.days.map((day, index) => (
              <DayCard
                key={index}
                day={formatDayName(day.dayOfWeek)}
                icon={getWeatherIcon(day.icon)}
                high={`${day.maxTemp}°C`}
                low={`${day.minTemp}°C`}
                precipChance={day.precipitationChance}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Farming Recommendations */}
      <div className="mb-8">
        <h2
          className="font-semibold text-[#1F2937] mb-5"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "20px" }}
        >
          Farming Recommendations
        </h2>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
          {recommendations.recommendations.map((rec, index) => {
            const style = getRecommendationStyle(rec.type, rec.priority);
            const Icon = style.icon;

            return (
              <div key={index} className="flex items-center gap-3 py-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: style.bgColor }}
                >
                  <Icon size={24} style={{ color: style.iconColor }} />
                </div>
                <p className="text-[#374151]">{rec.message}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hourly Forecast */}
      <div className="mb-8">
        <h2
          className="font-semibold text-[#1F2937] mb-5"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "20px" }}
        >
          Hourly Forecast (24 hours)
        </h2>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
          <HourlyChart hours={hourly.hours} />
        </div>
      </div>
    </>
  );
}

interface DayCardProps {
  day: string;
  icon: string;
  high: string;
  low: string;
  precipChance?: number;
}

function DayCard({ day, icon, high, low, precipChance }: DayCardProps) {
  return (
    <div className="min-w-[140px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-5 text-center">
      <div className="font-semibold text-[#1F2937] mb-3">{day}</div>
      <div className="text-[48px] mb-3">{icon}</div>
      <div className="font-bold text-[#1F2937] text-[20px]">{high}</div>
      <div className="text-[#6B7280] mt-1">{low}</div>
      {precipChance !== undefined && precipChance > 0 && (
        <div className="text-[#3B82F6] text-[12px] mt-2">
          💧 {precipChance}%
        </div>
      )}
    </div>
  );
}

interface HourlyChartProps {
  hours: Array<{
    time: string;
    temperature: number;
    condition: string;
  }>;
}

function HourlyChart({ hours }: HourlyChartProps) {
  // Find min and max temperatures for scaling
  const temps = hours.map((h) => h.temperature);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = maxTemp - minTemp;

  // Chart dimensions
  const chartHeight = 200;
  const chartPadding = 30;
  const usableHeight = chartHeight - chartPadding * 2;

  // Calculate points for the line
  const points = hours.map((hour, index) => {
    const x = (index / (hours.length - 1)) * 100;
    const normalizedTemp = (hour.temperature - minTemp) / (tempRange || 1);
    const y = chartPadding + usableHeight * (1 - normalizedTemp);
    return { x, y, temp: hour.temperature, time: hour.time };
  });

  // Create SVG path
  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  // Create area path (for gradient fill)
  const areaD =
    pathD +
    ` L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

  return (
    <div className="relative">
      {/* SVG Chart */}
      <svg
        viewBox="0 0 100 200"
        preserveAspectRatio="none"
        className="w-full"
        style={{ height: `${chartHeight}px` }}
      >
        {/* Gradient definition */}
        <defs>
          <linearGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#4CAF50" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path d={areaD} fill="url(#tempGradient)" />

        {/* Temperature line */}
        <path
          d={pathD}
          fill="none"
          stroke="#4CAF50"
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />

        {/* Data points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="0.8"
            fill="#4CAF50"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      {/* Time labels and temperatures */}
      <div className="flex justify-between mt-4 px-2">
        {hours
          .filter((_, index) => index % 3 === 0)
          .map((hour, index) => {
            const date = new Date(hour.time);
            const timeStr = date.toLocaleTimeString("en-US", {
              hour: "numeric",
              hour12: true,
            });

            return (
              <div key={index} className="text-center">
                <div className="text-[#1F2937] font-semibold text-[14px] mb-1">
                  {hour.temperature}°
                </div>
                <div className="text-[#9CA3AF] text-[12px]">{timeStr}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
}