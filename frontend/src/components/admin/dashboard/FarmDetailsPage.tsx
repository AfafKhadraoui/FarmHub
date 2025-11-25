"use client";

import {
  MapPin,
  Users,
  CheckSquare,
  Calendar,
  Mail,
  Phone,
  ArrowLeft,
  Edit,
  Trash2,
  TrendingUp,
  Clock,
  Activity,
} from "lucide-react";

interface Farm {
  id: number;
  name: string;
  owner: string;
  email: string;
  location: string;
  created: string;
  fields: number;
  tasks: number;
  workers: number;
  status: "active" | "inactive";
  phone?: string;
  description?: string;
  area?: string;
  crops?: string[];
}

interface FarmDetailsPageProps {
  farm: Farm;
  onBack: () => void;
}

// Extended farm data with additional details
const getFarmDetails = (farm: Farm): Farm => ({
  ...farm,
  phone: "+213 555 123 456",
  description:
    "A sustainable farming operation focused on organic produce and modern agricultural practices.",
  area: "45 hectares",
  crops: ["Wheat", "Tomatoes", "Olives", "Dates"],
});

// Sample worker data
// Workers don't have specific roles, they are assigned to tasks
const workersList = [
  {
    id: 1,
    name: "Yacine Brahim",
    email: "yacine@email.com",
    assignedTasks: 8,
    completedTasks: 5,
    avatar: "YB",
    status: "active",
  },
  {
    id: 2,
    name: "Amina Larbi",
    email: "amina@email.com",
    assignedTasks: 6,
    completedTasks: 4,
    avatar: "AL",
    status: "active",
  },
  {
    id: 3,
    name: "Kamel Slimani",
    email: "kamel@email.com",
    assignedTasks: 5,
    completedTasks: 3,
    avatar: "KS",
    status: "active",
  },
  {
    id: 4,
    name: "Samira Hadj",
    email: "samira@email.com",
    assignedTasks: 4,
    completedTasks: 2,
    avatar: "SH",
    status: "active",
  },
];

// Sample recent activity
const recentActivity = [
  {
    id: 1,
    action: "New task created",
    description: "Irrigation system maintenance",
    timestamp: "2 hours ago",
    icon: CheckSquare,
  },
  {
    id: 2,
    action: "Worker assigned",
    description: "Yacine Brahim assigned to Field A",
    timestamp: "5 hours ago",
    icon: Users,
  },
  {
    id: 3,
    action: "Task completed",
    description: "Fertilizer application in Field C",
    timestamp: "1 day ago",
    icon: CheckSquare,
  },
  {
    id: 4,
    action: "Field updated",
    description: "Field B crop rotation completed",
    timestamp: "2 days ago",
    icon: TrendingUp,
  },
];

// Sample fields data
const fieldsList = [
  {
    id: 1,
    name: "Field A",
    area: "12 hectares",
    crop: "Wheat",
    status: "Growing",
    progress: 65,
  },
  {
    id: 2,
    name: "Field B",
    area: "8 hectares",
    crop: "Tomatoes",
    status: "Harvesting",
    progress: 85,
  },
  {
    id: 3,
    name: "Field C",
    area: "15 hectares",
    crop: "Olives",
    status: "Growing",
    progress: 45,
  },
  {
    id: 4,
    name: "Field D",
    area: "10 hectares",
    crop: "Dates",
    status: "Preparing",
    progress: 20,
  },
];

export default function FarmDetailsPage({
  farm,
  onBack,
}: FarmDetailsPageProps) {
  const farmDetails = getFarmDetails(farm);

  return (
    <div>
      {/* Back Button & Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)] transition-colors"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            <ArrowLeft size={20} />
            Back to Farms
          </button>
        </div>

        <div className="flex gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--admin-border)] text-[var(--admin-text-dark)] hover:bg-gray-50 transition-all"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            <Edit size={16} />
            Edit Farm
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-all"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Farm Header Card */}
      <div
        className="bg-white border border-[var(--admin-border)] rounded-2xl p-8 mb-6"
        style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1
                className="text-[var(--admin-text-dark)] text-3xl"
                style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800 }}
              >
                {farmDetails.name}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  farmDetails.status === "active"
                    ? "bg-[var(--admin-primary)]/10 text-[var(--admin-primary)]"
                    : "bg-gray-200 text-[var(--admin-text-muted)]"
                }`}
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
              >
                {farmDetails.status === "active" ? "● Active" : "● Inactive"}
              </span>
            </div>
            <p
              className="text-[var(--admin-text-muted)] mb-4"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "16px" }}
            >
              {farmDetails.description}
            </p>
          </div>
        </div>

        {/* Farm Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--admin-primary)]/10 flex items-center justify-center">
              <Users size={20} className="text-[var(--admin-primary)]" />
            </div>
            <div>
              <div
                className="text-[var(--admin-text-muted)] text-sm mb-1"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Owner
              </div>
              <div
                className="text-[var(--admin-text-dark)] font-semibold"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {farmDetails.owner}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--admin-primary)]/10 flex items-center justify-center">
              <MapPin size={20} className="text-[var(--admin-primary)]" />
            </div>
            <div>
              <div
                className="text-[var(--admin-text-muted)] text-sm mb-1"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Location
              </div>
              <div
                className="text-[var(--admin-text-dark)] font-semibold"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {farmDetails.location}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--admin-primary)]/10 flex items-center justify-center">
              <Mail size={20} className="text-[var(--admin-primary)]" />
            </div>
            <div>
              <div
                className="text-[var(--admin-text-muted)] text-sm mb-1"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Email
              </div>
              <div
                className="text-[var(--admin-text-dark)] font-semibold"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {farmDetails.email}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--admin-primary)]/10 flex items-center justify-center">
              <Calendar size={20} className="text-[var(--admin-primary)]" />
            </div>
            <div>
              <div
                className="text-[var(--admin-text-muted)] text-sm mb-1"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Created
              </div>
              <div
                className="text-[var(--admin-text-dark)] font-semibold"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {farmDetails.created}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div
          className="bg-white border border-[var(--admin-border)] rounded-2xl p-6"
          style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="text-[var(--admin-text-muted)] text-sm"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Total Fields
            </div>
            <MapPin size={18} className="text-[var(--admin-primary)]" />
          </div>
          <div
            className="text-[var(--admin-text-dark)] text-3xl font-bold mb-1"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            {farmDetails.fields}
          </div>
          <div
            className="text-[var(--admin-text-muted)] text-xs"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {farmDetails.area}
          </div>
        </div>

        <div
          className="bg-white border border-[var(--admin-border)] rounded-2xl p-6"
          style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="text-[var(--admin-text-muted)] text-sm"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Active Tasks
            </div>
            <CheckSquare size={18} className="text-[var(--admin-primary)]" />
          </div>
          <div
            className="text-[var(--admin-text-dark)] text-3xl font-bold mb-1"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            {farmDetails.tasks}
          </div>
          <div
            className="text-[var(--admin-text-muted)] text-xs"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            12 completed today
          </div>
        </div>

        <div
          className="bg-white border border-[var(--admin-border)] rounded-2xl p-6"
          style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="text-[var(--admin-text-muted)] text-sm"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Total Workers
            </div>
            <Users size={18} className="text-[var(--admin-primary)]" />
          </div>
          <div
            className="text-[var(--admin-text-dark)] text-3xl font-bold mb-1"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            {farmDetails.workers}
          </div>
          <div
            className="text-[var(--admin-text-muted)] text-xs"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {farmDetails.workers} active now
          </div>
        </div>

        <div
          className="bg-white border border-[var(--admin-border)] rounded-2xl p-6"
          style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="text-[var(--admin-text-muted)] text-sm"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Productivity
            </div>
            <TrendingUp size={18} className="text-[var(--admin-primary)]" />
          </div>
          <div
            className="text-[var(--admin-text-dark)] text-3xl font-bold mb-1"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            87%
          </div>
          <div
            className="text-green-500 text-xs flex items-center gap-1"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
          >
            <TrendingUp size={12} />
            +12% this week
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Fields & Workers */}
        <div className="lg:col-span-2 space-y-6">
          {/* Fields List */}
          <div
            className="bg-white border border-[var(--admin-border)] rounded-2xl p-6"
            style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
          >
            <h3
              className="text-[var(--admin-text-dark)] text-xl mb-4"
              style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}
            >
              Fields Overview
            </h3>

            <div className="space-y-4">
              {fieldsList.map((field) => (
                <div
                  key={field.id}
                  className="border border-[var(--admin-border)] rounded-xl p-4 hover:border-[var(--admin-primary)] transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--admin-primary)]/10 flex items-center justify-center">
                        <MapPin
                          size={18}
                          className="text-[var(--admin-primary)]"
                        />
                      </div>
                      <div>
                        <div
                          className="text-[var(--admin-text-dark)] font-semibold"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          {field.name}
                        </div>
                        <div
                          className="text-[var(--admin-text-muted)] text-sm"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          {field.area} • {field.crop}
                        </div>
                      </div>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-600"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      {field.status}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="text-[var(--admin-text-muted)] text-xs"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Progress
                      </span>
                      <span
                        className="text-[var(--admin-text-dark)] text-xs font-semibold"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {field.progress}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[var(--admin-primary)] to-[var(--admin-secondary)] rounded-full transition-all"
                        style={{ width: `${field.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workers List */}
          <div
            className="bg-white border border-[var(--admin-border)] rounded-2xl p-6"
            style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
          >
            <h3
              className="text-[var(--admin-text-dark)] text-xl mb-4"
              style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}
            >
              Team Members
            </h3>

            <div className="space-y-3">
              {workersList.map((worker) => (
                <div
                  key={worker.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-[var(--admin-border)] hover:border-[var(--admin-primary)] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--admin-primary)] to-[var(--admin-secondary)] flex items-center justify-center text-white font-semibold"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {worker.avatar}
                    </div>
                    <div className="flex-1">
                      <div
                        className="text-[var(--admin-text-dark)] font-semibold"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {worker.name}
                      </div>
                      <div
                        className="text-[var(--admin-text-muted)] text-sm"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {worker.assignedTasks} tasks assigned •{" "}
                        {worker.completedTasks} completed
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div
                        className="text-[var(--admin-text-dark)] text-sm font-semibold"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {Math.round(
                          (worker.completedTasks / worker.assignedTasks) * 100
                        )}
                        %
                      </div>
                      <div
                        className="text-[var(--admin-text-muted)] text-xs"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        completion
                      </div>
                    </div>
                    <span
                      className="w-2 h-2 rounded-full bg-green-500"
                      title="Active"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Activity & Info */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div
            className="bg-white border border-[var(--admin-border)] rounded-2xl p-6"
            style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
          >
            <h3
              className="text-[var(--admin-text-dark)] text-xl mb-4"
              style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}
            >
              Recent Activity
            </h3>

            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--admin-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <activity.icon
                      size={16}
                      className="text-[var(--admin-primary)]"
                    />
                  </div>
                  <div className="flex-1">
                    <div
                      className="text-[var(--admin-text-dark)] font-semibold text-sm mb-1"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {activity.action}
                    </div>
                    <div
                      className="text-[var(--admin-text-muted)] text-xs mb-1"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {activity.description}
                    </div>
                    <div
                      className="text-[var(--admin-text-muted)] text-xs flex items-center gap-1"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      <Clock size={12} />
                      {activity.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div
            className="bg-gradient-to-br from-[var(--admin-primary)]/10 to-[var(--admin-secondary)]/10 border border-[var(--admin-border)] rounded-2xl p-6"
            style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
          >
            <h3
              className="text-[var(--admin-text-dark)] text-lg mb-4"
              style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}
            >
              Farm Information
            </h3>

            <div className="space-y-3">
              <div>
                <div
                  className="text-[var(--admin-text-muted)] text-sm mb-1"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Total Area
                </div>
                <div
                  className="text-[var(--admin-text-dark)] font-semibold"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {farmDetails.area}
                </div>
              </div>

              <div>
                <div
                  className="text-[var(--admin-text-muted)] text-sm mb-1"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Primary Crops
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {farmDetails.crops?.map((crop, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded-lg bg-white text-[var(--admin-primary)] text-xs border border-[var(--admin-primary)]/20"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      {crop}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div
                  className="text-[var(--admin-text-muted)] text-sm mb-1"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Contact Phone
                </div>
                <div
                  className="text-[var(--admin-text-dark)] font-semibold"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {farmDetails.phone}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
