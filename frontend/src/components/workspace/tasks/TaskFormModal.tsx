// src/components/workspace/tasks/TaskFormModal.tsx
'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Modal } from '@/components/workspace/modals/Modal';
import { TaskForm } from './TaskForm';
import api from '@/lib/api';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: {
    id?: number;
    title?: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
    fieldId?: number;
    assignedWorkers?: { id: number; name: string; initials: string }[];
    assignedWorkerIds?: number[];
  };
}

export function TaskFormModal({ isOpen, onClose, onSuccess, initialData }: TaskFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convert assignedWorkers array to assignedWorkerIds array for TaskForm
  const formInitialData = initialData
    ? {
        ...initialData,
        assignedWorkerIds: initialData.assignedWorkers
          ? initialData.assignedWorkers.map((w) => w.id)
          : initialData.assignedWorkerIds || [],
        fieldId: initialData.fieldId?.toString() || '',
      }
    : undefined;

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (initialData?.id) {
        // Update existing task
        await api.put(`/tasks/${initialData.id}`, {
          title: data.title,
          description: data.description,
          priority: data.priority,
          dueDate: data.dueDate,
          fieldId: data.fieldId,
          assignedWorkerIds: data.assignedWorkerIds || [],
        });
      } else {
        // Create new task
        await api.post('/tasks', {
          title: data.title,
          description: data.description,
          status: 'pending',
          priority: data.priority,
          dueDate: data.dueDate,
          fieldId: data.fieldId,
          assignedWorkerIds: data.assignedWorkerIds || [],
          notes: null,
        });
      }
      onSuccess();
    } catch (error: any) {
      console.error('Error saving task:', error);
      toast.error(error?.response?.data?.message || 'Failed to save task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData?.id ? 'Edit Task' : 'Create New Task'}
      subtitle={initialData?.id ? 'Update task information' : 'Create a new task for your farm'}
      width="800px"
      footer={null}
    >
      <TaskForm
        onSubmit={handleSubmit}
        initialData={formInitialData}
        submitText={isSubmitting ? 'Saving...' : initialData?.id ? 'Update Task' : 'Create Task'}
      />
    </Modal>
  );
}