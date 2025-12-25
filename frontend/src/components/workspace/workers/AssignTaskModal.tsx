import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/workspace/modals/Modal';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { assignTaskToWorker, unassignTaskFromWorker } from '@/services/worker.service';
import { TaskFormModal } from '@/components/workspace/tasks/TaskFormModal';

interface AssignTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker: { id: number; name: string };
  onAssigned?: () => void;
}

export default function AssignTaskModal({ isOpen, onClose, worker, onAssigned }: AssignTaskModalProps) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [originalAssigned, setOriginalAssigned] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const load = async () => {
      setLoading(true);
      try {
        // load active/pending/inprogress tasks so admin can choose
        const res = await api.get('/tasks', { params: { page: 1, limit: 50 } }).catch(() => ({ data: { data: [] } }));
        const wrapper = (res.data as any)?.data ?? res.data;
        const items = wrapper?.data ?? wrapper?.items ?? wrapper ?? [];
        setTasks(items);

        // Determine which tasks are already assigned to this worker
        const assignedIds: number[] = [];
        for (const t of items) {
          const taskId = t.id;
          // support multiple backend shapes
          const hasAssigned =
            (Array.isArray(t.assignedWorkers) && t.assignedWorkers.some((w: any) => w?.id === worker.id)) ||
            (Array.isArray(t.assignedWorkerIds) && t.assignedWorkerIds.includes(worker.id)) ||
            (Array.isArray(t.taskAssignments) && t.taskAssignments.some((a: any) => a?.workerId === worker.id || a?.worker?.id === worker.id)) ||
            (Array.isArray(t.assigned) && t.assigned.includes(worker.id));

          if (hasAssigned) assignedIds.push(taskId);
        }

        setSelected(assignedIds);
        setOriginalAssigned(assignedIds);
      } catch (err) {
        console.error('Failed to load tasks for assignment', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isOpen]);

  const toggle = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleAssign = async () => {
    setLoading(true);
    try {
      // compute diffs
      const toAssign = selected.filter(id => !originalAssigned.includes(id));
      const toUnassign = originalAssigned.filter(id => !selected.includes(id));

      for (const taskId of toAssign) {
        await assignTaskToWorker(worker.id, Number(taskId));
      }

      for (const taskId of toUnassign) {
        await unassignTaskFromWorker(worker.id, Number(taskId));
      }

      if (toAssign.length === 0 && toUnassign.length === 0) {
        alert('No changes to assignments');
      } else {
        alert('Assignments updated');
      }

      onAssigned?.();
      onClose();
    } catch (err) {
      console.error('Failed to update assignments', err);
      alert('Failed to update assignments. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Assign Tasks to ${worker.name}`}
        width="820px"
        footer={(
          <>
            <button type="button" onClick={onClose} className="h-11 px-6 bg-white border rounded-lg font-semibold">Cancel</button>
            <button type="button" onClick={handleAssign} disabled={loading || selected.length===0} className="h-11 px-6 bg-[#4CAF50] text-white rounded-lg font-semibold">Assign Selected</button>
          </>
        )}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[13px]" style={{ color: 'var(--admin-text-muted)' }}>Select from existing tasks or create a new one</p>
            <div>
              <button type="button" onClick={() => setShowCreate(true)} className="h-10 px-4 bg-white border rounded-lg">Create New Task</button>
            </div>
          </div>

          {loading && <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>Loading tasks...</p>}

          {!loading && tasks.length === 0 && (
            <p className="text-sm text-[13px]" style={{ color: 'var(--admin-text-muted)' }}>No tasks available</p>
          )}

          {!loading && tasks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
              {tasks.map(t => (
                <label key={t.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-[#F9FAFB] cursor-pointer">
                  <input type="checkbox" checked={selected.includes(t.id)} onChange={() => toggle(t.id)} />
                  <div>
                    <div className="font-semibold" style={{ color: 'var(--admin-text-dark)' }}>{t.title}</div>
                    <div className="text-sm text-[13px]" style={{ color: 'var(--admin-text-muted)' }}>{t.field?.name ?? t.fieldName ?? ''}</div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Create new task modal, preselected to this worker */}
      {showCreate && (
        <TaskFormModal
          isOpen={showCreate}
          onClose={() => setShowCreate(false)}
          onSuccess={() => { setShowCreate(false); onAssigned?.(); onClose(); }}
          initialData={{ assignedWorkerIds: [worker.id] }}
        />
      )}
    </>
  );
}
