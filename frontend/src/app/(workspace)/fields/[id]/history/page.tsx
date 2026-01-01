"use client";

import React, { useState, useEffect, use } from "react";
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
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { fieldService } from "@/services/field.service";

export default function FieldHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [filter, setFilter] = useState<string>("all");
  
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fieldService.getHistory(parseInt(id), filter);
      setHistoryData(data);
    } catch (err: any) {
      console.error("Failed to fetch history:", err);
      setError("Failed to load history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id, filter]);

  const getEventIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "status": return { icon: RefreshCw, bg: "#E8F5E9", color: "#4CAF50" };
      case "task": return { icon: CheckCircle, bg: "#E8F5E9", color: "#4CAF50" };
      case "update": return { icon: Edit2, bg: "#DBEAFE", color: "#3B82F6" };
      case "creation": return { icon: Plus, bg: "#E8F5E9", color: "#4CAF50" };
      case "warning": return { icon: AlertTriangle, bg: "#FEF3C7", color: "#F59E0B" };
      default: return { icon: Calendar, bg: "#F3F4F6", color: "#6B7280" };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      full: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    };
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
        <p className="text-[#6B7280] font-medium">Loading history...</p>
      </div>
    );
  }

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
          Complete history of Field • {historyData.length} total events
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex items-center gap-3 overflow-x-auto pb-2">
        {[
          { id: "all", label: "All Events" },
          { id: "status", label: "Status Changes" },
          { id: "update", label: "Updates" },
          { id: "task", label: "Tasks" },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setFilter(btn.id)}
            className={`h-10 px-5 rounded-lg font-semibold text-[14px] transition-all whitespace-nowrap ${
              filter === btn.id
                ? "bg-[#4CAF50] text-white"
                : "bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* History Timeline */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
        {historyData.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} className="text-[#9CA3AF]" />
            </div>
            <h3 className="font-semibold text-[#1F2937] text-[18px] mb-2">
              No history found
            </h3>
            <p className="text-[#6B7280] text-[15px]">
              No events to show for this field
            </p>
          </div>
        ) : (
          <div className="space-y-0">
            {historyData.map((item, index) => {
              const { icon: Icon, bg, color } = getEventIcon(item.type);
              const isLast = index === historyData.length - 1;
              const formatted = formatDate(item.date);

              return (
                <div
                  key={index}
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
                      style={{ backgroundColor: bg }}
                    >
                      <Icon size={24} style={{ color: color }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      {/* Date & Time */}
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-[#1F2937] text-[17px]">
                          {formatted.full}
                        </span>
                        <span className="text-[#9CA3AF] text-[14px]">
                          {formatted.time}
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

                      {/* User Tag */}
                      <div className="flex items-center gap-2">
                        <span className="text-[#9CA3AF] text-[13px]">By:</span>
                        <span className="text-[#4CAF50] font-semibold text-[13px]">
                          {item.author}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
