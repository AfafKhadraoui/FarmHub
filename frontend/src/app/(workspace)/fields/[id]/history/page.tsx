"use client";

import React, { useState, use } from "react";
import {
  ArrowLeft,
  Calendar,
  Edit2,
  Plus,
  Trash2,
  Users,
  CheckCircle,
  AlertTriangle,
  Archive,
  RefreshCw,
  Droplet,
  Leaf,
  Settings,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

// Mock data for field history
const historyData = [
  {
    id: 1,
    date: "Jan 15, 2025",
    time: "10:30 AM",
    type: "status_change",
    icon: Calendar,
    iconBg: "#E8F5E9",
    iconColor: "#4CAF50",
    title: "Status changed from Idle to Planted",
    description: "Crop: Wheat planted by Ahmed Khalil",
    details:
      "Field preparation completed. Initial soil testing showed optimal conditions for wheat cultivation.",
    user: "Ahmed Khalil",
  },
  {
    id: 2,
    date: "Jan 14, 2025",
    time: "3:15 PM",
    type: "task_completed",
    icon: CheckCircle,
    iconBg: "#E8F5E9",
    iconColor: "#4CAF50",
    title: "Soil preparation task completed",
    description: "Completed by Ahmed Khalil and Sara Mansouri",
    details:
      "Soil tilled and fertilized. Ready for planting. pH level: 6.5, Moisture: 45%",
    user: "Ahmed Khalil",
  },
  {
    id: 3,
    date: "Jan 13, 2025",
    time: "9:00 AM",
    type: "task_assigned",
    icon: Users,
    iconBg: "#DBEAFE",
    iconColor: "#3B82F6",
    title: "Workers assigned to field",
    description: "Ahmed Khalil, Sara Mansouri, and Ali Benali assigned",
    details: "3 workers assigned for soil preparation and planting operations",
    user: "Admin",
  },
  {
    id: 4,
    date: "Jan 10, 2025",
    time: "2:45 PM",
    type: "field_updated",
    icon: Edit2,
    iconBg: "#DBEAFE",
    iconColor: "#3B82F6",
    title: "Field details updated by Admin",
    description: "Size changed from 10ha to 12ha",
    details:
      "Field boundary expanded after survey. New irrigation system coverage calculated.",
    user: "Admin",
  },
  {
    id: 5,
    date: "Jan 8, 2025",
    time: "11:20 AM",
    type: "irrigation",
    icon: Droplet,
    iconBg: "#DBEAFE",
    iconColor: "#3B82F6",
    title: "Irrigation system installed",
    description: "New drip irrigation system installed and tested",
    details:
      "12 zones configured, water pressure tested at 2.5 bar. System operational.",
    user: "Ali Benali",
  },
  {
    id: 6,
    date: "Jan 7, 2025",
    time: "4:00 PM",
    type: "maintenance",
    icon: Settings,
    iconBg: "#FEF3C7",
    iconColor: "#F59E0B",
    title: "Field maintenance completed",
    description: "Fence repaired and drainage channels cleared",
    details:
      "Northern fence section reinforced. All drainage channels inspected and cleared of debris.",
    user: "Ali Benali",
  },
  {
    id: 7,
    date: "Jan 6, 2025",
    time: "10:15 AM",
    type: "soil_test",
    icon: TrendingUp,
    iconBg: "#E8F5E9",
    iconColor: "#4CAF50",
    title: "Soil analysis completed",
    description: "Lab results received - optimal conditions",
    details:
      "pH: 6.8, Nitrogen: High, Phosphorus: Medium, Potassium: High. Recommended crops: Wheat, Barley.",
    user: "Lab",
  },
  {
    id: 8,
    date: "Jan 5, 2025",
    time: "9:00 AM",
    type: "field_created",
    icon: Plus,
    iconBg: "#E8F5E9",
    iconColor: "#4CAF50",
    title: "Field created by Admin",
    description: "Initial setup completed",
    details:
      "Field registered in system. Location: North Plot. Initial size: 10 hectares.",
    user: "Admin",
  },
  {
    id: 9,
    date: "Jan 4, 2025",
    time: "3:30 PM",
    type: "warning",
    icon: AlertTriangle,
    iconBg: "#FEF3C7",
    iconColor: "#F59E0B",
    title: "Field inspection warning",
    description: "Drainage issues detected",
    details:
      "Water pooling observed in northeast corner. Maintenance scheduled.",
    user: "Inspector",
  },
  {
    id: 10,
    date: "Jan 3, 2025",
    time: "1:15 PM",
    type: "fertilizer",
    icon: Leaf,
    iconBg: "#E8F5E9",
    iconColor: "#4CAF50",
    title: "Fertilizer application completed",
    description: "Organic fertilizer spread across entire field",
    details:
      "Applied 500kg organic compost. Coverage: 100%. Estimated nutrient availability: 3 weeks.",
    user: "Sara Mansouri",
  },
];

export default function FieldHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [filter, setFilter] = useState<string>("all");

  const isAdmin = user?.role === "admin";

  // Filter history based on selected type
  const filteredHistory =
    filter === "all"
      ? historyData
      : historyData.filter((item) => item.type === filter);

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={() => router.push(`/fields/${id}`)}
            className="flex items-center gap-2 text-[#4CAF50] font-medium hover:underline cursor-pointer"
          >
            <ArrowLeft size={20} />
            Back to Field Details
          </button>
        </div>
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <h1
          className="font-bold text-[#1F2937] mb-2"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "32px" }}
        >
          Field History
        </h1>
        <p className="text-[#6B7280] text-[16px]">
          Complete history of Field A • {historyData.length} total events
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex items-center gap-3 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`h-10 px-5 rounded-lg font-semibold text-[14px] transition-all ${
            filter === "all"
              ? "bg-[#4CAF50] text-white"
              : "bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]"
          }`}
        >
          All Events
        </button>
        <button
          onClick={() => setFilter("status_change")}
          className={`h-10 px-5 rounded-lg font-semibold text-[14px] transition-all whitespace-nowrap ${
            filter === "status_change"
              ? "bg-[#4CAF50] text-white"
              : "bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]"
          }`}
        >
          Status Changes
        </button>
        <button
          onClick={() => setFilter("field_updated")}
          className={`h-10 px-5 rounded-lg font-semibold text-[14px] transition-all whitespace-nowrap ${
            filter === "field_updated"
              ? "bg-[#4CAF50] text-white"
              : "bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]"
          }`}
        >
          Updates
        </button>
        <button
          onClick={() => setFilter("task_completed")}
          className={`h-10 px-5 rounded-lg font-semibold text-[14px] transition-all whitespace-nowrap ${
            filter === "task_completed"
              ? "bg-[#4CAF50] text-white"
              : "bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]"
          }`}
        >
          Tasks
        </button>
        <button
          onClick={() => setFilter("maintenance")}
          className={`h-10 px-5 rounded-lg font-semibold text-[14px] transition-all whitespace-nowrap ${
            filter === "maintenance"
              ? "bg-[#4CAF50] text-white"
              : "bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]"
          }`}
        >
          Maintenance
        </button>
      </div>

      {/* History Timeline */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
        <div className="space-y-0">
          {filteredHistory.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === filteredHistory.length - 1;

            return (
              <div
                key={item.id}
                className={`relative ${!isLast ? "pb-8" : ""}`}
              >
                {/* Timeline line */}
                {!isLast && (
                  <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-[#E5E7EB]" />
                )}

                <div className="flex items-start gap-5">
                  {/* Icon */}
                  <div
                    className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: item.iconBg }}
                  >
                    <Icon size={24} style={{ color: item.iconColor }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    {/* Date & Time */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-[#1F2937] text-[17px]">
                        {item.date}
                      </span>
                      <span className="text-[#9CA3AF] text-[14px]">
                        {item.time}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-[#1F2937] text-[16px] mb-1">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[#6B7280] text-[15px] mb-2">
                      {item.description}
                    </p>

                    {/* Details Box */}
                    {item.details && (
                      <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 mb-2">
                        <p className="text-[#374151] text-[14px]">
                          {item.details}
                        </p>
                      </div>
                    )}

                    {/* User Tag */}
                    <div className="flex items-center gap-2">
                      <span className="text-[#9CA3AF] text-[13px]">By:</span>
                      <span className="text-[#4CAF50] font-semibold text-[13px]">
                        {item.user}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* No Results Message */}
      {filteredHistory.length === 0 && (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 shadow-sm text-center">
          <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar size={32} className="text-[#9CA3AF]" />
          </div>
          <h3 className="font-semibold text-[#1F2937] text-[18px] mb-2">
            No history found
          </h3>
          <p className="text-[#6B7280] text-[15px]">
            No events match the selected filter
          </p>
        </div>
      )}
    </>
  );
}
