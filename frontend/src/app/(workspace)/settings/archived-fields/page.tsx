"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Archive,
  RefreshCw,
  Calendar,
  MapPin,
  Leaf,
  Search,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useArchivedFields } from "@/hooks/useArchivedFields";
import { CustomAlert } from "@/components/workspace/CustomAlert";
import { CustomConfirm } from "@/components/workspace/CustomConfirm";

export default function ArchivedFieldsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    fields,
    loading,
    error,
    fetchArchivedFields,
    restoreField,
    permanentDeleteField
  } = useArchivedFields();

  // Alert state
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    message: string;
  }>({
    isOpen: false,
    type: "success",
    message: ""
  });

  // Confirmation state
  const [confirmation, setConfirmation] = useState<{
    isOpen: boolean;
    type: "restore" | "delete";
    fieldId: string;
    fieldName: string;
  }>({
    isOpen: false,
    type: "restore",
    fieldId: "",
    fieldName: ""
  });

  const isAdmin = user?.role === "admin";

  // Fetch data on mount
  useEffect(() => {
    fetchArchivedFields();
  }, [fetchArchivedFields]);

  // Filter fields
  const filteredFields = fields.filter((field) =>
    field.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ isOpen: true, type, message });
  };

  const closeAlert = () => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  };

  const showConfirmation = (type: "restore" | "delete", fieldId: string, fieldName: string) => {
    setConfirmation({
      isOpen: true,
      type,
      fieldId,
      fieldName
    });
  };

  const closeConfirmation = () => {
    setConfirmation(prev => ({ ...prev, isOpen: false }));
  };

  const handleRestoreClick = (fieldId: string, fieldName: string) => {
    if (!isAdmin) {
      showAlert("error", "Only admins can restore fields");
      return;
    }
    showConfirmation("restore", fieldId, fieldName);
  };

  const handleDeleteClick = (fieldId: string, fieldName: string) => {
    if (!isAdmin) {
      showAlert("error", "Only admins can delete fields");
      return;
    }
    showConfirmation("delete", fieldId, fieldName);
  };

  const handleRestoreConfirm = async () => {
    try {
      await restoreField(confirmation.fieldId);
      showAlert("success", `"${confirmation.fieldName}" restored successfully!`);
      closeConfirmation();
    } catch (error) {
      showAlert("error", "Failed to restore field. Please try again.");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await permanentDeleteField(confirmation.fieldId);
      showAlert("success", `"${confirmation.fieldName}" permanently deleted!`);
      closeConfirmation();
    } catch (error) {
      showAlert("error", "Failed to delete field. Please try again.");
    }
  };

  // Loading state
  if (loading && fields.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-blue-600" />
        </div>
      </div>
    );
  }

  // Error state
  if (error && fields.length === 0) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Error loading archived fields</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={fetchArchivedFields}
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
            <h1 className="font-bold text-[#1F2937]" style={{ fontFamily: "Poppins, sans-serif", fontSize: "32px" }}>
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
                      onClick={() => handleRestoreClick(field.id, field.name)}
                      disabled={loading}
                      className="h-10 px-5 bg-[#4CAF50] text-white rounded-lg font-semibold hover:bg-[#388E3C] transition-all flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RefreshCw size={16} />
                      Restore
                    </button>
                    <button
                      onClick={() => handleDeleteClick(field.id, field.name)}
                      disabled={loading}
                      className="h-10 px-5 bg-white border border-[#F44336] text-[#F44336] rounded-lg font-semibold hover:bg-[#FEE] transition-all flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={16} />
                      Delete Permanently
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
            {searchQuery ? "No matching fields found" : "No archived fields"}
          </h3>
          <p className="text-[#6B7280] text-[15px] mb-4">
            {searchQuery
              ? "Try adjusting your search query"
              : "There are no archived fields at the moment"}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-[#4CAF50] font-semibold text-[14px] hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Custom Alert */}
      <CustomAlert
        isOpen={alert.isOpen}
        onClose={closeAlert}
        type={alert.type}
        message={alert.message}
      />

      {/* Custom Confirmation Dialog */}
      <CustomConfirm
        isOpen={confirmation.isOpen}
        onClose={closeConfirmation}
        onConfirm={confirmation.type === "restore" ? handleRestoreConfirm : handleDeleteConfirm}
        type={confirmation.type}
        title={confirmation.type === "restore" ? "Restore Field" : "Delete Field"}
        message={
          confirmation.type === "restore"
            ? `Are you sure you want to restore "${confirmation.fieldName}"? This field will become active again.`
            : `Are you sure you want to permanently delete "${confirmation.fieldName}"? All related data will be lost.`
        }
        confirmText={confirmation.type === "restore" ? "Restore Field" : "Delete Permanently"}
        loading={loading}
      />
    </>
  );
}