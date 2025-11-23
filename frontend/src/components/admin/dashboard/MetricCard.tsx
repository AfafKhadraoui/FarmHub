"use client";

import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  change: string;
  isPositive: boolean;
  gradientColors: string[];
}

export default function MetricCard({
  icon: Icon,
  value,
  label,
  change,
  isPositive,
  gradientColors,
}: MetricCardProps) {
  return (
    <div
      className="bg-white border border-[var(--admin-border)] rounded-2xl p-6 transition-all hover:border-[var(--admin-primary)] hover:shadow-lg"
      style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
    >
      {/* Icon Circle */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-md"
        style={{
          background: `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})`,
        }}
      >
        <Icon size={32} strokeWidth={2} className="text-white" />
      </div>

      {/* Value */}
      <div
        className="text-[var(--admin-text-dark)] text-5xl mb-2"
        style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800 }}
      >
        {value}
      </div>

      {/* Label */}
      <div
        className="text-[var(--admin-text-muted)] text-base mb-3"
        style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
      >
        {label}
      </div>

      {/* Change Indicator */}
      <div
        className={`flex items-center gap-1 text-sm ${
          isPositive ? "text-[var(--admin-primary)]" : "text-[var(--admin-red)]"
        }`}
        style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
      >
        {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        <span>{change}</span>
      </div>
    </div>
  );
}
