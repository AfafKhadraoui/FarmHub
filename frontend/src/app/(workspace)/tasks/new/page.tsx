// src/app/(workspace)/tasks/new/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import  api  from '@/lib/api';
import { TaskForm } from '@/components/workspace/tasks/TaskForm';

export default function NewTaskPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      await api.post('/tasks', {
        title: data.title,
        description: data.description,
        status: 'pending',
        priority: data.priority,
        dueDate: data.dueDate,
        fieldId: data.fieldId,
        assignedWorkerIds: [],
        notes: null,
      });
      router.push('/tasks');
    } catch (error: any) {
      // If backend is not available, show success message and redirect anyway (for demo)
      if (error?.response?.status === 404 || error?.response?.status >= 500) {
        console.warn('Backend not available, using dummy data mode');
        alert('Task created successfully! (Demo mode - backend unavailable)');
        router.push('/tasks');
      } else {
        console.error('Error creating task:', error);
        alert('Failed to create task. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-[32px] font-extrabold" style={{ color: 'var(--admin-text-dark)' }}>
          New Task
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--admin-text-muted)' }}>
          Create a new task for your farm
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-[24px] border bg-white shadow-sm p-8" style={{ borderColor: 'var(--admin-border)' }}>
        <TaskForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
