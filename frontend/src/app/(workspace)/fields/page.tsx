"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Plus, ChevronDown, Filter, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AddFieldModal } from "@/components/workspace/modals/AddFieldModal";
import { fieldService } from "@/services/field.service";

interface Field {
  id: number;
  name: string;
  size: string;
  cropType: string;
  status: "idle" | "planted" | "growing" | "harvesting" | "harvested";
  progress: number;
  activeTasks: number;
  assignedWorkers: number;
}

export default function FieldsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [filter, setFilter] = useState<
    "all" | "idle" | "planted" | "growing" | "harvested"
  >("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [fieldsData, setFieldsData] = useState<Field[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Determine user role
  const isAdmin = user?.role === "admin";
  const isWorker = user?.role === "worker";

  const fetchFields = async () => {
    try {
      setIsLoading(true);
      let data: any[] = [];

      if (isWorker) {
        data = await fieldService.getWorkerFields();
      } else {
        const response = await fieldService.getAll(1); // Fetch all fields (large limit)
        data = response.data;
      }

      // Map backend data to frontend model
      const mappedFields: Field[] = data.map((field: any) => {
        // Calculate active tasks
        const tasks = field.tasks || [];
        const activeTasksCount = tasks.filter(
          (t: any) => t.status !== "completed"
        ).length;

        // Calculate unique assigned workers
        const workerIds = new Set();
        tasks.forEach((t: any) => {
          if (t.taskAssignments) {
            t.taskAssignments.forEach((ta: any) => {
              if (ta.worker?.id) {
                workerIds.add(ta.worker.id);
              }
            });
          }
        });

        // Backend sends size as number/float, frontend expects string sometimes (e.g. "12 hectares")
        // But backend sends plain number. Let's format it.
        const sizeString = `${field.size} hectares`;

        return {
          id: field.id,
          name: field.name,
          size: sizeString,
          cropType: field.cropType,
          status: field.status,
          progress: field.progress || 0,
          activeTasks: activeTasksCount,
          assignedWorkers: workerIds.size,
        };
      });

      setFieldsData(mappedFields);
    } catch (error) {
      console.error("Failed to fetch fields:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFields();
    }
  }, [user]);

  // Apply status filter
  const fields =
    filter === "all"
      ? fieldsData
      : fieldsData.filter((f) => f.status === filter);

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      idle: { bg: "#F8D7DA", text: "#721C24" },
      planted: { bg: "#CCE5FF", text: "#004085" },
      growing: { bg: "#D4EDDA", text: "#155724" },
      harvested: { bg: "#FEEBC8", text: "#744210" },
    };
    return colors[status] || colors.idle;
  };

  const handleViewField = (fieldId: number) => {
    // router.push(`/fields/${fieldId}`);
    // For now notify not implemented if page doesn't exist
    // Check if the page exists in codebase?
    // Usually it is [id]/page.tsx. Assuming it exists.
    router.push(`/fields/${fieldId}`);
  };

  const handleFieldAdded = () => {
    fetchFields(); // Refresh list after adding
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* PART 26: Fields Page Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          {/* Left - Title Section */}
          <div>
            <h1
              className="font-bold text-[#1F2937]"
              style={{ fontFamily: "Poppins, sans-serif", fontSize: "30px" }}
            >
              Fields
            </h1>
            <p className="mt-2 text-[#6B7280]">
              {isWorker
                ? "View your assigned fields and tasks"
                : "Manage your farm fields and crops"}
            </p>
          </div>

          {/* Right - Filter + Add Button */}
          <div className="flex items-center gap-3">
            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="h-11 px-5 bg-white border border-[#D1D5DB] text-[#4B5563] rounded-lg font-medium flex items-center gap-2 hover:bg-[#F9FAFB] transition-all cursor-pointer"
              >
                {filter === "all"
                  ? "All Fields"
                  : filter.charAt(0).toUpperCase() + filter.slice(1)}
                <ChevronDown size={16} />
              </button>

              {/* Filter Menu */}
              {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {["all", "idle", "planted", "growing", "harvested"].map(
                    (status) => {
                      const statusColor =
                        status !== "all" ? getStatusColor(status) : null;
                      return (
                        <button
                          key={status}
                          onClick={() => {
                            setFilter(status as any);
                            setShowFilterMenu(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-[#F9FAFB] transition-colors ${
                            filter === status
                              ? "bg-[#F0F9F1] text-[#4CAF50] font-semibold"
                              : "text-[#4B5563]"
                          }`}
                        >
                          {status === "all" ? (
                            <div className="w-2.5 h-2.5 rounded-full bg-[#9CA3AF]" />
                          ) : (
                            <div
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: statusColor?.text }}
                            />
                          )}
                          <span className="text-[14px]">
                            {status === "all"
                              ? "All Fields"
                              : status.charAt(0).toUpperCase() +
                                status.slice(1)}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            {/* Add Field Button - Admin/Farmer only */}
            {!isWorker && (
              <button
                onClick={() => setShowAddFieldModal(true)}
                className="h-11 px-6 bg-[#4CAF50] text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-[#388E3C] transition-all hover:shadow-lg cursor-pointer"
              >
                <Plus size={20} />
                Add New Field
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Add Field Modal */}
      {showAddFieldModal && (
        <AddFieldModal
          isOpen={showAddFieldModal}
          onClose={() => setShowAddFieldModal(false)}
          onSuccess={handleFieldAdded}
        />
      )}

      {/* PART 28: Field Cards - 3x3 Grid */}
      {fields.length === 0 ? (
        <div className="text-center py-16">
          <MapPin size={64} className="text-[#D1D5DB] mx-auto mb-4" />
          <p className="text-[#6B7280] text-lg">No fields found</p>
          {isAdmin && (
            <button
              onClick={() => setShowAddFieldModal(true)}
              className="mt-4 h-11 px-6 bg-[#4CAF50] text-white rounded-lg font-semibold hover:bg-[#388E3C] transition-all"
            >
              Add Your First Field
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-8">
          {fields
            .filter((f) => filter === "all" || f.status === filter)
            .map((field) => {
              const statusColor = getStatusColor(field.status);
              return (
                <div
                  key={field.id}
                  className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all flex flex-col h-[480px]"
                >
                  {/* Icon */}
                  <div className="w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center mb-6">
                    <MapPin size={36} className="text-[#4CAF50]" />
                  </div>

                  {/* Field Name */}
                  <h3 className="font-semibold text-[#1F2937] text-[22px] mb-3">
                    {field.name}
                  </h3>

                  {/* Details */}
                  <p className="text-[#6B7280] text-[16px] mb-2">
                    {field.size}
                  </p>
                  <p className="text-[#6B7280] text-[16px] mb-5">
                    {field.cropType}
                  </p>

                  {/* Status Badge */}
                  <span
                    className="inline-block px-4 py-2 rounded-xl font-bold text-[13px] mb-6 w-fit"
                    style={{
                      backgroundColor: statusColor.bg,
                      color: statusColor.text,
                    }}
                  >
                    {field.status.charAt(0).toUpperCase() +
                      field.status.slice(1)}
                  </span>

                  {/* Progress Section */}
                  <div className="mb-8">
                    <div className="font-semibold text-[#374151] mb-3 text-[16px]">
                      Progress: {field.progress}%
                    </div>
                    <div className="w-full h-3 bg-[#E5E7EB] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-[#66BB6A] to-[#4CAF50] rounded-full transition-all"
                        style={{ width: `${field.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-6 text-[15px]">
                    <span className="text-[#6B7280]">
                      Tasks: {field.activeTasks}
                    </span>
                    <span className="text-[#6B7280]">
                      Workers: {field.assignedWorkers}
                    </span>
                  </div>

                  {/* View Button */}
                  <button
                    onClick={() => handleViewField(field.id)}
                    className="w-full h-16 mt-auto px-8 bg-[#4CAF50] text-white rounded-lg font-bold hover:bg-[#388E3C] transition-all hover:shadow-lg cursor-pointer text-[18px]"
                  >
                    View Details
                  </button>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
}
