"use client";

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
import { TrendingUp, Activity, MapPin } from "lucide-react";
import CustomSelect from "./CustomSelect";
import { useState } from "react";

const userGrowthData = [
  { month: "Jan", users: 145 },
  { month: "Feb", users: 278 },
  { month: "Mar", users: 412 },
  { month: "Apr", users: 589 },
  { month: "May", users: 756 },
  { month: "Jun", users: 934 },
  { month: "Jul", users: 1128 },
  { month: "Aug", users: 1284 },
];

const taskVolumeData = [
  { month: "Jan", tasks: 1200 },
  { month: "Feb", tasks: 1890 },
  { month: "Mar", tasks: 2340 },
  { month: "Apr", tasks: 3210 },
  { month: "May", tasks: 4567 },
  { month: "Jun", tasks: 5234 },
  { month: "Jul", tasks: 6123 },
  { month: "Aug", tasks: 7456 },
];

const mostActiveFarmsData = [
  { farm: "Green Valley", tasks: 523 },
  { farm: "Sunrise", tasks: 487 },
  { farm: "Golden Harvest", tasks: 456 },
  { farm: "Fresh Fields", tasks: 412 },
  { farm: "Organic Paradise", tasks: 389 },
  { farm: "Nature Bounty", tasks: 345 },
];

const userDistributionData = [
  { name: "Farm Owners", value: 523, color: "var(--admin-secondary)" },
  { name: "Workers", value: 12324, color: "var(--admin-primary)" },
];

const locationData = [
  { location: "Algiers", farms: 145 },
  { location: "Oran", farms: 98 },
  { location: "Constantine", farms: 76 },
  { location: "Blida", farms: 54 },
  { location: "Annaba", farms: 43 },
  { location: "Tizi Ouzou", farms: 38 },
  { location: "Sétif", farms: 29 },
  { location: "Others", farms: 40 },
];

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
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
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
                +24.5%
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={userGrowthData}>
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
                +31.2%
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={taskVolumeData}>
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
                labelStyle={{
                  color: "#1f1e17",
                  fontWeight: 600,
                  marginBottom: "4px",
                  fontSize: "13px",
                }}
                itemStyle={{
                  color: "#4baf47",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
                cursor={{ fill: "rgba(75, 175, 71, 0.08)" }}
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
          <BarChart data={mostActiveFarmsData} layout="vertical">
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
              labelStyle={{
                color: "#1f1e17",
                fontWeight: 600,
                marginBottom: "4px",
                fontSize: "13px",
              }}
              itemStyle={{
                color: "#ff6b00",
                fontWeight: 600,
                fontSize: "14px",
              }}
              cursor={{ fill: "rgba(255, 107, 0, 0.05)" }}
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
                data={userDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {userDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
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
            {userDistributionData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
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
            {locationData.map((loc) => (
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
                    style={{ width: `${(loc.farms / 145) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
