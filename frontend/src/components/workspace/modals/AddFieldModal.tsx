"use client";

import React, { useState } from "react";
import { Modal } from "./Modal";
import { Calendar } from "lucide-react";
import { fieldService } from "@/services/field.service";

interface AddFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddFieldModal({
  isOpen,
  onClose,
  onSuccess,
}: AddFieldModalProps): React.JSX.Element {
  const [formData, setFormData] = useState({
    fieldName: "",
    size: "",
    location: "",
    cropType: "",
    customCrop: "",
    plantingDate: "",
    harvestDate: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Comprehensive Validation
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.fieldName.trim()) {
      newErrors.fieldName = "Field name is required";
    } else if (formData.fieldName.trim().length < 2) {
      newErrors.fieldName = "Field name must be at least 2 characters";
    }

    if (!formData.size) {
      newErrors.size = "Size is required";
    } else if (parseFloat(formData.size) <= 0) {
      newErrors.size = "Size must be greater than 0";
    } else if (parseFloat(formData.size) > 10000) {
      newErrors.size = "Size seems too large. Please verify.";
    }

    if (!formData.cropType) {
      newErrors.cropType = "Crop type is required";
    }

    if (formData.cropType === "other" && !formData.customCrop.trim()) {
      newErrors.customCrop = "Please specify the crop name";
    }

    // Date validations
    if (formData.plantingDate && formData.harvestDate) {
      const plantDate = new Date(formData.plantingDate);
      const harvestDate = new Date(formData.harvestDate);

      if (harvestDate < plantDate) {
        newErrors.harvestDate = "Harvest date cannot be before planting date";
      }

      // Check if dates are too far apart (more than 2 years)
      const daysDiff =
        (harvestDate.getTime() - plantDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff > 730) {
        newErrors.harvestDate = "Harvest date seems too far in the future";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const crop =
        formData.cropType === "other" ? formData.customCrop : formData.cropType;

      await fieldService.create({
        name: formData.fieldName,
        size: parseFloat(formData.size),
        cropType: crop,
        status: "planted", // Default status
        plantedDate: formData.plantingDate || null,
        harvestDate: formData.harvestDate || null,
      });

      onClose();
      if (onSuccess) onSuccess();
      (window as any).showToast?.("Field created successfully!", "success");

      // Reset form
      setFormData({
        fieldName: "",
        size: "",
        location: "",
        cropType: "",
        customCrop: "",
        plantingDate: "",
        harvestDate: "",
        description: "",
      });
    } catch (error) {
      console.error("Failed to create field:", error);
      (window as any).showToast?.("Failed to create field", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.fieldName &&
    formData.size &&
    formData.cropType &&
    (formData.cropType !== "other" || formData.customCrop.trim() !== "");

  const footer = (
    <>
      <button
        onClick={onClose}
        className="h-11 px-6 bg-white border border-[#D1D5DB] text-[#4B5563] rounded-lg font-semibold hover:bg-[#F9FAFB] transition-all"
      >
        Cancel
      </button>
      <button
        onClick={handleSubmit}
        disabled={!isFormValid || isLoading}
        className="h-11 px-6 bg-[#4CAF50] text-white rounded-lg font-semibold hover:bg-[#388E3C] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isLoading && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        Create Field
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Field"
      subtitle="Create a new field in your farm"
      footer={footer}
      width="700px"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div>
          <h3 className="font-semibold text-[#1F2937] mb-4">
            Basic Information
          </h3>

          {/* Field Name */}
          <div className="mb-4">
            <label className="block font-medium text-[#374151] mb-2">
              Field Name <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="text"
              value={formData.fieldName}
              onChange={(e) => {
                setFormData({ ...formData, fieldName: e.target.value });
                if (errors.fieldName) setErrors({ ...errors, fieldName: "" });
              }}
              placeholder="e.g., North Field, Field A"
              className={`w-full h-11 px-4 border ${
                errors.fieldName ? "border-red-500" : "border-[#D1D5DB]"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent`}
            />
            {errors.fieldName && (
              <p className="mt-1 text-xs text-red-500">{errors.fieldName}</p>
            )}
          </div>

          {/* Size */}
          <div className="mb-4">
            <label className="block font-medium text-[#374151] mb-2">
              Size (hectares) <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="10000"
              value={formData.size}
              onChange={(e) => {
                setFormData({ ...formData, size: e.target.value });
                if (errors.size) setErrors({ ...errors, size: "" });
              }}
              placeholder="e.g., 12"
              className={`w-full h-11 px-4 border ${
                errors.size ? "border-red-500" : "border-[#D1D5DB]"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent`}
            />
            {errors.size && (
              <p className="mt-1 text-xs text-red-500">{errors.size}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block font-medium text-[#374151] mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="e.g., North Plot, Section A"
              className="w-full h-11 px-4 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            />
          </div>
        </div>

        {/* Section 2: Crop Information */}
        <div>
          <h3 className="font-semibold text-[#1F2937] mb-4">
            Crop Information
          </h3>

          {/* Crop Type */}
          <div className="mb-4">
            <label className="block font-medium text-[#374151] mb-2">
              Crop Type <span className="text-[#EF4444]">*</span>
            </label>
            <select
              value={formData.cropType}
              onChange={(e) => {
                setFormData({ ...formData, cropType: e.target.value });
                if (errors.cropType) setErrors({ ...errors, cropType: "" });
              }}
              className={`w-full h-11 px-4 border ${
                errors.cropType ? "border-red-500" : "border-[#D1D5DB]"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent bg-white`}
            >
              <option value="">Select crop type</option>
              <option value="wheat">Wheat</option>
              <option value="corn">Corn</option>
              <option value="barley">Barley</option>
              <option value="tomatoes">Tomatoes</option>
              <option value="potatoes">Potatoes</option>
              <option value="carrots">Carrots</option>
              <option value="lettuce">Lettuce</option>
              <option value="peppers">Peppers</option>
              <option value="onions">Onions</option>
              <option value="other">Other</option>
            </select>
            {errors.cropType && (
              <p className="mt-1 text-xs text-red-500">{errors.cropType}</p>
            )}
          </div>

          {/* Custom Crop (if Other selected) */}
          {formData.cropType === "other" && (
            <div>
              <label className="block font-medium text-[#374151] mb-2">
                Specify Crop <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                value={formData.customCrop}
                onChange={(e) => {
                  setFormData({ ...formData, customCrop: e.target.value });
                  if (errors.customCrop)
                    setErrors({ ...errors, customCrop: "" });
                }}
                placeholder="Enter crop name"
                className={`w-full h-11 px-4 border ${
                  errors.customCrop ? "border-red-500" : "border-[#D1D5DB]"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent`}
              />
              {errors.customCrop && (
                <p className="mt-1 text-xs text-red-500">{errors.customCrop}</p>
              )}
            </div>
          )}
        </div>

        {/* Section 3: Timeline */}
        <div>
          <h3 className="font-semibold text-[#1F2937] mb-4">Timeline</h3>

          <div className="grid grid-cols-2 gap-4">
            {/* Planting Date */}
            <div>
              <label className="block font-medium text-[#374151] mb-2">
                Planting Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.plantingDate}
                  onChange={(e) =>
                    setFormData({ ...formData, plantingDate: e.target.value })
                  }
                  className="w-full h-11 px-4 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                />
              </div>
            </div>

            {/* Expected Harvest Date */}
            <div>
              <label className="block font-medium text-[#374151] mb-2">
                Expected Harvest Date
              </label>
              <input
                type="date"
                value={formData.harvestDate}
                onChange={(e) =>
                  setFormData({ ...formData, harvestDate: e.target.value })
                }
                className={`w-full h-11 px-4 border ${
                  errors.harvestDate ? "border-red-500" : "border-[#D1D5DB]"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent`}
              />
              {errors.harvestDate && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.harvestDate}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Additional Details */}
        <div>
          <h3 className="font-semibold text-[#1F2937] mb-4">
            Additional Details
          </h3>

          {/* Description */}
          <div>
            <label className="block font-medium text-[#374151] mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Add any additional notes about this field..."
              rows={4}
              className="w-full px-4 py-3 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent resize-none"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
