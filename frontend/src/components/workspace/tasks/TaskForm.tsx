// src/components/workspace/tasks/TaskForm.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Modal } from '@/components/workspace/modals/Modal';
import api from '@/lib/api';

interface TaskFormProps {
  onSubmit: (data: any) => void;
  initialData?: {
    title?: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
    fieldId?: string;
    assignedWorkerIds?: number[];
  };
  submitText?: string;
}

export function TaskForm({ onSubmit, initialData, submitText = 'Create Task' }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(initialData?.priority || 'medium');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
  const [fieldId, setFieldId] = useState(initialData?.fieldId || '');
  const [assignedWorkerIds, setAssignedWorkerIds] = useState<number[]>(initialData?.assignedWorkerIds || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // For now fields remain static demo values – backend /fields integration can be added later.
  const [fields, setFields] = useState<{ id: number; name: string; size?: string }[]>([]);
  const [isLoadingFields, setIsLoadingFields] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadFields = async () => {
      setIsLoadingFields(true);
      try {
        // Use paginated endpoint used by backend: GET /fields/paginated
        const res = await api.get('/fields/paginated', { params: { page: 1, limit: 200 } });
        const wrapper = (res.data as any)?.data ?? res.data;
        // backend returns { data: [fields], meta: { ... } }
        const items = Array.isArray(wrapper) ? wrapper : wrapper?.data ?? wrapper?.items ?? [];
        const mapped = (items as any[]).map((f) => ({ id: f.id, name: f.name, size: f.size || f.area || '—' }));
        if (mounted) setFields(mapped);
      } catch (e) {
        console.warn('Failed to load fields for task form', e);
        if (mounted) setFields([]);
      } finally {
        if (mounted) setIsLoadingFields(false);
      }
    };

    loadFields();
    return () => {
      mounted = false;
    };
  }, []);

  const [availableWorkers, setAvailableWorkers] = useState<
    { id: number; name: string; initials: string }[]
  >([]);

  const [showWorkersPanel, setShowWorkersPanel] = useState(false);
  const [workerSearch, setWorkerSearch] = useState('');
  const [isLoadingWorkers, setIsLoadingWorkers] = useState(false);

  // Load real workers from backend so assignments use real IDs
  useEffect(() => {
    const loadWorkers = async () => {
      setIsLoadingWorkers(true);
      try {
        const res = await api
          .get('/workers', { params: { page: 1, limit: 50 } })
          .catch(() => ({ data: { items: [] } }));

        const wrapper = (res.data as any)?.data ?? res.data;
        const items = wrapper?.items ?? wrapper ?? [];

        const mapped = (items as any[]).map((w) => ({
          id: w.id,
          name: w.name,
          initials:
            w.avatarInitials ||
            (w.name
              ? w.name
                  .split(' ')
                  .map((p: string) => p[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()
              : ''),
        }));

        setAvailableWorkers(mapped);
      } catch {
        console.warn('Failed to load workers for task form');
      } finally {
        setIsLoadingWorkers(false);
      }
    };

    loadWorkers();
  }, []);

  // Minimum allowed date/time (prevent selecting past dates)
  const minDateTime = useMemo(() => {
    const d = new Date();
    // Round down seconds/milliseconds to keep input valid
    d.setSeconds(0, 0);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Task title is required";
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (title.trim().length > 100) {
      newErrors.title = "Title is too long (max 100 characters)";
    }

    if (!dueDate) {
      newErrors.dueDate = "Due date is required";
    } else {
      const selectedDate = new Date(dueDate);
      const now = new Date();

      if (selectedDate.getTime() < now.getTime() - 60000) {
        newErrors.dueDate = "Due date cannot be in the past";
      }

      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      if (selectedDate > oneYearFromNow) {
        newErrors.dueDate = "Due date cannot be more than 1 year in the future";
      }
    }

    if (description && description.length > 500) {
      newErrors.description = "Description is too long (max 500 characters)";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    await onSubmit({
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      fieldId: fieldId ? Number(fieldId) : null,
      assignedWorkerIds,
    });
    setIsSubmitting(false);
  };

  // Get assigned workers details
  const assignedWorkers = availableWorkers.filter((w) => assignedWorkerIds.includes(w.id));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Field */}
      <div>
        <Label 
          htmlFor="title" 
          className="text-sm font-semibold mb-2 block"
          style={{ color: 'var(--admin-text-dark)' }}
        >
          Task Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors({ ...errors, title: '' });
          }}
          placeholder="Water irrigation system - Field A"
          required
          className={`h-12 rounded-xl ${errors.title ? 'border-red-500' : ''}`}
          style={{ 
            borderColor: errors.title ? '#ef4444' : 'var(--admin-border)',
            color: 'var(--admin-text-dark)'
          }}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-500">{errors.title}</p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <Label 
          htmlFor="description" 
          className="text-sm font-semibold mb-2 block"
          style={{ color: 'var(--admin-text-dark)' }}
        >
          Description <span className="text-xs text-gray-500">(optional, max 500 chars)</span>
        </Label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors({ ...errors, description: '' });
          }}
          placeholder="Describe what needs to be done..."
          rows={4}
          maxLength={500}
          className={`w-full px-4 py-3 rounded-xl border resize-none focus:outline-none focus:ring-2 transition-all ${
            errors.description ? 'border-red-500' : ''
          }`}
          style={{ 
            borderColor: errors.description ? '#ef4444' : 'var(--admin-border)',
            color: 'var(--admin-text-dark)',
            backgroundColor: 'white',
            '--tw-ring-color': 'var(--admin-primary)'
          } as React.CSSProperties}
          onFocus={(e) => {
            if (!errors.description) e.target.style.borderColor = 'var(--admin-primary)';
          }}
          onBlur={(e) => {
            if (!errors.description) e.target.style.borderColor = 'var(--admin-border)';
          }}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-500">{errors.description}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">{description.length}/500 characters</p>
      </div>

      {/* Priority and Due Date Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label 
            className="text-sm font-semibold mb-2 block"
            style={{ color: 'var(--admin-text-dark)' }}
          >
            Priority <span className="text-red-500">*</span>
          </Label>
          <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
            <SelectTrigger 
              className="h-12 rounded-xl"
              style={{ 
                borderColor: 'var(--admin-border)',
                color: 'var(--admin-text-dark)'
              }}
            >
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label 
            htmlFor="dueDate" 
            className="text-sm font-semibold mb-2 block"
            style={{ color: 'var(--admin-text-dark)' }}
          >
            Due Date & Time <span className="text-red-500">*</span>
          </Label>
          <Input
            id="dueDate"
            type="datetime-local"
            value={dueDate}
            onChange={(e) => {
              setDueDate(e.target.value);
              if (errors.dueDate) setErrors({ ...errors, dueDate: '' });
            }}
            required
            min={minDateTime}
            className={`h-12 rounded-xl ${errors.dueDate ? 'border-red-500' : ''}`}
            style={{ 
              borderColor: errors.dueDate ? '#ef4444' : 'var(--admin-border)',
              color: 'var(--admin-text-dark)'
            }}
          />
          {errors.dueDate && (
            <p className="mt-1 text-xs text-red-500">{errors.dueDate}</p>
          )}
        </div>
      </div>

      {/* Field selection panel */}
      <div>
        <Label 
          className="text-sm font-semibold mb-2 block"
          style={{ color: 'var(--admin-text-dark)' }}
        >
          Field (optional)
        </Label>
        {isLoadingFields && (
          <p className="text-sm text-[#6B7280]">Loading fields...</p>
        )}

        {!isLoadingFields && fields.length === 0 && (
          <p className="text-sm text-gray-500">No fields available. Create fields first in the Fields page.</p>
        )}

        {!isLoadingFields && fields.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {fields.map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFieldId(String(f.id))}
                className={`text-left p-4 rounded-lg border hover:shadow transition-all ${
                  fieldId === String(f.id) 
                    ? 'border-[#4CAF50] bg-[#F0F9F1]' 
                    : 'border-[#E5E7EB] bg-white'
                }`}
              >
                <div className="font-semibold text-[#1F2937]">{f.name}</div>
                <div className="text-[#6B7280] text-sm">Size: {f.size ?? '—'}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Workers assignment */}
      <div>
        <Label
          className="text-sm font-semibold mb-2 block"
          style={{ color: 'var(--admin-text-dark)' }}
        >
          Assign Workers
        </Label>

        <div className="space-y-3">
          <Button 
            type="button" 
            className="h-11 px-4 bg-[#4CAF50] hover:bg-[#388E3C] text-white" 
            onClick={() => setShowWorkersPanel(true)}
          >
            Select Workers
          </Button>

          {/* Display assigned workers */}
          {assignedWorkers.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {assignedWorkers.map((w) => (
                <span
                  key={w.id}
                  className="inline-flex items-center gap-2 bg-[#F0F9F1] text-[#065f46] px-3 py-1.5 rounded-full text-sm font-semibold"
                >
                  <div className="w-6 h-6 rounded-full bg-[#4CAF50] text-white flex items-center justify-center text-xs">
                    {w.initials}
                  </div>
                  {w.name}
                  <button
                    type="button"
                    onClick={() =>
                      setAssignedWorkerIds((prev) =>
                        prev.filter((id) => id !== w.id)
                      )
                    }
                    className="ml-1 text-[#065f46] hover:text-[#064e3b] font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {assignedWorkers.length === 0 && (
            <p className="text-sm text-gray-500">No workers assigned yet</p>
          )}
        </div>

        <Modal
          isOpen={showWorkersPanel}
          onClose={() => setShowWorkersPanel(false)}
          title="Select Workers"
          subtitle={`Choose workers to assign to this task (${availableWorkers.length} available)`}
          width="720px"
          footer={(
            <>
              <button
                type="button"
                onClick={() => setShowWorkersPanel(false)}
                className="h-11 px-6 bg-white border border-[#D1D5DB] text-[#4B5563] rounded-lg font-semibold hover:bg-[#F9FAFB] transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowWorkersPanel(false)}
                className="h-11 px-6 bg-[#4CAF50] text-white rounded-lg font-semibold hover:bg-[#388E3C] transition-all"
              >
                Done
              </button>
            </>
          )}
        >
          <div className="mb-4">
            <input
              type="search"
              value={workerSearch}
              onChange={e => setWorkerSearch(e.target.value)}
              placeholder="Search workers by name or initials"
              className="w-full h-11 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
            />
          </div>

          {isLoadingWorkers && (
            <p className="text-sm text-[#6B7280] py-4">Loading workers...</p>
          )}

          {!isLoadingWorkers && availableWorkers.length === 0 && (
            <p className="text-sm text-gray-500 py-8 text-center">
              No workers available. Add workers to your farm first.
            </p>
          )}

          {!isLoadingWorkers && availableWorkers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto">
              {availableWorkers
                .filter(
                  (w) =>
                    w.name.toLowerCase().includes(workerSearch.toLowerCase()) ||
                    w.initials.toLowerCase().includes(workerSearch.toLowerCase())
                )
                .map((worker) => {
                  const selected = assignedWorkerIds.includes(worker.id);
                  return (
                    <label
                      key={worker.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        selected
                          ? 'bg-[#F0F9F1] border border-[#4CAF50]'
                          : 'hover:bg-[#F9FAFB] border border-transparent'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => {
                          if (selected) {
                            setAssignedWorkerIds((prev) =>
                              prev.filter((id) => id !== worker.id)
                            );
                          } else {
                            setAssignedWorkerIds((prev) => [...prev, worker.id]);
                          }
                        }}
                        className="w-4 h-4 text-[#4CAF50] rounded"
                      />
                      <div className="w-9 h-9 rounded-full bg-[#4CAF50] text-white flex items-center justify-center font-semibold">
                        {worker.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-[#1F2937]">
                          {worker.name}
                        </div>
                        <div className="text-sm text-[#6B7280]">Worker</div>
                      </div>
                    </label>
                  );
                })}
              {availableWorkers.filter(
                (w) =>
                  w.name.toLowerCase().includes(workerSearch.toLowerCase()) ||
                  w.initials.toLowerCase().includes(workerSearch.toLowerCase())
              ).length === 0 && (
                <p className="col-span-2 text-center text-gray-500 py-4">
                  No workers found matching "{workerSearch}"
                </p>
              )}
            </div>
          )}
        </Modal>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          className="w-full h-12 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          style={{ backgroundColor: 'var(--admin-primary)' }}
          disabled={isSubmitting || !title || !dueDate}
        >
          {isSubmitting ? 'Saving...' : submitText}
        </Button>
      </div>
    </form>
  );
}