"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Plus, ChevronDown, Filter } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AddFieldModal } from "@/components/workspace/modals/AddFieldModal";

interface Field {
  id: number;
  name: string;
  size: string;
  cropType: string;
  status: "idle" | "planted" | "growing" | "harvesting";
  progress: number;
  activeTasks: number;
  assignedWorkers: number;
}

export default function FieldsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [filter, setFilter] = useState<
    "all" | "idle" | "planted" | "growing" | "harvesting"
  >("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);

  // Determine user role
  const isAdmin = user?.role === "admin";
  const isWorker = user?.role === "worker";

  // Mock data - All fields (what admin/farmer sees)
  const allFieldsData: Field[] = [
    {
      id: 1,
      name: "Field A",
      size: "12 hectares",
      cropType: "Wheat",
      status: "growing",
      progress: 80,
      activeTasks: 5,
      assignedWorkers: 3,
    },
    {
      id: 2,
      name: "Field B",
      size: "8 hectares",
      cropType: "Corn",
      status: "planted",
      progress: 40,
      activeTasks: 3,
      assignedWorkers: 2,
    },
    {
      id: 3,
      name: "Field C",
      size: "15 hectares",
      cropType: "Barley",
      status: "harvesting",
      progress: 95,
      activeTasks: 8,
      assignedWorkers: 5,
    },
    {
      id: 4,
      name: "Field D",
      size: "10 hectares",
      cropType: "Potatoes",
      status: "growing",
      progress: 65,
      activeTasks: 4,
      assignedWorkers: 2,
    },
    {
      id: 5,
      name: "Field E",
      size: "6 hectares",
      cropType: "Tomatoes",
      status: "planted",
      progress: 30,
      activeTasks: 2,
      assignedWorkers: 1,
    },
    {
      id: 6,
      name: "Field F",
      size: "20 hectares",
      cropType: "Carrots",
      status: "growing",
      progress: 75,
      activeTasks: 6,
      assignedWorkers: 4,
    },
    {
      id: 7,
      name: "Field G",
      size: "14 hectares",
      cropType: "Lettuce",
      status: "idle",
      progress: 0,
      activeTasks: 0,
      assignedWorkers: 0,
    },
    {
      id: 8,
      name: "Field H",
      size: "9 hectares",
      cropType: "Peppers",
      status: "growing",
      progress: 55,
      activeTasks: 3,
      assignedWorkers: 2,
    },
    {
      id: 9,
      name: "Field I",
      size: "11 hectares",
      cropType: "Onions",
      status: "harvesting",
      progress: 90,
      activeTasks: 5,
      assignedWorkers: 3,
    },
  ];

  // Worker sees only fields they're assigned to (mock: fields 1, 2, 4, 6)
  // In real app: Backend filters by TaskAssignment table where workerId = user.id
  const workerAssignedFieldIds = [1, 2, 4, 6];

  // Role-based filtering
  const allFields = isWorker
    ? allFieldsData.filter((field) => workerAssignedFieldIds.includes(field.id))
    : allFieldsData;

  // Apply status filter
  const fields =
    filter === "all" ? allFields : allFields.filter((f) => f.status === filter);

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      idle: { bg: "#F8D7DA", text: "#721C24" },
      planted: { bg: "#CCE5FF", text: "#004085" },
      growing: { bg: "#D4EDDA", text: "#155724" },
      harvesting: { bg: "#FFF3CD", text: "#856404" },
    };
    return colors[status];
  };

  const handleViewField = (fieldId: number) => {
    router.push(`/fields/${fieldId}`);
  };

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
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-50">
                  <button
                    onClick={() => {
                      setFilter("all");
                      setShowFilterMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-[#F9FAFB] ${
                      filter === "all"
                        ? "bg-[#F0F9F1] text-[#4CAF50] font-semibold"
                        : "text-[#374151]"
                    }`}
                  >
                    All Fields
                  </button>
                  <button
                    onClick={() => {
                      setFilter("idle");
                      setShowFilterMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-[#F9FAFB] ${
                      filter === "idle"
                        ? "bg-[#F0F9F1] text-[#4CAF50] font-semibold"
                        : "text-[#374151]"
                    }`}
                  >
                    Idle
                  </button>
                  <button
                    onClick={() => {
                      setFilter("planted");
                      setShowFilterMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-[#F9FAFB] ${
                      filter === "planted"
                        ? "bg-[#F0F9F1] text-[#4CAF50] font-semibold"
                        : "text-[#374151]"
                    }`}
                  >
                    Planted
                  </button>
                  <button
                    onClick={() => {
                      setFilter("growing");
                      setShowFilterMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-[#F9FAFB] ${
                      filter === "growing"
                        ? "bg-[#F0F9F1] text-[#4CAF50] font-semibold"
                        : "text-[#374151]"
                    }`}
                  >
                    Growing
                  </button>
                  <button
                    onClick={() => {
                      setFilter("harvesting");
                      setShowFilterMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-[#F9FAFB] ${
                      filter === "harvesting"
                        ? "bg-[#F0F9F1] text-[#4CAF50] font-semibold"
                        : "text-[#374151]"
                    }`}
                  >
                    Harvesting
                  </button>
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
        />
      )}

      {/* PART 28: Field Cards - 3x3 Grid */}
      {fields.length === 0 ? (
        <div className="text-center py-16">
          <MapPin size={64} className="text-[#D1D5DB] mx-auto mb-4" />
          <p className="text-[#6B7280] text-lg">No fields found</p>
          {isAdmin && (
            <button
              onClick={() => router.push("/fields/new")}
              className="mt-4 h-11 px-6 bg-[#4CAF50] text-white rounded-lg font-semibold hover:bg-[#388E3C] transition-all"
            >
              Add Your First Field
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-8">
          {fields.map((field) => {
            const statusColor = getStatusColor(field.status);
            return (
              <div
                key={field.id}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all flex flex-col h-[450px]"
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
                <p className="text-[#6B7280] text-[16px] mb-2">{field.size}</p>
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
                  {field.status.charAt(0).toUpperCase() + field.status.slice(1)}
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
