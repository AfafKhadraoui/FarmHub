'use client';

import React, { useState } from "react";
import { Modal } from "../modals/Modal";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { authService } from '@/services/auth.service';
import { useRouter } from "next/navigation";

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: number;
  taskTitle: string;
  currentStatus?: string;
  onSuccess?: () => void;
}

export function AddNoteModal({
  isOpen,
  onClose,
  taskId,
  taskTitle,
  onSuccess,
  currentStatus,
}: AddNoteModalProps) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!note.trim()) {
      alert("Please enter a note");
      return;
    }

    setIsLoading(true);
    try {
      // Fetch existing task to preserve/append notes
      const tRes = await api.get(`/tasks/${taskId}`);
      const taskData = tRes.data?.data ?? tRes.data ?? {};
      const existingNotes = taskData.notes ?? '';

      // Fetch current user for attribution (if available)
      let author = 'Unknown';
      try {
        const profile = await authService.fetchProfile();
        author = profile?.name ?? profile?.email ?? 'Unknown';
      } catch (e) {
        // ignore, use Unknown
      }

      const timestamp = new Date().toLocaleString();
      const appended = `${existingNotes ? existingNotes + "\n\n" : ''}[${timestamp}] ${author}: ${note}`;

      // Use PATCH /tasks/:id/status so workers can add notes without requiring admin PUT permission.
      // We pass the current status to avoid changing it and send appended notes.
      // Use the status from the task data if currentStatus prop is missing.
      const statusToUse = (currentStatus || taskData.status || 'in_progress').toLowerCase();
      const normalizedStatus = statusToUse === 'inprogress' ? 'in_progress' : statusToUse;

      await api.patch(`/tasks/${taskId}/status`, { status: normalizedStatus, notes: appended });
      onSuccess?.();
      setNote("");
      onClose();
    } catch (error: any) {
      console.error("Failed to add note:", error);
      alert(error?.response?.data?.message || "Failed to add note. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const footer = (
    <>
      <button
        type="button"
        onClick={onClose}
        disabled={isLoading}
        className="h-11 px-6 bg-white border rounded-lg font-semibold hover:bg-[#F9FAFB] transition-all disabled:opacity-50"
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
        disabled={isLoading || !note.trim()}
        className="h-11 px-6 rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50 text-white"
        style={{ backgroundColor: "var(--admin-primary)" }}
      >
        {isLoading ? "Adding..." : "Add Note"}
      </button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Note" footer={footer}>
      <div className="space-y-4">
        <div>
          <p className="text-sm mb-2" style={{ color: 'var(--admin-text-muted)' }}>Task: {taskTitle}</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--admin-text-dark)' }}>
            Note
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter your note here..."
            rows={6}
            className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 resize-none transition-all"
            style={{
              borderColor: 'var(--admin-border)',
              color: 'var(--admin-text-dark)',
              backgroundColor: 'white',
              '--tw-ring-color': 'var(--admin-primary)'
            } as React.CSSProperties}
            disabled={isLoading}
          />
        </div>
      </div>
    </Modal>
  );
}

