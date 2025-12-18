import React from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

interface CustomAlertProps {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error";
  message: string;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({
  isOpen,
  onClose,
  type,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideIn">
      <div
        className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg border ${
          type === "success"
            ? "bg-[#E8F5E9] border-[#4CAF50] text-[#1F2937]"
            : "bg-[#FEE2E2] border-[#EF4444] text-[#1F2937]"
        }`}
      >
        {type === "success" ? (
          <CheckCircle size={24} className="text-[#4CAF50]" />
        ) : (
          <AlertCircle size={24} className="text-[#EF4444]" />
        )}
        <p className="font-medium text-[15px]">{message}</p>
        <button
          onClick={onClose}
          className="ml-4 text-[#6B7280] hover:text-[#1F2937] transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};