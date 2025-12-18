// src/app/(workspace)/tasks/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import  api  from '@/lib/api';
import { Button } from '@/components/ui/button';
import { TaskStatusBadge } from '@/components/workspace/tasks/TaskStatusBadge';
import { PriorityBadge } from '@/components/workspace/tasks/PriorityBadge';

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
      description: 'Check irrigation lines and run for 2 hours. Ensure all sprinklers are working properly and water reaches all corners of the field.',
      status: 'inprogress',
      priority: 'high',
      dueDate: today17.toISOString(),
      fieldName: 'Field A',
      fieldId: 1,
      progressPercent: 60,
      assignedWorkers: [
        { id: 3, name: 'Ahmed Khalil', initials: 'AK' },
        { id: 5, name: 'Sara Mansouri', initials: 'SM' },
      ],
      notes: 'Halfway done. Need to check the north section.',
      createdAt: new Date(now.getTime() - 2 * 24 * 3600 * 1000).toISOString(),
    },
    '510': {
      id: 510,
      title: 'Apply fertilizer - Field B',
      description: 'Apply organic fertilizer to the entire field. Use spreader for even distribution.',
      status: 'pending',
      priority: 'medium',
      dueDate: new Date(now.getTime() + 24 * 3600 * 1000).toISOString(),
      fieldName: 'Field B',
      fieldId: 2,
      progressPercent: 0,
      assignedWorkers: [{ id: 4, name: 'Ali Belkacem', initials: 'AB' }],
      notes: null,
      createdAt: new Date(now.getTime() - 1 * 24 * 3600 * 1000).toISOString(),
    },
    '515': {
      id: 515,
      title: 'Harvest wheat - Field C',
      description: 'Complete harvest of wheat crop. Use combine harvester and store in designated storage area.',
      status: 'completed',
      priority: 'high',
      dueDate: new Date(now.getTime() - 24 * 3600 * 1000).toISOString(),
      fieldName: 'Field C',
      fieldId: 3,
      progressPercent: 100,
      assignedWorkers: [{ id: 3, name: 'Ahmed Khalil', initials: 'AK' }],
      notes: 'Completed successfully. 500kg harvested.',
      createdAt: new Date(now.getTime() - 7 * 24 * 3600 * 1000).toISOString(),
    },
    // Worker task IDs
    'task_123': {
      id: 'task_123',
      title: 'Water irrigation system - Field A',
      description: 'Check and maintain irrigation system. Inspect all pipes, valves, and sprinklers. Test water pressure and ensure proper distribution across the field. Document any issues found.',
      status: 'INPROGRESS',
      priority: 'HIGH',
      dueDate: today17.toISOString(),
      fieldName: 'Field A',
      field: { id: 'field_001', name: 'Field A' },
      progressPercent: 60,
      progress: 60,
      notes: 'Started checking the irrigation lines. Found one blocked sprinkler in the north corner.',
      createdAt: new Date(now.getTime() - 2 * 24 * 3600 * 1000).toISOString(),
    },
    'task_124': {
      id: 'task_124',
      title: 'Check soil moisture - Field A',
      description: 'Measure moisture levels at different points in the field. Use soil moisture sensor and record values in the field log. Check at depths of 10cm, 20cm, and 30cm.',
      status: 'PENDING',
      priority: 'MEDIUM',
      dueDate: today17.toISOString(),
      fieldName: 'Field A',
      field: { id: 'field_001', name: 'Field A' },
      progressPercent: 0,
      progress: 0,
      notes: null,
      createdAt: new Date(now.getTime() - 1 * 24 * 3600 * 1000).toISOString(),
    },
    'task_125': {
      id: 'task_125',
      title: 'Prune trees - Orchard',
      description: 'Prune all fruit trees in the orchard. Remove dead branches, shape the trees, and ensure proper spacing between branches. Focus on apple and pear trees.',
      status: 'COMPLETED',
      priority: 'LOW',
      dueDate: new Date(now.getTime() - 24 * 3600 * 1000).toISOString(),
      fieldName: 'Orchard',
      field: { id: 'field_002', name: 'Orchard' },
      progressPercent: 100,
      progress: 100,
      notes: 'Completed pruning all 50 trees. All dead branches removed and trees properly shaped.',
      createdAt: new Date(now.getTime() - 7 * 24 * 3600 * 1000).toISOString(),
    },
  };

  return dummyTasks[id] || null;
};

export default function TaskDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [task, setTask] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/tasks/${id}`);
        setTask(res.data);
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

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-[32px] font-extrabold" style={{ color: 'var(--admin-text-dark)' }}>
            Task Details
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>Loading task...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-[32px] font-extrabold" style={{ color: 'var(--admin-text-dark)' }}>
            Task Details
          </h1>
        </div>
        <div className="rounded-[24px] border bg-white shadow-sm p-8" style={{ borderColor: 'var(--admin-border)' }}>
          <p className="text-sm mb-4" style={{ color: 'var(--admin-red)' }}>Task not found.</p>
          <Button 
            variant="outline" 
            onClick={() => router.push('/tasks')}
            className="h-10 rounded-[12px]"
            style={{ 
              borderColor: 'var(--admin-border)',
              color: 'var(--admin-text-dark)'
            }}
          >
            Back to Tasks
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-extrabold" style={{ color: 'var(--admin-text-dark)' }}>
            {task.title}
          </h1>
          {task.fieldName && (
            <p className="mt-1 text-sm" style={{ color: 'var(--admin-text-muted)' }}>
              Field: {task.fieldName}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <PriorityBadge priority={task.priority} />
          <TaskStatusBadge status={task.status} />
        </div>
      </div>

      {/* Main Content Card */}
      <div className="rounded-[24px] border bg-white shadow-sm p-8 space-y-6" style={{ borderColor: 'var(--admin-border)' }}>
        {/* Description Section */}
        <div className="pb-6 border-b" style={{ borderColor: 'var(--admin-border)' }}>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--admin-text-dark)' }}>
            Description
          </h2>
          <p className="text-[15px] leading-relaxed" style={{ color: 'var(--admin-text-muted)' }}>
            {task.description}
          </p>
        </div>

        {/* Task Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b" style={{ borderColor: 'var(--admin-border)' }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--admin-text-muted)' }}>
              Due Date
            </p>
            <p className="text-[15px] font-medium" style={{ color: 'var(--admin-text-dark)' }}>
              {new Date(task.dueDate).toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--admin-text-muted)' }}>
              Priority
            </p>
            <div className="mt-1">
              <PriorityBadge priority={task.priority} />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--admin-text-muted)' }}>
              Status
            </p>
            <div className="mt-1">
              <TaskStatusBadge status={task.status} />
            </div>
          </div>
        </div>

        {/* Progress removed from view per design */}

        {/* Assigned Workers Section */}
        {task.assignedWorkers && task.assignedWorkers.length > 0 && (
          <div className="pb-6 border-b" style={{ borderColor: 'var(--admin-border)' }}>
            <p className="text-base font-semibold mb-3" style={{ color: 'var(--admin-text-dark)' }}>
              Assigned Workers
            </p>
            <div className="flex flex-wrap gap-2">
              {task.assignedWorkers.map((w: any) => (
                <span
                  key={w.id}
                  className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm"
                  style={{ backgroundColor: 'var(--admin-primary)' }}
                >
                  {w.name || w.initials}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Field Section */}
        {task.field && !task.fieldName && (
          <div className="pb-6 border-b" style={{ borderColor: 'var(--admin-border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--admin-text-muted)' }}>
              Field
            </p>
            <p className="text-[15px] font-medium" style={{ color: 'var(--admin-text-dark)' }}>
              {task.field.name}
            </p>
          </div>
        )}

        {/* Notes Section */}
        {task.notes && (
          <div>
            <p className="text-base font-semibold mb-3" style={{ color: 'var(--admin-text-dark)' }}>
              Notes
            </p>
            <div 
              className="p-4 rounded-xl border" 
              style={{ 
                backgroundColor: 'var(--admin-bg-gray)',
                borderColor: 'var(--admin-border)'
              }}
            >
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--admin-text-dark)' }}>
                {task.notes}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          onClick={() => router.push('/tasks')}
          className="h-11 rounded-[12px] px-6 font-semibold"
          style={{ 
            borderColor: 'var(--admin-border)',
            color: 'var(--admin-text-dark)'
          }}
        >
          Back to Tasks
        </Button>
      </div>
    </div>
  );
}
