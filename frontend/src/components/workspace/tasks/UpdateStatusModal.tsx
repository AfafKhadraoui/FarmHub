'use client';

import React, { useState } from "react";
import { Modal } from "../modals/Modal";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { authService } from '@/services/auth.service';
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
  const [note, setNote] = useState('');

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // If a note was entered, fetch existing notes and append with author/timestamp
      let notesToSend: string | undefined = undefined;

      if (note && note.trim()) {
        const tRes = await api.get(`/tasks/${taskId}`);
        const taskData = tRes.data?.data ?? tRes.data ?? {};
        const existingNotes = taskData.notes ?? '';

        // Fetch current user for attribution (if available)
        let author = 'Unknown';
        try {
          const profile = await authService.fetchProfile();
          author = profile?.name ?? profile?.email ?? 'Unknown';
        } catch (e) {
          // ignore
        }

        const timestamp = new Date().toLocaleString();
        notesToSend = `${existingNotes ? existingNotes + "\n\n" : ''}[${timestamp}] ${author}: ${note}`;
      }

      // Backend route: PATCH /tasks/:id/status
      await api.patch(`/tasks/${taskId}/status`, {
        status: status.toLowerCase() === 'inprogress' ? 'in_progress' : status.toLowerCase(),
        ...(notesToSend ? { notes: notesToSend } : {}),
      });

      onSuccess?.();
      try {
        window.dispatchEvent(new CustomEvent('task:updated', { detail: { id: taskId, status } }));
      } catch (e) {
        // ignore
      }
      setNote('');
      onClose();
    } catch (error: any) {
      console.error("Failed to update status:", error);
      alert(error?.response?.data?.message || "Failed to update task status. Please try again.");
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
      <button
        type="button"
        onClick={onClose}
        disabled={isLoading}
        className="h-11 px-6 bg-white border rounded-lg font-semibold hover:bg-slate-50 transition-all disabled:opacity-50"
        style={{ 
          borderColor: 'var(--admin-border)',
          color: 'var(--admin-text-dark)'
        }}
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading || status === currentStatus}
        className="h-11 px-6 rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50 text-white"
        style={{ backgroundColor: 'var(--admin-primary)' }}
      >
        {isLoading ? "Updating..." : "Update Status"}
      </button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Task Status" footer={footer}>
      <div className="space-y-4">
        <div>
          <p className="text-sm mb-2" style={{ color: 'var(--admin-text-muted)' }}>Task: {taskTitle}</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--admin-text-dark)' }}>
            New Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
            style={{ 
              borderColor: 'var(--admin-border)',
              color: 'var(--admin-text-dark)',
              backgroundColor: 'white',
              // ensure focus ring uses primary color
              ['--tw-ring-color' as any]: 'var(--admin-primary)'
            } as React.CSSProperties}
            disabled={isLoading}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--admin-text-dark)' }}>
            Note (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add an optional note to record why the status changed..."
            rows={4}
            className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 resize-none transition-all"
            style={{ 
              borderColor: 'var(--admin-border)',
              color: 'var(--admin-text-dark)',
              backgroundColor: 'white',
              ['--tw-ring-color' as any]: 'var(--admin-primary)'
            } as React.CSSProperties}
            disabled={isLoading}
          />
        </div>
      </div>
    </Modal>
  );
}

