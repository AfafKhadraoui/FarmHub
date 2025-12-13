"use client";

import React, { useState, useRef } from "react";
import {
  Clock,
  Activity,
  CheckCircle,
  Droplet,
  Wrench,
  Leaf,
  Scissors,
} from "lucide-react";

// Mock data matching API response
const mockDashboardData = {
  taskStatistics: {
    pending: {
      count: 3,
      label: "Start soon",
    },
    inProgress: {
      count: 2,
      label: "Finish today",
    },
    completed: {
      count: 42,
      label: "Total",
    },
  },
  todayTasks: [
    {
      id: "task_123",
      title: "Water irrigation system - Field A",
      status: "IN_PROGRESS",
      priority: "HIGH",
      dueTime: "2025-11-27T17:00:00Z",
      fieldName: "Field A",
      progressPercent: 60,
    },
    {
      id: "task_125",
      title: "Equipment maintenance check",
      status: "PENDING",
      priority: "MEDIUM",
      dueTime: "2025-11-27T15:00:00Z",
      fieldName: null,
      progressPercent: 0,
    },
  ],
  upcomingTasks: [
    {
      id: "task_124",
      title: "Apply fertilizer - Field B",
      status: "PENDING",
      priority: "MEDIUM",
      dueDate: "2025-11-28T08:00:00Z",
      fieldName: "Field B",
    },
    {
      id: "task_126",
      title: "Harvest Field C",
      status: "PENDING",
      priority: "LOW",
      dueDate: "2025-11-29T10:00:00Z",
      fieldName: "Field C",
    },
  ],
  weather: {
    temperature: 28,
    condition: "Sunny",
    humidity: 45,
    windSpeed: 12,
    icon: "sunny",
  },
};

export function WorkerDashboard() {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const statusButtonRef = useRef<HTMLButtonElement>(null);

  const [dashboardData] = useState(mockDashboardData);

  const handleStatusChange = (status: string) => {
    switch (status) {
      case "complete":
        setShowCompleteModal(true);
        break;
      case "pause":
        setShowPauseModal(true);
        break;
      case "help":
        setShowHelpModal(true);
        break;
      default:
        alert("Status updated");
    }
  };

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
    };
    return iconMap[icon] || "☀️";
  };

  return (
    <>
      {/* Worker Dashboard Page Header */}
      <div className="mb-8">
        <h1
          className="font-bold text-[#1F2937]"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "30px" }}
        >
          My Dashboard
        </h1>
        <p className="mt-2 text-[#6B7280]">Welcome back, Ahmed!</p>
      </div>

      {/* Task Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Card 1: Pending Tasks */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all">
          <div className="w-12 h-12 bg-[#FFF3CD] rounded-full flex items-center justify-center mb-4">
            <Clock size={28} className="text-[#FFC107]" strokeWidth={2} />
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span
              className="font-bold text-[#1F2937]"
              style={{ fontSize: "40px", lineHeight: "1" }}
            >
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
            <span
              className="font-bold text-[#1F2937]"
              style={{ fontSize: "40px", lineHeight: "1" }}
            >
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
            <span
              className="font-bold text-[#1F2937]"
              style={{ fontSize: "40px", lineHeight: "1" }}
            >
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
        <h2
          className="font-semibold text-[#1F2937] mb-5"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "20px" }}
        >
          Today's Tasks
        </h2>

        {dashboardData.todayTasks.map((task) => {
          const Icon = getTaskIcon(task.title);
          const priorityStyle = getPriorityStyle(task.priority);
          const statusStyle = getStatusStyle(task.status);

          return (
            <div
              key={task.id}
              className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm mb-4 hover:border-[#4CAF50] transition-all"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: statusStyle.bg }}
                >
                  <Icon size={24} style={{ color: statusStyle.text }} />
                </div>
                <h3 className="font-semibold text-[#1F2937]">{task.title}</h3>
              </div>

              {/* Details */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span
                  className="px-3 py-1.5 rounded-xl font-bold text-[12px]"
                  style={{
                    backgroundColor: priorityStyle.bg,
                    color: priorityStyle.text,
                  }}
                >
                  {task.priority}
                </span>
                <span className="text-[#6B7280] text-[14px]">
                  Due: {formatDueTime(task.dueTime)}
                </span>
                <span
                  className="px-3 py-1.5 rounded-xl font-bold text-[12px]"
                  style={{
                    backgroundColor: statusStyle.bg,
                    color: statusStyle.text,
                  }}
                >
                  {task.status.replace("_", " ")}
                </span>
              </div>

              {/* Progress - Only for IN_PROGRESS tasks */}
              {task.status === "IN_PROGRESS" && task.progressPercent !== undefined && (
                <div className="mb-5">
                  <div className="font-semibold text-[#374151] mb-2 text-[14px]">
                    Progress: {task.progressPercent}%
                  </div>
                  <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#64B5F6] to-[#2196F3] rounded-full transition-all"
                      style={{ width: `${task.progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative">
                  <button
                    ref={statusButtonRef}
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="h-9 px-5 bg-[#4CAF50] text-white rounded-lg font-semibold hover:bg-[#388E3C] transition-all cursor-pointer text-[14px]"
                  >
                    Update Status
                  </button>
                  {showStatusDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-50">
                      <div className="py-2">
                        <button
                          onClick={() => {
                            handleStatusChange("complete");
                            setShowStatusDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-[#F9FAFB] text-[#374151]"
                        >
                          Mark Complete
                        </button>
                        <button
                          onClick={() => {
                            handleStatusChange("pause");
                            setShowStatusDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-[#F9FAFB] text-[#374151]"
                        >
                          Pause Task
                        </button>
                        <button
                          onClick={() => {
                            handleStatusChange("help");
                            setShowStatusDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-[#F9FAFB] text-[#374151]"
                        >
                          Need Help
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowNoteModal(true)}
                  className="h-9 px-5 bg-white border border-[#D1D5DB] text-[#4B5563] rounded-lg font-semibold hover:bg-[#F9FAFB] transition-all cursor-pointer text-[14px]"
                >
                  Add Note
                </button>
                <button className="h-9 px-5 bg-white border border-[#D1D5DB] text-[#4B5563] rounded-lg font-semibold hover:bg-[#F9FAFB] transition-all cursor-pointer text-[14px]">
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming Tasks Section */}
      <div className="mt-8">
        <h2
          className="font-semibold text-[#1F2937] mb-5"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "20px" }}
        >
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
              href="#"
              className="text-[#4CAF50] font-semibold text-[14px] hover:underline"
            >
              View All My Tasks →
            </a>
          </div>
        </div>
      </div>

      {/* Weather Today Section */}
      <div className="mt-8 mb-8">
        <h2
          className="font-semibold text-[#1F2937] mb-5"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "20px" }}
        >
          Weather Today
        </h2>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm text-center">
          {/* Weather Icon */}
          <div className="text-[64px] mb-4">
            {getWeatherIcon(dashboardData.weather.icon)}
          </div>

          {/* Temperature & Condition */}
          <div
            className="font-bold text-[#1F2937] mb-3"
            style={{ fontSize: "24px" }}
          >
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
            href="#"
            className="text-[#4CAF50] font-semibold text-[14px] hover:underline"
          >
            View Full Forecast →
          </a>
        </div>
      </div>
    </>
  );
}