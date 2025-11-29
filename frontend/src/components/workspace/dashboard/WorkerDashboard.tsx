"use client";

import React from "react";
import { CheckSquare, Clock, CheckCircle2, AlertCircle } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
}

function StatCard({ title, value, icon, bgColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}
        >
          {icon}
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

interface TaskItemProps {
  title: string;
  field: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  status: "pending" | "in-progress" | "completed";
}

function TaskItem({ title, field, priority, dueDate, status }: TaskItemProps) {
  const priorityColors = {
    high: "bg-red-100 text-red-700",
    medium: "bg-orange-100 text-orange-700",
    low: "bg-blue-100 text-blue-700",
  };

  const statusIcons = {
    pending: <Clock className="text-orange-500" size={20} />,
    "in-progress": <AlertCircle className="text-blue-500" size={20} />,
    completed: <CheckCircle2 className="text-green-500" size={20} />,
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200">
        {statusIcons[status]}
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">
          {field} • Due {dueDate}
        </p>
      </div>
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[priority]}`}
      >
        {priority.toUpperCase()}
      </span>
    </div>
  );
}

export function WorkerDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Worker Dashboard</h1>
    </div>
  );
}
