"use client";

import React, { useState } from "react";

import {
  ArrowLeft,
  Archive,
  RefreshCw,
  Calendar,
  MapPin,
  Leaf,
  Search,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

// Mock data for archived fields
const archivedFieldsData = [
  {
    id: "field-001",
    name: "Field A",
    size: "12 hectares",
    location: "North Plot",
    lastCrop: "Wheat",
    archivedDate: "Jan 15, 2025",
    reason: "Seasonal rotation completed",
  },
  {
    id: "field-002",
    name: "Field C",
    size: "8 hectares",
    location: "East Section",
    lastCrop: "Corn",
    archivedDate: "Jan 10, 2025",
    reason: "Field maintenance required",
  },
  {
    id: "field-003",
    name: "South Field",
    size: "15 hectares",
    location: "South Plot",
    lastCrop: "Barley",
    archivedDate: "Jan 5, 2025",
    reason: "Soil regeneration period",
  },
  {
    id: "field-004",
    name: "West Field B",
    size: "10 hectares",
    location: "West Section",
    lastCrop: "Rice",
    archivedDate: "Dec 28, 2024",
    reason: "Irrigation system upgrade",
  },
];

export default function ArchivedFieldsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [fields, setFields] = useState(archivedFieldsData);

  const isAdmin = user?.role === "admin";

  // Filter fields based on search
  const filteredFields = fields.filter((field) =>
    field.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRestore = (fieldId: string) => {
    // In a real app, this would make an API call
    setFields(fields.filter((f) => f.id !== fieldId));
    // Show success message or notification
    alert("Field restored successfully!");
  };

  const handlePermanentDelete = (fieldId: string) => {
    if (
      confirm(
        "Are you sure you want to permanently delete this field? This action cannot be undone."
      )
    ) {
      setFields(fields.filter((f) => f.id !== fieldId));
      alert("Field permanently deleted!");
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/settings")}
          className="flex items-center gap-2 text-[#4CAF50] font-medium hover:underline cursor-pointer"
        >
          <ArrowLeft size={20} />
          Back to Settings
        </button>
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-[#FEF3C7] rounded-xl flex items-center justify-center">
            <Archive size={24} className="text-[#F59E0B]" />
          </div>
          <div>
            <h1
              className="font-bold text-[#1F2937]"
              style={{ fontFamily: "Poppins, sans-serif", fontSize: "32px" }}
            >
              Archived Fields
            </h1>
          </div>
        </div>
        <p className="text-[#6B7280] text-[16px]">
          Manage and restore archived fields • {fields.length} archived field
          {fields.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]"
          />
          <input
            type="text"
            placeholder="Search archived fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-white border border-[#E5E7EB] rounded-xl text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
          />
        </div>
      </div>

      {/* Archived Fields List */}
      {filteredFields.length > 0 ? (
        <div className="space-y-4">
          {filteredFields.map((field) => (
            <div
              key={field.id}
              className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                {/* Field Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-bold text-[#1F2937] text-[20px]">
                      {field.name}
                    </h3>
                    <span className="px-3 py-1 bg-[#FEF3C7] text-[#F59E0B] rounded-full text-[12px] font-semibold">
                      Archived
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-[#9CA3AF]" />
                      <span className="text-[#6B7280] text-[14px]">
                        {field.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Leaf size={16} className="text-[#9CA3AF]" />
                      <span className="text-[#6B7280] text-[14px]">
                        Last crop: {field.lastCrop}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-[#9CA3AF]" />
                      <span className="text-[#6B7280] text-[14px]">
                        Size: {field.size}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Archive size={16} className="text-[#9CA3AF]" />
                      <span className="text-[#6B7280] text-[14px]">
                        {field.archivedDate}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <span className="text-[#9CA3AF] text-[13px] font-semibold">
                        Reason:
                      </span>
                      <span className="text-[#374151] text-[13px]">
                        {field.reason}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {isAdmin && (
                  <div className="flex flex-col gap-2 ml-6">
                    <button
                      onClick={() => handleRestore(field.id)}
                      className="h-10 px-5 bg-[#4CAF50] text-white rounded-lg font-semibold hover:bg-[#388E3C] transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                      <RefreshCw size={16} />
                      Restore
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(field.id)}
                      className="h-10 px-5 bg-white border border-[#F44336] text-[#F44336] rounded-lg font-semibold hover:bg-[#FEE] transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // No Results Message
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 shadow-sm text-center">
          <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4">
            <Archive size={32} className="text-[#9CA3AF]" />
          </div>
          <h3 className="font-semibold text-[#1F2937] text-[18px] mb-2">
            No archived fields found
          </h3>
          <p className="text-[#6B7280] text-[15px]">
            {searchQuery
              ? "Try adjusting your search query"
              : "There are no archived fields at the moment"}
          </p>
        </div>
      )}
    </>
  );
}