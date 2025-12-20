// src/components/workspace/tasks/TaskCard.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Droplet, 
  Sprout, 
  Wrench, 
  Shield, 
  TreePine,
  Wheat,
  Scissors,
  Package,
  Activity,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { TaskStatusBadge } from './TaskStatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Button } from '@/components/ui/button';
import { UpdateStatusModal } from './UpdateStatusModal';
import { AddNoteModal } from './AddNoteModal';
import { TaskFormModal } from './TaskFormModal';
import api from '@/lib/api';
import { deleteTask as serviceDeleteTask } from '@/services/task.service';
import { loadWorkersCache, getWorkerFromCache } from '@/services/worker.service';

interface TaskCardProps {
  mode: 'admin' | 'worker';
  task: any;
  onUpdateStatus?: () => void;
  onAddNote?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

// Function to get icon based on task title/type
function getTaskIcon(title: string) {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('irrigation') || lowerTitle.includes('water') || lowerTitle.includes('irrigat')) {
    return { Icon: Droplet, bg: 'bg-blue-50', color: 'text-blue-600' };
  }
  if (lowerTitle.includes('plant') || lowerTitle.includes('seed') || lowerTitle.includes('sow')) {
    return { Icon: Sprout, bg: 'bg-green-50', color: 'text-green-600' };
  }
  if (lowerTitle.includes('harvest') || lowerTitle.includes('pick') || lowerTitle.includes('collect')) {
    return { Icon: Scissors, bg: 'bg-amber-50', color: 'text-amber-600' };
  }
  if (lowerTitle.includes('fertiliz') || lowerTitle.includes('nutrient') || lowerTitle.includes('feed')) {
    return { Icon: Package, bg: 'bg-purple-50', color: 'text-purple-600' };
  }
  if (lowerTitle.includes('maintenance') || lowerTitle.includes('repair') || lowerTitle.includes('fix')) {
    return { Icon: Wrench, bg: 'bg-orange-50', color: 'text-orange-600' };
  }
  if (lowerTitle.includes('pest') || lowerTitle.includes('disease') || lowerTitle.includes('spray')) {
    return { Icon: Shield, bg: 'bg-red-50', color: 'text-red-600' };
  }
  if (lowerTitle.includes('tree') || lowerTitle.includes('orchard')) {
    return { Icon: TreePine, bg: 'bg-emerald-50', color: 'text-emerald-600' };
  }
  if (lowerTitle.includes('wheat') || lowerTitle.includes('grain') || lowerTitle.includes('crop')) {
    return { Icon: Wheat, bg: 'bg-yellow-50', color: 'text-yellow-600' };
  }
  
  // Default icon
  return { Icon: Activity, bg: 'bg-slate-50', color: 'text-slate-600' };
}

export function TaskCard({
  mode,
  task,
  onUpdateStatus,
  onAddNote,
  onDelete,
  onEdit,
}: TaskCardProps) {
  const router = useRouter();
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // Ensure worker cache is loaded so we can resolve assignedWorkerIds
  const [, setCacheLoadedTick] = useState(0);
  useEffect(() => {
    let mounted = true;
    loadWorkersCache().then(() => {
      if (mounted) setCacheLoadedTick((t) => t + 1);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const title = task.title;
  const fieldName = task.fieldName ?? task.field?.name;
  const status = task.status;
  const priority = task.priority;
  const due = task.dueDate || task.dueTime || task.due_date;
  const id = task.id;

  const progress =
    typeof task.progressPercent === 'number'
      ? task.progressPercent
      : typeof task.progress === 'number'
      ? task.progress
      : 60;

  const assignedWorkers = task.assignedWorkers ?? [];
  // Resolve assigned workers from multiple possible backend shapes: assignedWorkers array,
  // assignedWorkerIds array, or taskAssignments relations containing worker info.
  let resolvedAssignedWorkers: any[] = [];

  if (task.assignedWorkers && task.assignedWorkers.length > 0) {
    resolvedAssignedWorkers = task.assignedWorkers;
  } else if (task.taskAssignments && task.taskAssignments.length > 0) {
    resolvedAssignedWorkers = task.taskAssignments.map((ta: any) => {
      // Many backends include a `worker` object on the assignment
      const w = ta.worker ?? (ta.Worker || null);
      if (w) return { id: w.id, name: w.name, initials: w.avatarInitials || (w.name ? w.name[0] : String(w.id)) };
      // fallback to workerId on the assignment
      const wid = ta.workerId ?? ta.WorkerId ?? ta.worker_id;
      const cached = wid ? getWorkerFromCache(Number(wid)) : null;
      return cached ? { id: cached.id, name: cached.name, initials: cached.avatarInitials } : { id: wid, name: `Worker ${wid}`, initials: String(wid).slice(-2) };
    });
  } else {
    resolvedAssignedWorkers = (task.assignedWorkerIds || []).map((wid: number) => {
      const w = getWorkerFromCache(Number(wid));
      if (w) return { id: w.id, name: w.name, initials: w.avatarInitials || (w.name ? w.name[0] : String(w.id)) };
      return { id: wid, name: `Worker ${wid}`, initials: String(wid).slice(-2) };
    });
  }

  // Derive assigned worker ids for edit form initial data regardless of backend shape
  const assignedWorkerIds: number[] = (() => {
    if (Array.isArray(task.assignedWorkerIds) && task.assignedWorkerIds.length > 0) return task.assignedWorkerIds;
    if (Array.isArray(task.assignedWorkers) && task.assignedWorkers.length > 0) return task.assignedWorkers.map((w: any) => Number(w.id));
    if (Array.isArray(task.taskAssignments) && task.taskAssignments.length > 0) {
      return task.taskAssignments.map((ta: any) => Number((ta.worker && ta.worker.id) || ta.workerId || ta.WorkerId || ta.worker_id));
    }
    return [];
  })();
  
  const { Icon, bg, color } = getTaskIcon(title);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      // Use shared service which enforces any client-side contracts
      await serviceDeleteTask(Number(id));

      // Notify listeners and parent components
      try {
        window.dispatchEvent(new CustomEvent('task:updated', { detail: { id: Number(id), status: 'deleted' } }));
      } catch (e) {
        // ignore
      }

      onDelete?.();
      // Soft refresh current route to update lists
      router.refresh();
    } catch (error: any) {
      console.error('Failed to delete task:', error);
      const message = error?.response?.data?.message || error?.message || 'Failed to delete task. Please try again.';
      alert(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSuccess = () => {
    // Soft-refresh the current route and call parent callback if provided
    onUpdateStatus?.();
    router.refresh();
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    onEdit?.();
    handleSuccess();
  };

  return (
    <>
      <div
        className="w-full rounded-2xl border bg-white p-8 shadow-sm hover:shadow-lg transition-all"
        style={{
          borderColor: 'var(--admin-border)',
          borderWidth: '1px'
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = 'var(--admin-primary)';
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = 'var(--admin-border)';
        }}
      >
        {/* Top row */}
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`w-16 h-16 rounded-full ${bg} flex items-center justify-center mb-2`}>{
            <Icon size={28} className={color} />
          }</div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[22px] font-semibold" style={{ color: 'var(--admin-text-dark)' }}>
                {title}
                {fieldName && ` – ${fieldName}`}
              </p>
            </div>

            {/* badges / details row */}
            <div className="mt-3 flex flex-wrap items-center gap-3" style={{ color: 'var(--admin-text-muted)' }}>
              <PriorityBadge priority={priority} />
              {due && (
                <span className="text-[16px]">
                  <span className="font-semibold">Due:</span>{' '}
                  {new Date(due).toLocaleDateString()}, {' '}
                  {new Date(due).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </span>
              )}
              <TaskStatusBadge status={status} />
            </div>

            {/* assigned row (admin only) */}
            {mode === 'admin' && resolvedAssignedWorkers.length > 0 && (
              <div className="mt-3 flex items-center gap-2" style={{ color: 'var(--admin-text-muted)' }}>
                <span className="font-semibold">Assigned to:</span>
                {resolvedAssignedWorkers.map((w: any) => (
                  <span
                    key={w.id}
                    className="inline-flex items-center justify-center rounded-full text-white text-[12px] px-3 py-[4px] font-semibold"
                    style={{ backgroundColor: 'var(--admin-primary)' }}
                  >
                    {w.initials ?? w.name?.[0]}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* progress removed as requested */}

        {/* buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          {mode === 'worker' && (
            <>
              <Button
                type="button"
                className="h-11 rounded-lg text-white px-6 text-[16px] font-semibold"
                style={{ backgroundColor: 'var(--admin-primary)' }}
                onClick={() => setShowUpdateStatusModal(true)}
              >
                Update Status
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-lg bg-white px-6 text-[16px] font-semibold"
                style={{ 
                  borderColor: 'var(--admin-primary)',
                  color: 'var(--admin-primary)'
                }}
                onClick={() => setShowAddNoteModal(true)}
              >
                Add Note
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-lg bg-white px-6 text-[16px] font-semibold"
                style={{ 
                  borderColor: 'var(--admin-border)',
                  color: 'var(--admin-text-dark)'
                }}
                onClick={() => router.push(`/tasks/${id}`)}
              >
                View Details
              </Button>
            </>
          )}

          {mode === 'admin' && (
            <>
              <Button
                type="button"
                className="h-11 rounded-lg text-white px-6 text-[16px] font-semibold"
                style={{ backgroundColor: 'var(--admin-primary)' }}
                onClick={() => router.push(`/tasks/${id}`)}
              >
                View Details
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-lg bg-white px-6 text-[16px] font-semibold"
                style={{
                  borderColor: 'var(--admin-border)',
                  color: 'var(--admin-text-dark)'
                }}
                onClick={() => setShowEditModal(true)}
              >
                Edit
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-lg bg-white px-6 text-[16px] font-semibold"
                style={{
                  borderColor: 'var(--admin-red)',
                  color: 'var(--admin-red)'
                }}
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {mode === 'worker' && (
        <>
          <UpdateStatusModal
            isOpen={showUpdateStatusModal}
            onClose={() => setShowUpdateStatusModal(false)}
            taskId={id}
            taskTitle={title}
            currentStatus={status}
            onSuccess={handleSuccess}
          />
          <AddNoteModal
            isOpen={showAddNoteModal}
            onClose={() => setShowAddNoteModal(false)}
            taskId={id}
            taskTitle={title}
            onSuccess={handleSuccess}
          />
        </>
      )}

          {mode === 'admin' && (
        <TaskFormModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
          initialData={{
            id: id,
            title: title,
            description: task.description || '',
            priority: priority.toLowerCase() as 'low' | 'medium' | 'high',
            dueDate: due ? new Date(due).toISOString().slice(0, 16) : '',
            fieldId: task.fieldId?.toString() || '',
                assignedWorkers: resolvedAssignedWorkers,
                assignedWorkerIds: assignedWorkerIds,
          }}
        />
      )}
    </>
  );
}
