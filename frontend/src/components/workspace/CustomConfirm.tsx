import React from "react";
import { AlertCircle, RefreshCw, Trash2 } from "lucide-react";

interface CustomConfirmProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    type: "restore" | "delete";
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
}

export const CustomConfirm: React.FC<CustomConfirmProps> = ({
    isOpen,
    onClose,
    onConfirm,
    type,
    title,
    message,
    confirmText,
    cancelText = "Cancel",
    loading = false
}) => {
    if (!isOpen) return null;

    const getIcon = () => {
        if (type === "restore") {
            return <RefreshCw size={20} className="text-[#4CAF50]" />;
        }
        return <Trash2 size={20} className="text-[#F44336]" />;
    };

    const getBgColor = () => {
        return type === "restore" ? "bg-[#E8F5E9]" : "bg-[#FEE2E2]";
    };

    const getButtonColor = () => {
        return type === "restore"
            ? "bg-[#4CAF50] hover:bg-[#388E3C]"
            : "bg-[#F44336] hover:bg-[#D32F2F]";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[3px]">
  <div className="bg-white rounded-2xl shadow-xl border border-[#E5E7EB] max-w-md w-full mx-4 animate-scaleIn">
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getBgColor()}`}>
          {getIcon()}
        </div>
        <h3 className="font-bold text-[#1F2937] text-lg">{title}</h3>
      </div>

      {/* Message */}
      <p className="text-[#6B7280] mb-4">{message}</p>

      {/* Warning for delete */}
      {type === "delete" && (
        <div className="bg-[#FFF3CD] border border-[#FFC107] rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-[#F59E0B]" />
            <p className="text-[#856404] text-sm font-medium">
              Warning: This action cannot be undone.
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onClose}
          disabled={loading}
          className="flex-1 h-11 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`flex-1 h-11 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${getButtonColor()}`}
        >
          {loading ? "Processing..." : (confirmText || title)}
        </button>
      </div>
    </div>
  </div>
</div>

    );
};