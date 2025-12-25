import React, { useState } from "react";
import { Modal } from "./Modal";
import { AlertTriangle } from "lucide-react";
import { fieldService } from "@/services/field.service";

interface ArchiveFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  fieldName?: string;
  fieldId: number;
  onSuccess?: () => void;
}

export function ArchiveFieldModal({
  isOpen,
  onClose,
  fieldName = "Field A",
  fieldId,
  onSuccess,
}: ArchiveFieldModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleArchive = async () => {
    setIsLoading(true);
    try {
      await fieldService.update(fieldId, { active: false });
      (window as any).showToast?.("Field archived successfully", "success");
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to archive field:", error);
      (window as any).showToast?.("Failed to archive field", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const footer = (
    <>
      <button
        onClick={onClose}
        className="h-11 px-6 bg-white border border-[#D1D5DB] text-[#4B5563] rounded-lg font-semibold hover:bg-[#F9FAFB] transition-all"
      >
        Cancel
      </button>
      <button
        onClick={handleArchive}
        disabled={isLoading}
        className="h-11 px-6 bg-[#FF9800] text-white rounded-lg font-semibold hover:bg-[#F57C00] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isLoading && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        Archive Field
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      footer={footer}
      width="500px"
    >
      <div className="text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-[#FFF3CD] rounded-full flex items-center justify-center mx-auto mb-5">
          <AlertTriangle size={36} className="text-[#FF9800]" />
        </div>

        {/* Title */}
        <h2
          className="font-bold text-[#1F2937] mb-4"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px" }}
        >
          Archive Field?
        </h2>

        {/* Warning Text */}
        <p className="text-[#374151] mb-4">
          Are you sure you want to archive <strong>{fieldName}</strong>?
        </p>

        {/* Details Box */}
        <div className="bg-[#FFF3CD] border-l-4 border-[#FFC107] rounded-lg p-4 text-left mb-5">
          <p className="text-[#6B7280] text-[14px]">
            This field will be moved to archived fields and won't appear in the
            active fields list. You can restore it later from settings.
          </p>
        </div>

        {/* Impact List */}
        <div className="text-left">
          <p className="font-semibold text-[#374151] text-[14px] mb-3">
            What happens when you archive:
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#6B7280] text-[14px]">
              <span className="text-[#4CAF50]">✓</span>
              <span>All data is preserved</span>
            </div>
            <div className="flex items-center gap-2 text-[14px] text-[#6B7280]">
              <span className="text-[#4CAF50]">✓</span>
              <span>Tasks remain in history</span>
            </div>
            <div className="flex items-center gap-2 text-[14px] text-[#6B7280]">
              <span className="text-[#4CAF50]">✓</span>
              <span>Workers are unassigned</span>
            </div>
            <div className="flex items-center gap-2 text-[14px] text-[#6B7280]">
              <span className="text-[#4CAF50]">✓</span>
              <span>Field can be restored anytime</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
