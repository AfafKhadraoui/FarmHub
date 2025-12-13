'use client';

import React, { useState } from "react";
import { Modal } from "../modals/Modal";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: number;
  taskTitle: string;
  onSuccess?: () => void;
}

export function AddNoteModal({
  isOpen,
  onClose,
  taskId,
  taskTitle,
  onSuccess,
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
      await api.patch(`/tasks/${taskId}`, { notes: note });
      onSuccess?.();
      router.refresh();
      setNote("");
      onClose();
    } catch (error) {
      console.error("Failed to add note:", error);
      alert("Failed to add note. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const footer = (
    <>
      <Button variant="outline" onClick={onClose} disabled={isLoading}>
        Cancel
      </Button>
      <Button
        onClick={handleSubmit}
        disabled={isLoading || !note.trim()}
        style={{ backgroundColor: "var(--admin-primary)" }}
        className="hover:opacity-90"
      >
        {isLoading ? "Adding..." : "Add Note"}
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Note" footer={footer}>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">Task: {taskTitle}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter your note here..."
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] resize-none"
            disabled={isLoading}
          />
        </div>
      </div>
    </Modal>
  );
}

