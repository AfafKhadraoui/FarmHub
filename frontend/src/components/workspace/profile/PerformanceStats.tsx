// components/profile/PerformanceStats.tsx
import React from "react";
import { CheckCircle, Clock, TrendingUp } from "lucide-react";

interface PerformanceStatsProps {
  profile: any;
}

export const PerformanceStats = ({ profile }: PerformanceStatsProps) => {
  const stats = [
    {
      icon: CheckCircle,
      label: "Tasks Completed",
      value: profile.completedTasksCount || profile.statistics?.totalTasksCompleted || 0,
      bgColor: "bg-[#E8F5E9]",
      iconColor: "text-[#4CAF50]"
    },
    {
      icon: Clock,
      label: "Hours Worked",
      value: profile.statistics?.totalHoursWorked ?? profile.assignedTasksCount ?? 0,
      bgColor: "bg-[#FEF3C7]",
      iconColor: "text-[#F59E0B]"
    },
    {
      icon: TrendingUp,
      label: "Average Rating",
      value: profile.statistics?.averageRating ?? profile.performancePercent ?? 0,
      bgColor: "bg-[#DBEAFE]",
      iconColor: "text-[#3B82F6]"
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="font-semibold text-[#1F2937] mb-5 text-[20px]" style={{ fontFamily: "Poppins, sans-serif" }}>
        Performance Overview
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ icon: Icon, label, value, bgColor, iconColor }) => (
          <div key={label} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
            <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={24} className={iconColor} />
            </div>
            <div className="text-[#6B7280] text-[14px] mb-1">{label}</div>
            <div className="font-bold text-[#1F2937] text-[24px]" style={{ fontFamily: "Poppins, sans-serif" }}>
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};