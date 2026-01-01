// src/app/(workspace)/tasks/[id]/edit/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { TaskForm } from '@/components/workspace/tasks/TaskForm';
import { Button } from '@/components/ui/button';

// Dummy task data for fallback
const getDummyTask = (id: string) => {
  const now = new Date();
  const today17 = new Date(now);
  today17.setHours(17, 0, 0, 0);

  const dummyTasks: Record<string, any> = {
    // Admin task IDs
    '501': {
      id: 501,
      title: 'Water irrigation system - Field A',
      description: 'Check irrigation lines and run for 2 hours',
      status: 'inprogress',
      priority: 'high',
      dueDate: today17.toISOString(),
      fieldId: 1,
    },
    '510': {
      id: 510,
      title: 'Apply fertilizer - Field B',
      description: 'Apply organic fertilizer',
      status: 'pending',
      priority: 'medium',
      dueDate: new Date(now.getTime() + 24 * 3600 * 1000).toISOString(),
      fieldId: 2,
    },
    '515': {
      id: 515,
      title: 'Harvest wheat - Field C',
      description: 'Complete harvest of wheat crop',
      status: 'completed',
      priority: 'high',
      dueDate: new Date(now.getTime() - 24 * 3600 * 1000).toISOString(),
      fieldId: 3,
    },
    // Worker task IDs
    'task_123': {
      id: 'task_123',
      title: 'Water irrigation system - Field A',
      description: 'Check and maintain irrigation system',
      status: 'INPROGRESS',
      priority: 'HIGH',
      dueDate: today17.toISOString(),
      fieldId: 'field_001',
    },
    'task_124': {
      id: 'task_124',
      title: 'Check soil moisture - Field A',
      description: 'Measure moisture and record values',
      status: 'PENDING',
      priority: 'MEDIUM',
      dueDate: today17.toISOString(),
      fieldId: 'field_001',
    },
    'task_125': {
      id: 'task_125',
      title: 'Prune trees - Orchard',
      description: 'Prune all fruit trees in orchard',
      status: 'COMPLETED',
      priority: 'LOW',
      dueDate: new Date(now.getTime() - 24 * 3600 * 1000).toISOString(),
      fieldId: 'field_002',
    },
  };

  return dummyTasks[id] || null;
};

export default function EditTaskPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [task, setTask] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/tasks/${id}`);
        // Backend wraps payload as { success, data }
        const payload = (res.data as any)?.data ?? res.data;
        setTask(payload);
      } catch (error: any) {
        // If backend is not available, use dummy data
        if (error?.response?.status === 404 || error?.response?.status >= 500) {
          console.warn('Backend not available, using dummy data');
          const dummyTask = getDummyTask(id as string);
          if (dummyTask) {
            setTask(dummyTask);
          }
        } else {
          console.error('Error loading task:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (data: any) => {
    try {
      // Match backend route: PUT /tasks/:id for full update
      await api.put(`/tasks/${id}`, {
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate,
        fieldId: data.fieldId,
        assignedWorkerIds: data.assignedWorkerIds || [],
      });
      router.push(`/tasks/${id}`);
    } catch (error: any) {
      // If backend is not available, show success and redirect anyway (for demo)
      if (error?.response?.status === 404 || error?.response?.status >= 500) {
        console.warn('Backend not available, using dummy data mode');
        alert('Task updated successfully! (Demo mode - backend unavailable)');
        router.push(`/tasks/${id}`);
      } else {
        console.error('Error updating task:', error);
        alert('Failed to update task. Please try again.');
      }
    }
  };

  if (isLoading) {
    return <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>Loading task...</p>;
  }

  if (!task) {
    return (
      <div className="space-y-4">
        <p className="text-sm" style={{ color: 'var(--admin-red)' }}>Task not found.</p>
        <Button variant="outline" onClick={() => router.push('/tasks')}>
          Back to Tasks
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-extrabold" style={{ color: 'var(--admin-text-dark)' }}>
            Edit Task
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--admin-text-muted)' }}>
            Update task information
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => router.push(`/tasks/${id}`)}
          className="h-11 rounded-[12px] px-6 font-semibold"
          style={{ 
            borderColor: 'var(--admin-border)',
            color: 'var(--admin-text-dark)'
          }}
        >
          Cancel
        </Button>
      </div>

      {/* Form Card */}
      <div className="rounded-[24px] border bg-white shadow-sm p-8" style={{ borderColor: 'var(--admin-border)' }}>
        <TaskForm 
          onSubmit={handleSubmit}
          submitText="Update Task"
          initialData={{
              title: task.title,
              description: task.description || '',
              priority: task.priority.toLowerCase() as 'low' | 'medium' | 'high',
              dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '',
              fieldId: task.fieldId?.toString() || '',
              // Support both shapes: assignedWorkers (objects) or assignedWorkerIds (array of ids)
              assignedWorkerIds: Array.isArray(task.assignedWorkerIds)
                ? task.assignedWorkerIds.map((id: any) => Number(id))
                : task.assignedWorkers
                  ? task.assignedWorkers.map((w: any) => Number(w.id))
                  : [],
            }}
        />
      </div>
    </div>
  );
}

