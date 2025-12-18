"use client";

import React, { useState, useEffect, use } from "react";
import {
  ArrowLeft,
  MapPin,
  Droplet,
  Leaf,
  Bug,
  Plus,
  Calendar,
  Edit2,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { EditFieldModal } from "@/components/workspace/modals/EditFieldModal";
import { ArchiveFieldModal } from "@/components/workspace/modals/ArchiveFieldModal";
import { CreateTaskModal } from "@/components/workspace/modals/CreateTaskModal";
import { fieldService } from "@/services/field.service";

export default function FieldDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showAssignWorkersModal, setShowAssignWorkersModal] = useState(false);

  // Data state
  const [fieldData, setFieldData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Determine user role
  const isAdmin = user?.role === "admin";
  const isWorker = user?.role === "worker";

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fieldId = parseInt(id);

      // Fetch basic details, tasks, and workers
      let data;
      if (isWorker) {
        data = await fieldService.getWorkerFieldDetails(fieldId);
      } else {
        data = await fieldService.getById(fieldId);
      }
      setFieldData(data);

      // Fetch history summary (if admin/farmer)
      if (!isWorker) {
        const historyData = await fieldService.getHistory(fieldId);
        setHistory(historyData.slice(0, 3)); // Only show top 3 for summary
      }
    } catch (err: any) {
      console.error("Failed to fetch field details:", err);
      setError(err.response?.data?.error || "Failed to load field details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && id) {
      fetchData();
    }
  }, [user, id]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      idle: { bg: "#F8D7DA", text: "#721C24" },
      planted: { bg: "#CCE5FF", text: "#004085" },
      growing: { bg: "#D4EDDA", text: "#155724" },
      harvesting: { bg: "#FFF3CD", text: "#856404" },
      harvested: { bg: "#E2E3E5", text: "#383D41" },
    };
    return colors[status.toLowerCase()] || colors.idle;
  };

  const getTaskIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("water") || lowerTitle.includes("irrig")) return <Droplet size={24} className="text-[#3B82F6]" />;
    if (lowerTitle.includes("pest") || lowerTitle.includes("bug")) return <Bug size={24} className="text-[#EF4444]" />;
    return <Leaf size={24} className="text-[#F59E0B]" />;
  };

  const getTaskStatusStyles = (status: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      pending: { bg: "#FEF3C7", text: "#92400E" },
      in_progress: { bg: "#DBEAFE", text: "#1E40AF" },
      completed: { bg: "#D1FAE5", text: "#065F46" },
    };
    return styles[status.toLowerCase()] || styles.pending;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
        <p className="text-[#6B7280] font-medium">Loading field details...</p>
      </div>
    );
  }

  if (error || !fieldData) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center px-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
          <AlertCircle size={32} className="text-red-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#1F2937] mb-2">Oops! Something went wrong</h2>
          <p className="text-[#6B7280]">{error || "Field not found"}</p>
        </div>
        <button
          onClick={() => router.push("/fields")}
          className="mt-4 h-11 px-8 bg-[#4CAF50] text-white rounded-lg font-semibold hover:bg-[#388E3C] transition-all"
        >
          Back to Fields
        </button>
      </div>
    );
  }

  const tasks = fieldData.tasks || [];
  const workers = fieldData.workers || [];
  const activeTasks = tasks.filter((t: any) => t.status !== "completed");

  return (
    <>
      {/* PART 29: Field Details Header & Navigation */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={() => router.push("/fields")}
            className="flex items-center gap-2 text-[#4CAF50] font-medium hover:underline cursor-pointer"
          >
            <ArrowLeft size={20} />
            Back to Fields
          </button>

          {/* Action Buttons - Farmer/Admin only */}
          {isAdmin && (
            <div className="flex items-center gap-3">
              {/* Edit Button */}
              <button
                onClick={() => setShowEditModal(true)}
                className="h-11 px-6 bg-[#4CAF50] text-white rounded-lg font-semibold hover:bg-[#388E3C] transition-all hover:shadow-lg cursor-pointer"
              >
                Edit
              </button>

              {/* Archive Button */}
              <button
                onClick={() => setShowArchiveModal(true)}
                className="h-11 px-6 bg-white border border-[#D1D5DB] text-[#6B7280] rounded-lg font-semibold hover:bg-[#F9FAFB] transition-all cursor-pointer"
              >
                Archive
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PART 30: Field Header */}
      <div className="mb-8 bg-white border border-[#E5E7EB] rounded-2xl p-10 shadow-sm">
        <div className="flex items-center gap-8">
          {/* Icon */}
          <div className="w-24 h-24 bg-[#E8F5E9] rounded-full flex items-center justify-center shrink-0">
            <MapPin size={48} className="text-[#4CAF50]" strokeWidth={2} />
          </div>

          {/* Field Info */}
          <div>
            <div className="flex items-center gap-4">
              <h1
                className="font-bold text-[#1F2937]"
                style={{ fontFamily: "Poppins, sans-serif", fontSize: "32px" }}
              >
                {fieldData.name}
              </h1>
              <span
                className="px-4 py-2 rounded-xl font-bold text-[15px]"
                style={{
                  backgroundColor: getStatusColor(fieldData.status).bg,
                  color: getStatusColor(fieldData.status).text,
                }}
              >
                {fieldData.status.charAt(0).toUpperCase() + fieldData.status.slice(1)}
              </span>
            </div>
            <p className="mt-3 text-[#6B7280] text-[18px]">
              {fieldData.size} hectares • {fieldData.cropType}
            </p>
          </div>
        </div>
      </div>

      {/* PART 31: Information Cards (2 Columns) */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Left Card: Basic Details */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
          <h2
            className="font-semibold text-[#1F2937] text-[22px] mb-6"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Basic Details
          </h2>

          <div className="space-y-5">
            <div>
              <div className="font-semibold text-[#374151] text-[16px] mb-2">
                Size
              </div>
              <div className="text-[#6B7280] text-[15px]">{fieldData.size} hectares</div>
            </div>

            <div>
              <div className="font-semibold text-[#374151] text-[16px] mb-2">
                Crop Type
              </div>
              <div className="text-[#6B7280] text-[15px]">{fieldData.cropType}</div>
            </div>

            <div>
              <div className="font-semibold text-[#374151] text-[16px] mb-2">
                Status
              </div>
              <div className="text-[#6B7280] text-[15px]">
                {fieldData.status.charAt(0).toUpperCase() + fieldData.status.slice(1)}
              </div>
            </div>

            {fieldData.location && (
              <div>
                <div className="font-semibold text-[#374151] text-[16px] mb-2">
                  Location
                </div>
                <div className="text-[#6B7280] text-[15px]">{fieldData.location}</div>
              </div>
            )}

            {/* Progress Section */}
            <div className="mt-8 pt-4 border-t border-[#E5E7EB]">
              <div className="font-semibold text-[#374151] text-[16px] mb-3">
                Progress: {fieldData.progress}%
              </div>
              <div className="w-full h-3 bg-[#E5E7EB] rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-[#81C784] to-[#4CAF50] rounded-full transition-all"
                  style={{ width: `${fieldData.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Timeline */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
          <h2
            className="font-semibold text-[#1F2937] text-[22px] mb-6"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Timeline
          </h2>

          <div className="space-y-5">
            <div>
              <div className="font-semibold text-[#374151] text-[16px] mb-2">
                Planted
              </div>
              <div className="text-[#6B7280] text-[15px]">{formatDate(fieldData.plantedDate)}</div>
            </div>

            <div>
              <div className="font-semibold text-[#374151] text-[16px] mb-2">
                Expected Harvest
              </div>
              <div className="text-[#6B7280] text-[15px]">{formatDate(fieldData.harvestDate)}</div>
            </div>

            {/* Progress Timeline Visual */}
            <div className="mt-8 pt-4 border-t border-[#E5E7EB]">
              <div className="font-semibold text-[#374151] text-[16px] mb-4">
                Growth Cycle
              </div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  {["Planted", "Growing", "Harvest"].map((step, idx) => {
                    const statusOrder = ["planted", "growing", "harvesting", "harvested"];
                    const currentIdx = statusOrder.indexOf(fieldData.status.toLowerCase());
                    const isCompleted = currentIdx >= idx;
                    const isActive = currentIdx === idx;

                    return (
                      <React.Fragment key={step}>
                        <div className="flex flex-col items-center flex-1">
                          <div className={`w-4 h-4 rounded-full ${isCompleted ? "bg-[#4CAF50]" : "bg-[#D1D5DB]"}`}></div>
                          <span className={`mt-2 text-[13px] font-medium ${isCompleted ? "text-[#6B7280]" : "text-[#9CA3AF]"}`}>
                            {step}
                          </span>
                        </div>
                        {idx < 2 && (
                          <div className={`flex-1 h-1 -mx-1 ${currentIdx > idx ? "bg-[#4CAF50]" : "bg-[#D1D5DB]"}`}></div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PART 32: Active Tasks Section - Admin/Farmer or Worker assigned tasks */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2
            className="font-semibold text-[#1F2937]"
            style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px" }}
          >
            {isAdmin ? `Active Tasks (${activeTasks.length} tasks)` : "Your Tasks"}
          </h2>
          {isAdmin && (
            <button
              onClick={() => setShowCreateTaskModal(true)}
              className="h-10 px-4 bg-[#4CAF50] text-white rounded-lg font-semibold hover:bg-[#388E3C] transition-all flex items-center gap-2 text-[14px] cursor-pointer"
            >
              <Plus size={16} />
              Create New Task
            </button>
          )}
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
          {activeTasks.length === 0 ? (
            <p className="text-[#6B7280] italic text-center py-4">No active tasks</p>
          ) : (
            activeTasks.map((task: any, idx: number) => {
              const styles = getTaskStatusStyles(task.status);
              return (
                <div key={task.id} className={`py-5 ${idx !== activeTasks.length - 1 ? "border-b border-[#F3F4F6]" : ""}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                      {getTaskIcon(task.title)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-[#1F2937] text-[17px]">
                          {task.title}
                        </h3>
                        <span
                          className="px-3 py-1.5 rounded-lg font-semibold text-[14px]"
                          style={{ backgroundColor: styles.bg, color: styles.text }}
                        >
                          {task.status.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[#6B7280] text-[15px]">
                        Due: {formatDate(task.dueDate)} 
                        {task.priority && ` • Priority: ${task.priority.toUpperCase()}`}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}


        </div>
      </div>

      {/* PART 33: Assigned Workers Section - Admin/Farmer only */}
      {isAdmin && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="font-semibold text-[#1F2937]"
              style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px" }}
            >
              Assigned Workers ({workers.length} workers)
            </h2>
            {isAdmin && (
              <button
                onClick={() => setShowCreateTaskModal(true)}
                className="h-10 px-4 bg-[#4CAF50] text-white rounded-lg font-semibold hover:bg-[#388E3C] transition-all flex items-center gap-2 text-[14px] cursor-pointer"
              >
                <Plus size={16} />
                Assign Worker
              </button>
            )}
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
            {workers.length === 0 ? (
              <p className="text-[#6B7280] italic text-center py-4">No workers assigned to this field</p>
            ) : (
              workers.map((worker: any, idx: number) => (
                <div key={worker.id} className={`py-5 ${idx !== workers.length - 1 ? "border-b border-[#F3F4F6]" : ""} flex items-center gap-5`}>
                  <div className="relative">
                    <div className="w-14 h-14 bg-linear-to-br from-[#4CAF50] to-[#388E3C] rounded-full flex items-center justify-center text-white font-bold text-[16px]">
                      {worker.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#4CAF50] rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1F2937] text-[17px]">
                      {worker.name}
                    </h3>
                    <p className="text-[#6B7280] mt-1.5 text-[15px]">
                      {worker.email}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* PART 34: Field History Section - Admin/Farmer only */}
      {!isWorker && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="font-semibold text-[#1F2937]"
              style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px" }}
            >
              Field History
            </h2>
            <button
              onClick={() => router.push(`/fields/${id}/history`)}
              className="text-[#4CAF50] font-semibold flex items-center gap-1 hover:underline cursor-pointer text-[15px]"
            >
              View Full History
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
            {history.length === 0 ? (
              <p className="text-[#6B7280] italic text-center py-4">No history records found</p>
            ) : (
              history.map((event: any, idx: number) => (
                <div key={idx} className={`py-5 ${idx !== history.length - 1 ? "border-b border-[#F3F4F6]" : ""} flex items-start gap-5`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    event.type === "status" ? "bg-[#E8F5E9]" : "bg-[#DBEAFE]"
                  }`}>
                    {event.type === "status" ? (
                      <Calendar size={24} className="text-[#4CAF50]" />
                    ) : (
                      <Edit2 size={24} className="text-[#3B82F6]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1F2937] text-[17px]">
                      {formatDate(event.date)}
                    </h3>
                    <p className="text-[#6B7280] mt-2 text-[15px]">
                      {event.title}
                    </p>
                    <p className="text-[#9CA3AF] mt-1.5 text-[14px]">
                      {event.description} • By {event.author}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {showEditModal && (
        <EditFieldModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            fetchData(); // Refresh data after edit
          }}
          fieldId={parseInt(id)}
          fieldData={{
            name: fieldData.name,
            size: fieldData.size.toString(),
            location: fieldData.location || "",
            cropType: fieldData.cropType.toLowerCase(),
            status: fieldData.status.toLowerCase(),
            plantingDate: fieldData.plantedDate ? fieldData.plantedDate.split("T")[0] : "",
            harvestDate: fieldData.harvestDate ? fieldData.harvestDate.split("T")[0] : "",
            description: fieldData.statusNotes || "",
          }}
        />
      )}

      {showArchiveModal && (
        <ArchiveFieldModal
          isOpen={showArchiveModal}
          onClose={() => setShowArchiveModal(false)}
          fieldName={fieldData.name}
          fieldId={parseInt(id)}
          onSuccess={() => router.push("/fields")}
        />
      )}

      {showCreateTaskModal && (
        <CreateTaskModal
          isOpen={showCreateTaskModal}
          onClose={() => {
            setShowCreateTaskModal(false);
            fetchData(); // Refresh data after task creation
          }}
          fieldId={parseInt(id)}
          fieldName={fieldData.name}
        />
      )}
    </>
  );
}
