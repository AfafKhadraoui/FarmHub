"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Activity, MapPin, RefreshCw } from "lucide-react";
import CustomSelect from "./CustomSelect";
import { useAnalytics } from "@/hooks/useAnalytics";

function TimeRangeSelector() {
  const [timeRange, setTimeRange] = useState("30");

  return (
    <CustomSelect
      value={timeRange}
      onChange={setTimeRange}
      options={[
        { value: "7", label: "Last 7 Days" },
        { value: "30", label: "Last 30 Days" },
        { value: "90", label: "Last 90 Days" },
        { value: "365", label: "Last Year" },
      ]}
      placeholder="Last 30 Days"
    />
  );
}

export default function AnalyticsPage() {
  const { analytics, metrics, loading, error, refetch } = useAnalytics();

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="animate-spin h-8 w-8 text-[var(--admin-primary)] mx-auto mb-4" />
          <p className="text-[var(--admin-text-muted)]">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-[var(--admin-primary)] text-white rounded-lg hover:opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No data available
  if (!analytics || !metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-[var(--admin-text-muted)]">No analytics data available</p>
      </div>
    );
  }

  // Calculate growth percentages (you can enhance this logic)
  const calculateGrowth = (data: Array<{ month: string; users?: number; tasks?: number }>) => {
    if (data.length < 2) return 0;
    const current = data[data.length - 1];
    const previous = data[data.length - 2];
    const currentValue = (current.users || current.tasks) || 0;
    const previousValue = (previous.users || previous.tasks) || 0;
    if (previousValue === 0) return 0;
    return (((currentValue - previousValue) / previousValue) * 100).toFixed(1);
  };

  const userGrowthPercent = parseFloat(calculateGrowth(analytics.userGrowth) as string);
  const taskGrowthPercent = parseFloat(calculateGrowth(analytics.taskVolume) as string);

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2
            className="text-[var(--admin-text-dark)] text-2xl mb-1"
            style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}
          >
            Platform Analytics
          </h2>
          <p
            className="text-[var(--admin-text-muted)]"
            style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}
          >
            Comprehensive insights and metrics
          </p>
        </div>
        <button
          onClick={refetch}
          className="flex items-center gap-2 px-4 py-2 border border-[var(--admin-border)] rounded-lg hover:bg-gray-50"
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6">
        <TimeRangeSelector />
      </div>

      {/* Top Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* User Growth Chart */}
        <div
          className="bg-white border border-[var(--admin-border)] rounded-2xl p-6"
          style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-[var(--admin-text-dark)] text-lg"
              style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}
            >
              User Growth
            </h3>
            <div className="flex items-center gap-2 text-[var(--admin-primary)]">
              <TrendingUp size={18} />
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                {userGrowthPercent > 0 ? '+' : ''}{userGrowthPercent}%
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analytics.userGrowth}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--admin-border)"
              />
              <XAxis
                dataKey="month"
                stroke="var(--admin-text-muted)"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "12px" }}
              />
              <YAxis
                stroke="var(--admin-text-muted)"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "12px" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid var(--admin-border)",
                  borderRadius: "8px",
                  fontFamily: "Inter, sans-serif",
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="var(--admin-primary)"
                strokeWidth={3}
                dot={{ fill: "var(--admin-primary)", r: 4 }}
                activeDot={{
                  r: 6,
                  fill: "var(--admin-primary)",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Task Volume Chart */}
        <div
          className="bg-white border border-[var(--admin-border)] rounded-2xl p-6"
          style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-[var(--admin-text-dark)] text-lg"
              style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}
            >
              Task Volume
            </h3>
            <div className="flex items-center gap-2 text-[var(--admin-primary)]">
              <Activity size={18} />
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                {taskGrowthPercent > 0 ? '+' : ''}{taskGrowthPercent}%
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics.taskVolume}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--admin-border)"
              />
              <XAxis
                dataKey="month"
                stroke="var(--admin-text-muted)"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "12px" }}
              />
              <YAxis
                stroke="var(--admin-text-muted)"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "12px" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "none",
                  borderRadius: "12px",
                  fontFamily: "Inter, sans-serif",
                  boxShadow: "0px 8px 24px rgba(75, 175, 71, 0.15)",
                  padding: "12px 16px",
                }}
                cursor={{ fill: "rgba(75, 175, 71, 0.1)" }}
              />
              <Bar
                dataKey="tasks"
                fill="var(--admin-primary)"
                radius={[8, 8, 0, 0]}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Most Active Farms */}
      <div
        className="bg-white border border-[var(--admin-border)] rounded-2xl p-6 mb-6"
        style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
      >
        <h3
          className="text-[var(--admin-text-dark)] text-lg mb-6"
          style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}
        >
          Most Active Farms (Top 10)
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.activeFarms} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" />
            <XAxis
              type="number"
              stroke="var(--admin-text-muted)"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "12px" }}
            />
            <YAxis
              dataKey="farm"
              type="category"
              stroke="var(--admin-text-muted)"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "12px" }}
              width={120}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "none",
                borderRadius: "12px",
                fontFamily: "Inter, sans-serif",
                boxShadow: "0px 8px 24px rgba(255, 107, 0, 0.15)",
                padding: "12px 16px",
              }}
              cursor={{ fill: "rgba(255, 107, 0, 0.1)" }}
            />
            <Bar
              dataKey="tasks"
              fill="var(--admin-secondary)"
              radius={[0, 8, 8, 0]}
              animationDuration={800}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Distribution */}
        <div
          className="bg-white border border-[var(--admin-border)] rounded-2xl p-6"
          style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
        >
          <h3
            className="text-[var(--admin-text-dark)] text-lg mb-6"
            style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}
          >
            User Distribution
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.userDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${percent !== undefined ? (percent * 100).toFixed(0) : 0}%`
                }

                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.userDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? "var(--admin-secondary)" : "var(--admin-primary)"}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid var(--admin-border)",
                  borderRadius: "8px",
                  fontFamily: "Inter, sans-serif",
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex justify-center gap-6 mt-4">
            {analytics.userDistribution.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: index === 0 ? "var(--admin-secondary)" : "var(--admin-primary)"
                  }}
                />
                <span
                  className="text-[var(--admin-text-muted)]"
                  style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}
                >
                  {item.name}:{" "}
                  <span className="text-[var(--admin-text-dark)] font-semibold">
                    {item.value.toLocaleString()}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Farms by Location */}
        <div
          className="bg-white border border-[var(--admin-border)] rounded-2xl p-6"
          style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
        >
          <h3
            className="text-[var(--admin-text-dark)] text-lg mb-6"
            style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}
          >
            Farms by Location
          </h3>

          <div className="space-y-3">
            {analytics.topLocations.map((loc) => {
              const maxFarms = Math.max(...analytics.topLocations.map(l => l.farms));
              return (
                <div key={loc.location}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-[var(--admin-primary)]" />
                      <span
                        className="text-[var(--admin-text-dark)]"
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          fontWeight: 600,
                        }}
                      >
                        {loc.location}
                      </span>
                    </div>
                    <span
                      className="text-[var(--admin-text-muted)]"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                      }}
                    >
                      {loc.farms} farms
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--admin-primary)] to-[var(--admin-secondary)] rounded-full transition-all"
                      style={{ width: `${(loc.farms / maxFarms) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}