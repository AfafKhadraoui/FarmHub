import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = "500px",
  showCloseButton = true,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden animate-fadeIn"
        style={{ width, animation: "fadeIn 0.2s ease" }}
      >
        {/* Header */}
        {(title || subtitle || showCloseButton) && (
          <div className="flex items-start justify-between p-6 border-b border-[#E5E7EB]">
            <div className="flex-1">
              {title && (
                <h2
                  className="text-xl font-bold text-[#1F2937]"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-[14px] text-[#6B7280] mt-1">{subtitle}</p>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-4 w-8 h-8 flex items-center justify-center text-[#9CA3AF] hover:text-[#6B7280] hover:bg-[#F3F4F6] rounded-lg transition-colors shrink-0"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] modal-scrollbar">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-[#E5E7EB]">
            {footer}
          </div>
        )}

        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          /* Custom scrollbar for modal content */
          .modal-scrollbar::-webkit-scrollbar {
            width: 6px;
          }

          .modal-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }

          .modal-scrollbar::-webkit-scrollbar-thumb {
            background: #D1D5DB;
            border-radius: 3px;
          }

          .modal-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #9CA3AF;
          }

          /* Firefox scrollbar */
          .modal-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #D1D5DB transparent;
          }
        `}</style>
      </div>
    </div>
  );
}
