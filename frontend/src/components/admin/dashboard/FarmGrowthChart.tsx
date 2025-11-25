"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface FarmGrowthChartProps {
  data?: Array<{ month: string; farms: number }>;
}

const defaultData = [
  { month: "Jan", farms: 65 },
  { month: "Feb", farms: 98 },
  { month: "Mar", farms: 142 },
  { month: "Apr", farms: 201 },
  { month: "May", farms: 278 },
  { month: "Jun", farms: 354 },
  { month: "Jul", farms: 432 },
  { month: "Aug", farms: 523 },
];

export default function FarmGrowthChart({
  data = defaultData,
}: FarmGrowthChartProps) {
  return (
    <div
      className="bg-white border border-[var(--admin-border)] rounded-2xl p-6"
      style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
    >
      <h3
        className="text-[var(--admin-text-dark)] text-xl mb-6"
        style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}
      >
        Farm Growth Over Time
      </h3>

      <div className="h-px bg-[var(--admin-border)] mb-6" />

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="colorFarms" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--admin-primary)"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="var(--admin-primary)"
                stopOpacity={0.05}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" />
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
              color: "var(--admin-text-dark)",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
            }}
            labelStyle={{ color: "var(--admin-primary)", fontWeight: 600 }}
          />
          <Line
            type="monotone"
            dataKey="farms"
            stroke="var(--admin-primary)"
            strokeWidth={3}
            dot={{ fill: "var(--admin-primary)", r: 5 }}
            activeDot={{ r: 7, fill: "var(--admin-primary)" }}
            fill="url(#colorFarms)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
