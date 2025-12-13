"use client";

import React, { useState, useRef } from "react";
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
// Mock data matching API responses
const mockDashboardOverview = {
  fields: {
    total: 12,
    monthlyIncrease: 2,
    active: 10,
  },
  tasks: {
    total: 34,
    pending: 12,
    in_progress: 8,
    completed: 14,
    doneToday: 5,
    pendingIncreaseToday: 3,
  },
  workers: {
    total: 8,
    activeToday: 6,
  },
  progress: {
    completionPercent: 75,
    weeklyChangePercent: 5,
  },
};

const mockFarmActivity = {
  activeTasks: [
    {
      id: 101,
      title: "Water irrigation system - Field A",
      fieldId: 1,
      fieldName: "Field A",
      status: "in_progress",
      priority: "high",
      dueDate: "2025-11-27T17:00:00.000Z",
      assignedWorkers: [
        { id: 3, name: "Ahmed Khalil", initials: "AK" },
        { id: 5, name: "Sara Mohammed", initials: "SM" },
      ],
      progressPercent: 60,
    },
    {
      id: 102,
      title: "Harvest Field B",
      fieldId: 2,
      fieldName: "Field B",
      status: "pending",
      priority: "medium",
      dueDate: "2025-11-28T09:00:00.000Z",
      assignedWorkers: [{ id: 4, name: "Ali Benali", initials: "AB" }],
      progressPercent: 0,
    },
    {
      id: 103,
      title: "Repair equipment",
      fieldId: null,
      fieldName: null,
      status: "pending",
      priority: "low",
      dueDate: "2025-11-29T14:00:00.000Z",
      assignedWorkers: [{ id: 3, name: "Ahmed Khalil", initials: "AK" }],
      progressPercent: 0,
    },
  ],
  fieldStatus: [
    {
      id: 1,
      name: "Field A",
      size: 10.0,
      cropType: "Potatoes",
      status: "growing",
      activeTasks: 4,
      workersCount: 2,
      progressPercent: 80,
    },
    {
      id: 2,
      name: "Field B",
      size: 8.5,
      cropType: "Wheat",
      status: "planted",
      activeTasks: 2,
      workersCount: 1,
      progressPercent: 40,
    },
    {
      id: 3,
      name: "Field C",
      size: 12.0,
      cropType: "Corn",
      status: "harvesting",
      activeTasks: 1,
      workersCount: 3,
      progressPercent: 100,
    },
  ],
};

const mockRecentActivity = {
  activities: [
    {
      id: "act_001",
      type: "task_completed",
      title: "Task completed",
      message: 'Task "Water North Field" completed',
      timestamp: "2025-11-27T09:30:00.000Z",
      metadata: { farmId: 1, taskId: 201, workerId: 3 },
    },
    {
      id: "act_002",
      type: "worker_joined",
      title: "New worker joined",
      message: "New worker Sara joined the team",
      timestamp: "2025-11-27T08:15:00.000Z",
      metadata: { farmId: 1, workerId: 5 },
    },
    {
      id: "act_003",
      type: "field_status_change",
      title: "Field status changed",
      message: 'Field "West Plot" status changed to Growing',
      timestamp: "2025-11-27T06:00:00.000Z",
      metadata: { farmId: 1, fieldId: 4 },
    },
    {
      id: "act_004",
      type: "task_due_soon",
      title: "Task due soon",
      message: 'Task "Fertilize Field B" due tomorrow',
      timestamp: "2025-11-26T14:00:00.000Z",
      metadata: { farmId: 1, taskId: 205 },
    },
  ],
};

const mockTodayOverview = {
  weather: {
    temperature: 28,
    condition: "Sunny",
    icon: "sunny",
    feelsLike: 30,
    humidity: 45,
    windSpeedKmh: 12,
    windDirection: "NE",
    uvIndex: 7,
    uvLevel: "high",
  },
  fields: {
    total: 12,
    activeFields: 10,
    totalArea: 120.0,
    underCultivationArea: 95.0,
  },
};

const mockRecentTasks = {
  tasks: [
    {
      id: 301,
      title: "Irrigation System Check",
      status: "completed",
      priority: "medium",
      fieldId: 2,
      fieldName: "Field B",
      assignedWorkers: [{ id: 3, name: "Ahmed Khalil" }],
      dueDate: "2025-11-27T10:30:00.000Z",
      completedAt: "2025-11-27T11:00:00.000Z",
    },
    {
      id: 302,
      title: "Fertilizer Application - Field A",
      status: "in_progress",
      priority: "high",
      fieldId: 1,
      fieldName: "Field A",
      assignedWorkers: [{ id: 5, name: "Sara Mansouri" }],
      dueDate: "2025-11-27T14:00:00.000Z",
      completedAt: null,
    },
    {
      id: 303,
      title: "Equipment Maintenance",
      status: "pending",
      priority: "low",
      fieldId: null,
      fieldName: null,
      assignedWorkers: [{ id: 4, name: "Ali Benali" }],
      dueDate: "2025-11-28T09:00:00.000Z",
      completedAt: null,
    },
    {
      id: 304,
      title: "Soil Testing - Field C",
      status: "completed",
      priority: "medium",
      fieldId: 3,
      fieldName: "Field C",
      assignedWorkers: [{ id: 3, name: "Ahmed Khalil" }],
      dueDate: "2025-11-26T16:15:00.000Z",
      completedAt: "2025-11-26T16:45:00.000Z",
    },
  ],
};

const mockWeatherForecast = [
  { day: "Mon", icon: "☀️", high: "28°C", low: "15°C" },
  { day: "Tue", icon: "⛅", high: "25°C", low: "14°C" },
  { day: "Wed", icon: "🌧️", high: "22°C", low: "16°C" },
  { day: "Thu", icon: "☀️", high: "27°C", low: "15°C" },
  { day: "Fri", icon: "⛅", high: "26°C", low: "16°C" },
  { day: "Sat", icon: "☀️", high: "29°C", low: "17°C" },
  { day: "Sun", icon: "☀️", high: "30°C", low: "18°C" },
];

export function AdminDashboard() {
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const exportButtonRef = useRef<HTMLButtonElement>(null);

  const [overview] = useState(mockDashboardOverview);
  const [farmActivity] = useState(mockFarmActivity);
  const [recentActivity] = useState(mockRecentActivity);
  const [todayOverview] = useState(mockTodayOverview);
  const [recentTasks] = useState(mockRecentTasks);
  const [weatherForecast] = useState(mockWeatherForecast);

  const handleExport = (type: string) => {
    setShowExportDropdown(false);
    alert(`Exporting dashboard as ${type}... Download will start shortly`);
  };

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
    const iconMap: { [key: string]: { icon: any; bg: string; color: string } } =
      {
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

  return (
    <>
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

          {/* Right - Export Button */}
          <div className="relative">
            <button
              ref={exportButtonRef}
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="h-11 px-6 bg-white border border-[#D1D5DB] text-[#4B5563] rounded-lg font-semibold flex items-center gap-2 hover:bg-[#F9FAFB] transition-all cursor-pointer"
            >
              <Download size={20} />
              Export
            </button>

            {showExportDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-50">
                <div className="py-2">
                  <button
                    onClick={() => handleExport("PDF")}
                    className="w-full px-4 py-2.5 text-left hover:bg-[#F9FAFB] flex items-center gap-3 text-[#374151]"
                  >
                    <FileText size={18} />
                    Export as PDF
                  </button>
                  <button
                    onClick={() => handleExport("Excel")}
                    className="w-full px-4 py-2.5 text-left hover:bg-[#F9FAFB] flex items-center gap-3 text-[#374151]"
                  >
                    <FileSpreadsheet size={18} />
                    Export as Excel
                  </button>
                  <button
                    onClick={() => handleExport("CSV")}
                    className="w-full px-4 py-2.5 text-left hover:bg-[#F9FAFB] flex items-center gap-3 text-[#374151]"
                  >
                    <File size={18} />
                    Export as CSV
                  </button>
                  <button
                    onClick={() => handleExport("Image")}
                    className="w-full px-4 py-2.5 text-left hover:bg-[#F9FAFB] flex items-center gap-3 text-[#374151]"
                  >
                    <Image size={18} />
                    Export as Image
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats - 4 Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <QuickStatCard
          icon={<MapPin size={24} strokeWidth={2} />}
          number={overview.fields.total.toString()}
          label="Fields"
          change={`+${overview.fields.monthlyIncrease} this month`}
          changeIcon={<ArrowUp size={12} />}
        />
        <QuickStatCard
          icon={<CheckCircle size={24} strokeWidth={2} />}
          number={overview.tasks.total.toString()}
          label="Tasks"
          change={`${overview.tasks.doneToday} done today`}
          changeIcon={<Check size={12} />}
        />
        <QuickStatCard
          icon={<Users size={24} strokeWidth={2} />}
          number={overview.workers.total.toString()}
          label="Workers"
          change={`${overview.workers.activeToday} active today`}
          changeIcon={<ArrowUp size={12} />}
        />
        <QuickStatCard
          icon={<TrendingUp size={24} strokeWidth={2} />}
          number={`${overview.progress.completionPercent}%`}
          label="Progress"
          change={`+${overview.progress.weeklyChangePercent}% this week`}
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
            {farmActivity.activeTasks.map((task) => {
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
              const status = statusConfig[task.status];

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
                      {task.assignedWorkers.map((w) => w.name).join(", ")}
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
            })}
          </div>

          <Link 
                href="/tasks"
                className="mt-4 inline-flex items-center justify-center text-[#4CAF50] font-semibold hover:text-[#388E3C] transition-colors flex-shrink-0">
            View All Tasks →
          </Link>
        </div>

        {/* Field Status Card (Right) */}
        <div className="w-[48%] h-[400px] bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="font-semibold text-[#1F2937] text-[18px] mb-5">
            Field Status
          </h3>

          <div className="space-y-6 flex-1">
            {farmActivity.fieldStatus.map((field) => (
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
            ))}
          </div>

          <Link 
                href="/fields"
                className="mt-4 inline-flex items-center justify-center text-[#4CAF50] font-semibold hover:text-[#388E3C] transition-colors flex-shrink-0">
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
          {recentActivity.activities.map((activity) => {
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
          })}
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
        <div className="flex gap-4 overflow-x-auto">
          {weatherForecast.map((day, index) => (
            <WeatherDay
              key={index}
              day={day.day}
              icon={day.icon}
              high={day.high}
              low={day.low}
            />
          ))}
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
                {todayOverview.weather.temperature}°C
              </div>
              <div className="text-[18px] opacity-90">
                {todayOverview.weather.condition}
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
                {todayOverview.weather.humidity}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wind size={18} />
                <span>Wind Speed</span>
              </div>
              <span className="font-semibold">
                {todayOverview.weather.windSpeedKmh} km/h
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
                {todayOverview.fields.total}
              </div>
            </div>
            <div className="p-4 bg-[#F9FAFB] rounded-lg">
              <div className="text-[#6B7280] mb-1">Active Fields</div>
              <div
                className="text-[32px] font-bold text-[#1F2937]"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {todayOverview.fields.activeFields}
              </div>
            </div>
            <div className="p-4 bg-[#F9FAFB] rounded-lg">
              <div className="text-[#6B7280] mb-1">Total Area</div>
              <div
                className="text-[32px] font-bold text-[#1F2937]"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {todayOverview.fields.totalArea}ha
              </div>
            </div>
            <div className="p-4 bg-[#F9FAFB] rounded-lg">
              <div className="text-[#6B7280] mb-1">Under Cultivation</div>
              <div
                className="text-[32px] font-bold text-[#1F2937]"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {todayOverview.fields.underCultivationArea}ha
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
            href="\tasks"
            className="text-[#4CAF50] font-semibold hover:text-[#388E3C] transition-colors">
            View All →
          </Link>
        </div>

        <div className="space-y-3">
          {recentTasks.tasks.map((task) => (
            <TaskItem
              key={task.id}
              title={task.title}
              assignedTo={task.assignedWorkers[0]?.name || "Unassigned"}
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
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4">
        <QuickActionCard
          icon={<Calendar size={24} />}
          label="Schedule Task"
          color="#4CAF50"
        />
        <QuickActionCard
          icon={<Users size={24} />}
          label="Manage Workers"
          color="#2196F3"
        />
        <QuickActionCard
          icon={<CheckCircle size={24} />}
          label="View Reports"
          color="#FF9800"
        />
        <QuickActionCard
          icon={<TrendingUp size={24} />}
          label="Analytics"
          color="#9C27B0"
        />
      </div>
    </>
  );
}

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

function QuickActionCard({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return (
    <button 
      className="p-6 bg-white border-2 border-[#E5E7EB] rounded-xl hover:border-[#4CAF50] hover:shadow-lg transition-all cursor-pointer"
    >
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto"
        style={{ backgroundColor: `${color}15` }}
      >
        <div style={{ color }}>{icon}</div>
      </div>
      <div className="font-semibold text-[#1F2937] text-center">{label}</div>
    </button>
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