"use client";

import { MapPin, CheckCircle, AlertCircle, Calendar } from "lucide-react";
import React, { useState } from "react";

// Mock data matching API responses
const mockCurrentWeather = {
  temperature: 28,
  feelsLike: 30,
  condition: "Sunny",
  icon: "sunny",
  humidity: 45,
  windSpeedKmh: 12,
  windDirection: "NE",
  uvIndex: 7,
  uvLevel: "high",
  timestamp: "2025-11-27T12:46:00.000Z",
};

const mockDailyForecast = {
  days: [
    {
      date: "2025-11-27",
      dayOfWeek: "Thursday",
      minTemp: 15,
      maxTemp: 28,
      condition: "Sunny",
      icon: "sunny",
      precipitationChance: 0,
    },
    {
      date: "2025-11-28",
      dayOfWeek: "Friday",
      minTemp: 14,
      maxTemp: 25,
      condition: "Partly Cloudy",
      icon: "partly_cloudy",
      precipitationChance: 10,
    },
    {
      date: "2025-11-29",
      dayOfWeek: "Saturday",
      minTemp: 16,
      maxTemp: 22,
      condition: "Rainy",
      icon: "rainy",
      precipitationChance: 80,
    },
    {
      date: "2025-11-30",
      dayOfWeek: "Sunday",
      minTemp: 15,
      maxTemp: 27,
      condition: "Sunny",
      icon: "sunny",
      precipitationChance: 0,
    },
    {
      date: "2025-12-01",
      dayOfWeek: "Monday",
      minTemp: 16,
      maxTemp: 26,
      condition: "Partly Cloudy",
      icon: "partly_cloudy",
      precipitationChance: 15,
    },
    {
      date: "2025-12-02",
      dayOfWeek: "Tuesday",
      minTemp: 17,
      maxTemp: 29,
      condition: "Sunny",
      icon: "sunny",
      precipitationChance: 5,
    },
    {
      date: "2025-12-03",
      dayOfWeek: "Wednesday",
      minTemp: 18,
      maxTemp: 30,
      condition: "Sunny",
      icon: "sunny",
      precipitationChance: 0,
    },
  ],
};

const mockHourlyForecast = {
  hours: [
    { time: "2025-11-27T12:00:00.000Z", temperature: 28, condition: "Sunny" },
    { time: "2025-11-27T13:00:00.000Z", temperature: 29, condition: "Sunny" },
    { time: "2025-11-27T14:00:00.000Z", temperature: 29, condition: "Sunny" },
    { time: "2025-11-27T15:00:00.000Z", temperature: 28, condition: "Sunny" },
    { time: "2025-11-27T16:00:00.000Z", temperature: 27, condition: "Sunny" },
    { time: "2025-11-27T17:00:00.000Z", temperature: 26, condition: "Sunny" },
    { time: "2025-11-27T18:00:00.000Z", temperature: 25, condition: "Clear" },
    { time: "2025-11-27T19:00:00.000Z", temperature: 24, condition: "Clear" },
    { time: "2025-11-27T20:00:00.000Z", temperature: 23, condition: "Clear" },
    { time: "2025-11-27T21:00:00.000Z", temperature: 22, condition: "Clear" },
    { time: "2025-11-27T22:00:00.000Z", temperature: 21, condition: "Clear" },
    { time: "2025-11-27T23:00:00.000Z", temperature: 20, condition: "Clear" },
    { time: "2025-11-28T00:00:00.000Z", temperature: 19, condition: "Clear" },
    { time: "2025-11-28T01:00:00.000Z", temperature: 18, condition: "Clear" },
    { time: "2025-11-28T02:00:00.000Z", temperature: 17, condition: "Clear" },
    { time: "2025-11-28T03:00:00.000Z", temperature: 17, condition: "Clear" },
    { time: "2025-11-28T04:00:00.000Z", temperature: 16, condition: "Clear" },
    { time: "2025-11-28T05:00:00.000Z", temperature: 16, condition: "Clear" },
    { time: "2025-11-28T06:00:00.000Z", temperature: 17, condition: "Sunny" },
    { time: "2025-11-28T07:00:00.000Z", temperature: 19, condition: "Sunny" },
    { time: "2025-11-28T08:00:00.000Z", temperature: 21, condition: "Sunny" },
    { time: "2025-11-28T09:00:00.000Z", temperature: 23, condition: "Sunny" },
    { time: "2025-11-28T10:00:00.000Z", temperature: 25, condition: "Sunny" },
    { time: "2025-11-28T11:00:00.000Z", temperature: 26, condition: "Sunny" },
  ],
};

const mockRecommendations = {
  recommendations: [
    {
      type: "irrigation",
      priority: "medium",
      message: "Good day for irrigation",
    },
    {
      type: "safety",
      priority: "high",
      message: "High UV - protect workers with hats and sunscreen",
    },
    {
      type: "planning",
      priority: "medium",
      message: "Rain expected Wednesday - plan harvesting accordingly",
    },
  ],
};

export default function WeatherPage() {
  const [currentWeather] = useState(mockCurrentWeather);
  const [dailyForecast] = useState(mockDailyForecast);
  const [hourlyForecast] = useState(mockHourlyForecast);
  const [recommendations] = useState(mockRecommendations);

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

  // Get UV level color
  const getUVColor = (level: string) => {
    const colorMap: { [key: string]: string } = {
      low: "#4CAF50",
      moderate: "#FFC107",
      high: "#FF9800",
      "very high": "#F44336",
      extreme: "#9C27B0",
    };
    return colorMap[level.toLowerCase()] || "#FF9800";
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
            <span className="font-medium text-[#1F2937]">Algiers</span>
          </div>
        </div>
      </div>

      {/* Current Weather Card */}
      <div className="mb-8 bg-white border border-[#E5E7EB] rounded-2xl p-12 shadow-sm text-center">
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

        <div className="grid grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div>
            <div className="text-[#9CA3AF] mb-1">Feels like:</div>
            <div className="text-[#1F2937] font-semibold">
              {currentWeather.feelsLike}°C
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
              {currentWeather.windSpeedKmh} km/h {currentWeather.windDirection}
            </div>
          </div>
          <div>
            <div className="text-[#9CA3AF] mb-1">UV Index:</div>
            <div
              className="font-semibold"
              style={{ color: getUVColor(currentWeather.uvLevel) }}
            >
              {currentWeather.uvIndex} (
              {currentWeather.uvLevel.charAt(0).toUpperCase() +
                currentWeather.uvLevel.slice(1)}
              )
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
          <div className="flex gap-4 overflow-x-auto">
            {dailyForecast.days.map((day, index) => (
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
          <HourlyChart hours={hourlyForecast.hours} />
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