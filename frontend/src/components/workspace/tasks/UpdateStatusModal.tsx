'use client';

import React, { useState } from "react";
import { Modal } from "../modals/Modal";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: number;
  taskTitle: string;
  currentStatus: string;
  onSuccess?: () => void;
}

export function UpdateStatusModal({
  isOpen,
  onClose,
  taskId,
  taskTitle,
  currentStatus,
  onSuccess,
}: UpdateStatusModalProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await api.patch(`/tasks/${taskId}`, { status: status.toLowerCase() });
      onSuccess?.();
      router.refresh();
      onClose();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update task status. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "inprogress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  const footer = (
    <>
      <Button variant="outline" onClick={onClose} disabled={isLoading}>
        Cancel
      </Button>
      <Button
        onClick={handleSubmit}
        disabled={isLoading || status === currentStatus}
        style={{ backgroundColor: "var(--admin-primary)" }}
        className="hover:opacity-90"
      >
        {isLoading ? "Updating..." : "Update Status"}
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Task Status" footer={footer}>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">Task: {taskTitle}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)]"
            disabled={isLoading}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
}

