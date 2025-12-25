"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle,
  Calendar,
  Droplets,
  Thermometer,
  Wind,
  Download,
  MapPin,
  ArrowUp,
  Check,
  Droplet,
  Leaf,
  Wrench,
  UserPlus,
  Sprout,
  FileText,
  FileSpreadsheet,
  File,
  Image,
} from "lucide-react";
import Link from "next/link";
import { useDashboard } from "@/hooks/useDashboard";
import { CustomAlert } from "@/components/workspace/CustomAlert";
import { useDailyForecast } from "@/hooks/useWeather";
import { CurrentWeather } from "@/types/weather.types";

// Weather forecast will be loaded from backend via hook

export function AdminDashboard() {
  // Use the dashboard hook
  const {
    fetchAdminOverview,
    fetchFarmActivity,
    fetchRecentActivity,
    fetchTodayOverview,
    fetchRecentTasks,
    loading,
    alert,
    closeAlert,
  } = useDashboard();

  // State for dashboard data
  const [overview, setOverview] = useState<any>(null);
  const [farmActivity, setFarmActivity] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any>(null);
  const [todayOverview, setTodayOverview] = useState<any>(null);
  const [recentTasks, setRecentTasks] = useState<any>(null);

  // Daily forecast hook (calls weather service)
  const { forecast: dailyForecast, loading: dailyLoading, error: dailyError } = useDailyForecast();

  // Fetch all dashboard data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [
          overviewResult,
          farmActivityResult,
          recentActivityResult,
          todayOverviewResult,
          recentTasksResult,
        ] = await Promise.all([
          fetchAdminOverview(),
          fetchFarmActivity({ taskLimit: 5, fieldLimit: 4 }),
          fetchRecentActivity({ limit: 10 }),
          fetchTodayOverview(),
          fetchRecentTasks({ limit: 5 }),
        ]);

        // Set state with real data
        if (overviewResult.data) setOverview(overviewResult.data);
        if (farmActivityResult.data) setFarmActivity(farmActivityResult.data);
        if (recentActivityResult.data) setRecentActivity(recentActivityResult.data);
        if (todayOverviewResult.data) setTodayOverview(todayOverviewResult.data);
        if (recentTasksResult.data) setRecentTasks(recentTasksResult.data);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        // Errors are already handled by the hook and shown via CustomAlert
      }
    };

    loadDashboardData();
  }, [fetchAdminOverview, fetchFarmActivity, fetchRecentActivity, fetchTodayOverview, fetchRecentTasks]);


  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Less than 1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffInHours = Math.floor(
      (date.getTime() - now.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 0) return "Overdue";
    if (diffInHours < 24) return "Due today";
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Due tomorrow";
    return `Due in ${diffInDays} days`;
  };

  const getActivityIcon = (type: string) => {
    const iconMap: { [key: string]: { icon: any; bg: string; color: string } } = {
      task_completed: {
        icon: CheckCircle,
        bg: "#D4EDDA",
        color: "#155724",
      },
      worker_joined: { icon: UserPlus, bg: "#CCE5FF", color: "#004085" },
      field_status_change: { icon: Sprout, bg: "#D4EDDA", color: "#155724" },
      task_due_soon: { icon: Calendar, bg: "#FFF3CD", color: "#856404" },
    };
    return iconMap[type] || iconMap.task_completed;
  };

  const getTaskIcon = (title: string) => {
    if (title.toLowerCase().includes("water") || title.toLowerCase().includes("irrigation"))
      return Droplet;
    if (title.toLowerCase().includes("harvest")) return Leaf;
    if (title.toLowerCase().includes("repair") || title.toLowerCase().includes("maintenance"))
      return Wrench;
    return CheckCircle;
  };
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

  // Show loading state while fetching data
  if (loading && !overview) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50] mx-auto"></div>
          <p className="mt-4 text-[#6B7280]">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Fallback to empty data if API hasn't loaded yet
  const safeOverview = overview || {
    fields: { total: 0, monthlyIncrease: 0, active: 0 },
    tasks: { total: 0, pending: 0, in_progress: 0, completed: 0, doneToday: 0, pendingIncreaseToday: 0 },
    workers: { total: 0, activeToday: 0 },
    progress: { completionPercent: 0, weeklyChangePercent: 0 },
  };

  const safeFarmActivity = farmActivity || { activeTasks: [], fieldStatus: [] };
  const safeRecentActivity = recentActivity || { activities: [] };
  const safeTodayOverview = todayOverview || {
    weather: { temperature: 0, condition: "Loading...", humidity: 0, windSpeedKmh: 0 },
    fields: { total: 0, activeFields: 0, totalArea: 0, underCultivationArea: 0 },
  };
  const safeRecentTasks = recentTasks || { tasks: [] };

  return (
    <>
      {/* Custom Alert from hook */}
      <CustomAlert
        isOpen={alert.isOpen}
        onClose={closeAlert}
        type={alert.type}
        message={alert.message}
      />

      {/* Dashboard Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          {/* Left - Title Section */}
          <div>
            <h1
              className="font-bold text-[#1F2937]"
              style={{ fontFamily: "Poppins, sans-serif", fontSize: "30px" }}
            >
              Dashboard
            </h1>
            <p className="mt-2 text-[#6B7280]">
              Overview of your farm operations
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats - 4 Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <QuickStatCard
          icon={<MapPin size={24} strokeWidth={2} />}
          number={safeOverview.fields.total.toString()}
          label="Fields"
          change={`+${safeOverview.fields.monthlyIncrease} this month`}
          changeIcon={<ArrowUp size={12} />}
        />
        <QuickStatCard
          icon={<CheckCircle size={24} strokeWidth={2} />}
          number={safeOverview.tasks.total.toString()}
          label="Tasks"
          change={`${safeOverview.tasks.doneToday} done today`}
          changeIcon={<Check size={12} />}
        />
        <QuickStatCard
          icon={<Users size={24} strokeWidth={2} />}
          number={safeOverview.workers.total.toString()}
          label="Workers"
          change={`${safeOverview.workers.activeToday} active today`}
          changeIcon={<ArrowUp size={12} />}
        />
        <QuickStatCard
          icon={<TrendingUp size={24} strokeWidth={2} />}
          number={`${safeOverview.progress.completionPercent}%`}
          label="Progress"
          change={`+${safeOverview.progress.weeklyChangePercent}% this week`}
          changeIcon={<ArrowUp size={12} />}
        />
      </div>

      {/* Farm Activity Overview Section Header */}
      <div className="mt-8 mb-5">
        <h2
          className="font-semibold text-[#1F2937]"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "20px" }}
        >
          Farm Activity Overview
        </h2>
      </div>

      {/* Active Tasks and Field Status Cards - 2 Column Layout */}
      <div className="flex gap-6 mb-8">
        {/* Active Tasks Card (Left) */}
        <div className="w-[48%] h-[400px] bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="font-semibold text-[#1F2937] text-[18px] mb-5">
            Active Tasks
          </h3>

          <div className="space-y-4 flex-1 overflow-y-auto">
            {safeFarmActivity.activeTasks.length > 0 ? (
              safeFarmActivity.activeTasks.map((task: any) => {
                const Icon = getTaskIcon(task.title);
                const statusConfig: { [key: string]: { bg: string; text: string; label: string } } = {
                  in_progress: {
                    bg: "#CCE5FF",
                    text: "#004085",
                    label: "In Progress",
                  },
                  pending: { bg: "#FFF3CD", text: "#856404", label: "Pending" },
                  completed: {
                    bg: "#D4EDDA",
                    text: "#155724",
                    label: "Completed",
                  },
                };
                const status = statusConfig[task.status] || statusConfig.pending;

                return (
                  <div
                    key={task.id}
                    className="pb-4 border-b border-[#F3F4F6] last:border-0"
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: status.bg }}
                      >
                        <Icon size={20} style={{ color: status.text }} />
                      </div>
                      <span className="font-semibold text-[#1F2937]">
                        {task.title}
                      </span>
                    </div>
                    <div className="ml-11 space-y-1">
                      <p className="text-[#6B7280] text-[14px]">
                        {formatDueDate(task.dueDate)}
                      </p>
                      <p className="text-[#6B7280] text-[14px]">
                        {task.assignedWorkers?.map((w: any) => w.name).join(", ") || "Unassigned"}
                      </p>
                      <div
                        className="inline-block mt-2 px-3 py-1 rounded-xl font-semibold text-[12px]"
                        style={{
                          backgroundColor: status.bg,
                          color: status.text,
                        }}
                      >
                        {status.label}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-[#6B7280]">
                No active tasks found
              </div>
            )}
          </div>

          <Link 
            href="/tasks"
            className="mt-4 inline-flex items-center justify-center text-[#4CAF50] font-semibold hover:text-[#388E3C] transition-colors flex-shrink-0"
          >
            View All Tasks →
          </Link>
        </div>

        {/* Field Status Card (Right) */}
        <div className="w-[48%] h-[400px] bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="font-semibold text-[#1F2937] text-[18px] mb-5">
            Field Status
          </h3>

          <div className="space-y-6 flex-1 overflow-y-auto">
            {safeFarmActivity.fieldStatus.length > 0 ? (
              safeFarmActivity.fieldStatus.map((field: any) => (
                <div key={field.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-[#1F2937]">
                      {field.name}: {field.status.charAt(0).toUpperCase() + field.status.slice(1)}
                    </span>
                    <span className="text-[#4CAF50] font-medium text-[13px]">
                      {field.progressPercent}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#81C784] to-[#4CAF50] rounded-full"
                      style={{ width: `${field.progressPercent}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-[#6B7280]">
                No field status data available
              </div>
            )}
          </div>

          <Link 
            href="/fields"
            className="mt-4 inline-flex items-center justify-center text-[#4CAF50] font-semibold hover:text-[#388E3C] transition-colors flex-shrink-0"
          >
            View All Fields →
          </Link>
        </div>
      </div>

      {/* Recent Activity Feed Section */}
      <div className="mt-8 mb-5">
        <h2
          className="font-semibold text-[#1F2937]"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "20px" }}
        >
          Recent Activity
        </h2>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm mb-8">
        <div className="space-y-4">
          {safeRecentActivity.activities.length > 0 ? (
            safeRecentActivity.activities.map((activity: any) => {
              const iconConfig = getActivityIcon(activity.type);
              const Icon = iconConfig.icon;

              return (
                <div
                  key={activity.id}
                  className="flex gap-4 pb-4 border-b border-[#F3F4F6] last:border-0"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: iconConfig.bg }}
                  >
                    <Icon size={24} style={{ color: iconConfig.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[#374151]">{activity.message}</p>
                    <p className="text-[#9CA3AF] mt-1">
                      {formatRelativeTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-[#6B7280]">
              No recent activities found
            </div>
          )}
        </div>
      </div>

      {/* Weather Forecast Section */}
      <div className="mt-8 mb-5">
        <h2
          className="font-semibold text-[#1F2937]"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "20px" }}
        >
          Weather Forecast
        </h2>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm mb-8">
        <div className="flex justify-center gap-4 overflow-x-auto">
          {dailyLoading ? (
            <div className="py-6 px-4 text-[#6B7280]">Loading forecast...</div>
          ) : dailyError ? (
            <div className="py-6 px-4 text-[#EF4444]">Failed to load forecast</div>
          ) : dailyForecast && dailyForecast.days && dailyForecast.days.length > 0 ? (
            dailyForecast.days.map((d: any, index: number) => (
              <WeatherDay
                key={index}
                day={d.dayOfWeek || new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' })}
                icon={getWeatherIcon(d.icon)}
                high={`${d.maxTemp}${d.maxTemp && typeof d.maxTemp === 'number' ? '°C' : ''}`}
                low={`${d.minTemp}${d.minTemp && typeof d.minTemp === 'number' ? '°C' : ''}`}
              />
            ))
          ) : (
            <div className="py-6 px-4 text-[#6B7280]">No forecast available</div>
          )}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Weather Card - Takes 1 column */}
        <div className="bg-gradient-to-br from-[#4CAF50] to-[#81C784] rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[18px]">Today's Weather</h3>
            <Thermometer size={24} />
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-4">
              <div
                className="text-[48px] font-bold"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {safeTodayOverview.weather.temperature}°C
              </div>
              <div className="text-[18px] opacity-90">
                {safeTodayOverview.weather.condition}
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets size={18} />
                <span>Humidity</span>
              </div>
              <span className="font-semibold">
                {safeTodayOverview.weather.humidity}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wind size={18} />
                <span>Wind Speed</span>
              </div>
              <span className="font-semibold">
                {safeTodayOverview.weather.windSpeedKmh} km/h
              </span>
            </div>
          </div>
        </div>

        {/* Field Overview - Takes 2 columns */}
        <div className="col-span-2 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-[#1F2937] text-[18px] mb-4">
            Field Overview
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#F9FAFB] rounded-lg">
              <div className="text-[#6B7280] mb-1">Total Fields</div>
              <div
                className="text-[32px] font-bold text-[#1F2937]"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {safeTodayOverview.fields.total}
              </div>
            </div>
            <div className="p-4 bg-[#F9FAFB] rounded-lg">
              <div className="text-[#6B7280] mb-1">Active Fields</div>
              <div
                className="text-[32px] font-bold text-[#1F2937]"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {safeTodayOverview.fields.activeFields}
              </div>
            </div>
            <div className="p-4 bg-[#F9FAFB] rounded-lg">
              <div className="text-[#6B7280] mb-1">Total Area</div>
              <div
                className="text-[32px] font-bold text-[#1F2937]"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {safeTodayOverview.fields.totalArea}ha
              </div>
            </div>
            <div className="p-4 bg-[#F9FAFB] rounded-lg">
              <div className="text-[#6B7280] mb-1">Under Cultivation</div>
              <div
                className="text-[32px] font-bold text-[#1F2937]"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {safeTodayOverview.fields.underCultivationArea}ha
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#1F2937] text-[18px]">
            Recent Tasks
          </h3>
          <Link
            href="/tasks"
            className="text-[#4CAF50] font-semibold hover:text-[#388E3C] transition-colors"
          >
            View All →
          </Link>
        </div>

        <div className="space-y-3">
          {safeRecentTasks.tasks.length > 0 ? (
            safeRecentTasks.tasks.map((task: any) => (
              <TaskItem
                key={task.id}
                title={task.title}
                assignedTo={task.assignedWorkers?.[0]?.name || "Unassigned"}
                status={task.status as "completed" | "in_progress" | "pending"}
                date={
                  task.completedAt
                    ? new Date(task.completedAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })
                    : formatDueDate(task.dueDate)
                }
              />
            ))
          ) : (
            <div className="text-center py-8 text-[#6B7280]">
              No recent tasks found
            </div>
          )}
        </div>
      </div>

    </>
  );
}

// Helper Components (unchanged)
function QuickStatCard({ icon, number, label, change, changeIcon }: { 
  icon: React.ReactNode; 
  number: string; 
  label: string; 
  change: string;
  changeIcon: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all h-[170px] flex flex-col">
      {/* Icon Circle */}
      <div className="w-11 h-11 bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#4CAF50]">
        {icon}
      </div>
      
      {/* Number */}
      <div className="font-bold text-[#1F2937] mt-3" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '42px', lineHeight: '1' }}>
        {number}
      </div>
      
      {/* Label */}
      <div className="font-medium text-[#6B7280] mt-2 text-[15px]">
        {label}
      </div>
      
      {/* Change Indicator */}
      <div className="flex items-center gap-1 text-[#4CAF50] font-medium text-[13px] mt-auto">
        {changeIcon}
        {change}
      </div>
    </div>
  );
}

function TaskItem({ title, assignedTo, status, date }: {
  title: string;
  assignedTo: string;
  status: 'completed' | 'in_progress' | 'pending';
  date: string;
}) {
  const statusConfig = {
    completed: { bg: '#D4EDDA', text: '#155724', label: 'Completed' },
    'in_progress': { bg: '#FFF3CD', text: '#856404', label: 'In Progress' },
    pending: { bg: '#F8D7DA', text: '#721C24', label: 'Pending' }
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg hover:bg-[#F3F4F6] transition-colors">
      <div className="flex-1">
        <h4 className="font-semibold text-[#1F2937] mb-1">{title}</h4>
        <div className="text-[#6B7280] text-[14px]">Assigned to: {assignedTo} • {date}</div>
      </div>
      <div 
        className="px-3 py-1.5 rounded-lg font-semibold text-[13px]"
        style={{ backgroundColor: config.bg, color: config.text }}
      >
        {config.label}
      </div>
    </div>
  );
}


function WeatherDay({ day, icon, high, low }: { day: string; icon: string; high: string; low: string }) {
  return (
    <div className="flex-shrink-0 w-[100px] p-4 bg-[#F9FAFB] rounded-lg text-center">
      <div className="font-semibold text-[#1F2937] mb-2">{day}</div>
      <div className="text-[48px] my-2">{icon}</div>
      <div className="font-bold text-[#1F2937] text-[18px]">{high}</div>
      <div className="text-[#6B7280]">{low}</div>
    </div>
  );
}