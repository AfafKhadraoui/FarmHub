// components/profile/LogoutModal.tsx
import React from "react";
import { Modal } from "@/components/workspace/modals/Modal";
import { LogOut } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutModal = ({ isOpen, onClose, onConfirm }: LogoutModalProps) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title=""
    width="400px"
    showCloseButton={false}
    footer={
      <>
        <button
          onClick={onClose}
          className="h-11 px-6 bg-white border border-[#D1D5DB] text-[#4B5563] rounded-lg font-semibold hover:bg-[#F9FAFB] transition-all"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="h-11 px-6 bg-[#F44336] text-white rounded-lg font-semibold hover:bg-[#D32F2F] transition-all"
        >
          Logout
        </button>
      </>
    }
  >
    <div className="text-center py-4">
      <div className="w-16 h-16 bg-[#FFF3E0] rounded-full flex items-center justify-center mx-auto mb-5">
        <LogOut size={36} className="text-[#FF9800]" />
      </div>
      <h2 className="font-bold text-[#1F2937] mb-4 text-[24px]" style={{ fontFamily: "Poppins, sans-serif" }}>
        Logout?
      </h2>
      <p className="text-[#6B7280]">Are you sure you want to logout?</p>
    </div>
  </Modal>
);