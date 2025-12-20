"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Clock,
  Activity,
  CheckCircle,
  Droplet,
  Wrench,
  Leaf,
  Scissors,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { WorkerDashboardResponse } from '@/types/dashboard.types';
import { TaskCard } from '@/components/workspace/tasks/TaskCard';

export function WorkerDashboard() {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  // dashboard-level simple modals removed; TaskCard provides full worker actions
  const statusButtonRef = useRef<HTMLButtonElement>(null);

  // Use the dashboard stats hook
  const { 
    stats, 
    loading, 
    error, 
    refreshStats, 
    isWorker 
  } = useDashboardStats();

  const dashboardData = stats as WorkerDashboardResponse['data'];

  // Fetch data on mount and when refresh is called
  useEffect(() => {
    if (isWorker) {
      refreshStats();
    }
  }, [isWorker, refreshStats]);

  const handleStatusChange = (task: any, status: string) => {
    setSelectedTask(task);
    switch (status) {
      case "complete":
        // Use TaskCard's Update Status flow instead of dashboard-level modal
        break;
      case "pause":
        // handled by TaskCard
        break;
      case "help":
        // handled by TaskCard
        break;
      default:
        alert(`Status updated to: ${status}`);
        refreshStats();
    }
    setShowStatusDropdown(false);
  };

  // dashboard-level submit handlers removed — TaskCard handles status, notes, etc.

  const getTaskIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("water") || lowerTitle.includes("irrigation"))
      return Droplet;
    if (lowerTitle.includes("harvest")) return Scissors;
    if (lowerTitle.includes("fertilizer") || lowerTitle.includes("fertilize"))
      return Leaf;
    if (lowerTitle.includes("maintenance") || lowerTitle.includes("repair"))
      return Wrench;
    return CheckCircle;
  };

  const getPriorityStyle = (priority: string) => {
    const styles: { [key: string]: { bg: string; text: string } } = {
      HIGH: { bg: "#F8D7DA", text: "#721C24" },
      MEDIUM: { bg: "#FFF3CD", text: "#856404" },
      LOW: { bg: "#D1ECF1", text: "#0C5460" },
    };
    return styles[priority] || styles.MEDIUM;
  };

  const getStatusStyle = (status: string) => {
    const styles: { [key: string]: { bg: string; text: string } } = {
      IN_PROGRESS: { bg: "#CCE5FF", text: "#004085" },
      PENDING: { bg: "#FFF3CD", text: "#856404" },
      COMPLETED: { bg: "#D4EDDA", text: "#155724" },
    };
    return styles[status] || styles.PENDING;
  };

  const formatDueTime = (dueTime: string) => {
    const date = new Date(dueTime);
    const now = new Date();
    const diffInHours = Math.floor(
      (date.getTime() - now.getTime()) / (1000 * 60 * 60)
    );

    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (diffInHours < 0) return `Overdue`;
    if (diffInHours < 24) return `Today, ${timeStr}`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatUpcomingDue = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffInDays = Math.floor(
      (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (diffInDays === 0) return `Today, ${timeStr}`;
    if (diffInDays === 1) return `Tomorrow, ${timeStr}`;
    return `In ${diffInDays} days`;
  };

  const getWeatherIcon = (icon: string) => {
    const iconMap: { [key: string]: string } = {
      sunny: "☀️",
      cloudy: "☁️",
      rainy: "🌧️",
      partly_cloudy: "⛅",
      stormy: "⛈️",
      clear: "☀️",
      rain: "🌧️",
      snow: "❄️",
    };
    return iconMap[icon] || "☀️";
  };

  // Map a dashboard `todayTasks` entry to the canonical TaskCard shape
  const mapDashboardTaskToTaskCard = (t: any) => {
    return {
      // keep original identifiers
      id: t.id,
      title: t.title,
      status: t.status,
      priority: t.priority || 'MEDIUM',
      // TaskCard checks a few possible fields for due date/time
      dueDate: t.dueTime || t.dueDate || t.due_time || null,
      dueTime: t.dueTime || t.dueTimeString || null,
      fieldName: t.fieldName ?? (t.field && t.field.name) ?? null,
      fieldId: t.fieldId ?? (t.field && t.field.id) ?? undefined,
      // Worker dashboard doesn't include assignedWorkers by default — leave empty
      assignedWorkers: t.assignedWorkers ?? [],
      assignedWorkerIds: t.assignedWorkerIds ?? [],
      taskAssignments: t.taskAssignments ?? [],
      description: t.description ?? '',
      // keep any other keys that TaskCard may rely on
      ...t,
    };
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50] mx-auto"></div>
          <p className="mt-4 text-[#6B7280]">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Error loading data</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={refreshStats}
              className="h-9 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all cursor-pointer text-sm flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state if no data
  if (!dashboardData) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2">No Dashboard Data</h3>
        <p className="text-gray-500 mb-4">
          Unable to load dashboard data. Please try refreshing.
        </p>
        <button
          onClick={refreshStats}
          className="h-10 px-5 bg-[#4CAF50] text-white rounded-lg font-semibold hover:bg-[#388E3C] transition-all cursor-pointer text-sm flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Worker Dashboard Page Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="font-bold text-[#1F2937]" style={{ fontFamily: "Poppins, sans-serif", fontSize: "30px" }}>
            My Dashboard
          </h1>
          <p className="mt-2 text-[#6B7280]">Welcome back!</p>
        </div>
        <button
          onClick={refreshStats}
          className="h-9 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all cursor-pointer text-sm flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Task Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Card 1: Pending Tasks */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all">
          <div className="w-12 h-12 bg-[#FFF3CD] rounded-full flex items-center justify-center mb-4">
            <Clock size={28} className="text-[#FFC107]" strokeWidth={2} />
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-bold text-[#1F2937]" style={{ fontSize: "40px", lineHeight: "1" }}>
              {dashboardData.taskStatistics.pending.count}
            </span>
          </div>
          <div className="font-semibold text-[#374151] text-[18px] mb-3">
            Pending
          </div>
          <div className="text-[#6B7280] text-[14px]">
            {dashboardData.taskStatistics.pending.label}
          </div>
        </div>

        {/* Card 2: In Progress */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all">
          <div className="w-12 h-12 bg-[#CCE5FF] rounded-full flex items-center justify-center mb-4">
            <Activity size={28} className="text-[#2196F3]" strokeWidth={2} />
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-bold text-[#1F2937]" style={{ fontSize: "40px", lineHeight: "1" }}>
              {dashboardData.taskStatistics.inProgress.count}
            </span>
          </div>
          <div className="font-semibold text-[#374151] text-[18px] mb-3">
            In Progress
          </div>
          <div className="text-[#F59E0B] text-[14px]">
            {dashboardData.taskStatistics.inProgress.label}
          </div>
        </div>

        {/* Card 3: Completed */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all">
          <div className="w-12 h-12 bg-[#D4EDDA] rounded-full flex items-center justify-center mb-4">
            <CheckCircle size={28} className="text-[#4CAF50]" strokeWidth={2} />
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-bold text-[#1F2937]" style={{ fontSize: "40px", lineHeight: "1" }}>
              {dashboardData.taskStatistics.completed.count}
            </span>
          </div>
          <div className="font-semibold text-[#374151] text-[18px] mb-3">
            Completed
          </div>
          <div className="text-[#6B7280] text-[14px]">
            {dashboardData.taskStatistics.completed.label}
          </div>
        </div>
      </div>

      {/* Today's Tasks Section */}
      <div className="mt-8">
        <h2 className="font-semibold text-[#1F2937] mb-5" style={{ fontFamily: "Poppins, sans-serif", fontSize: "20px" }}>
          Today's Tasks
        </h2>

        <div className="space-y-4">
          {dashboardData.todayTasks.map((task) => (
            <TaskCard key={task.id} mode="worker" task={mapDashboardTaskToTaskCard(task)} />
          ))}
        </div>

        {dashboardData.todayTasks.length === 0 && (
          <div className="text-center py-8 bg-white border border-[#E5E7EB] rounded-xl">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <p className="text-[#6B7280]">No tasks scheduled for today!</p>
          </div>
        )}
      </div>

      {/* Upcoming Tasks Section */}
      <div className="mt-8">
        <h2 className="font-semibold text-[#1F2937] mb-5" style={{ fontFamily: "Poppins, sans-serif", fontSize: "20px" }}>
          Upcoming Tasks
        </h2>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
          {dashboardData.upcomingTasks.map((task, index) => {
            const Icon = getTaskIcon(task.title);
            const iconColors: { [key: string]: { bg: string; color: string } } =
              {
                Leaf: { bg: "#FFF3E0", color: "#FFC107" },
                Scissors: { bg: "#E8F5E9", color: "#4CAF50" },
                Droplet: { bg: "#CCE5FF", color: "#2196F3" },
                Wrench: { bg: "#E6E6FA", color: "#6B46C1" },
              };
            const iconStyle =
              iconColors[Icon.name] || { bg: "#F3F4F6", color: "#6B7280" };

            return (
              <div
                key={task.id}
                className={`flex items-start gap-3 py-3 ${
                  index < dashboardData.upcomingTasks.length - 1
                    ? "border-b border-[#F3F4F6]"
                    : ""
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: iconStyle.bg }}
                >
                  <Icon size={18} style={{ color: iconStyle.color }} />
                </div>
                <div className="flex-1">
                  <div className="text-[#1F2937] text-[15px]">
                    {task.title}
                  </div>
                  <div className="text-[#6B7280] text-[14px] mt-1">
                    Due: {formatUpcomingDue(task.dueDate)} •{" "}
                    {task.status.replace("_", " ")}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Footer Link */}
          <div className="mt-4 pt-4 border-t border-[#F3F4F6]">
            <a
              href="/workspace/tasks"
              className="text-[#4CAF50] font-semibold text-[14px] hover:underline"
            >
              View All My Tasks →
            </a>
          </div>
        </div>
      </div>

      {/* Weather Today Section */}
      <div className="mt-8 mb-8">
        <h2 className="font-semibold text-[#1F2937] mb-5" style={{ fontFamily: "Poppins, sans-serif", fontSize: "20px" }}>
          Weather Today
        </h2>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm text-center">
          {/* Weather Icon */}
          <div className="text-[64px] mb-4">
            {getWeatherIcon(dashboardData.weather.icon)}
          </div>

          {/* Temperature & Condition */}
          <div className="font-bold text-[#1F2937] mb-3" style={{ fontSize: "24px" }}>
            {dashboardData.weather.temperature}°C •{" "}
            {dashboardData.weather.condition}
          </div>

          {/* Condition Message */}
          <div className="text-[#6B7280] text-[14px] mb-5">
            {dashboardData.weather.temperature > 25
              ? "Hot conditions - stay hydrated"
              : "Good conditions for outdoor work"}
          </div>

          {/* Footer Link */}
          <a
            href="/workspace/weather"
            className="text-[#4CAF50] font-semibold text-[14px] hover:underline"
          >
            View Full Forecast →
          </a>
        </div>
      </div>

      {/* Dashboard-level simple modals removed. Individual TaskCard handles status/note flows. */}
    </>
  );
}