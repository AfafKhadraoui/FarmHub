// src/components/workspace/tasks/TaskForm.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Modal } from '@/components/workspace/modals/Modal';

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

  // Dummy data for fields and workers (for preview)
  const dummyFields = [
    { id: 1, name: 'Field A' },
    { id: 2, name: 'Field B' },
    { id: 3, name: 'Field C' },
  ];

  const dummyWorkers = [
    { id: 3, name: 'Ahmed Khalil', initials: 'AK' },
    { id: 4, name: 'Ali Benali', initials: 'AB' },
    { id: 5, name: 'Sara Mohammed', initials: 'SM' },
  ];

  const [showWorkersPanel, setShowWorkersPanel] = useState(false);
  const [workerSearch, setWorkerSearch] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          onChange={e => setTitle(e.target.value)}
          placeholder="Water irrigation system - Field A"
          required
          className="h-12 rounded-xl"
          style={{ 
            borderColor: 'var(--admin-border)',
            color: 'var(--admin-text-dark)'
          }}
        />
      </div>

      {/* Description Field */}
      <div>
        <Label 
          htmlFor="description" 
          className="text-sm font-semibold mb-2 block"
          style={{ color: 'var(--admin-text-dark)' }}
        >
          Description
        </Label>
        <textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Describe what needs to be done..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border resize-none focus:outline-none focus:ring-2 transition-all"
          style={{ 
            borderColor: 'var(--admin-border)',
            color: 'var(--admin-text-dark)',
            backgroundColor: 'white',
            '--tw-ring-color': 'var(--admin-primary)'
          } as React.CSSProperties}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--admin-primary)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--admin-border)';
          }}
        />
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
          <Select
            value={priority}
            onValueChange={v => setPriority(v as any)}
          >
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
            onChange={e => setDueDate(e.target.value)}
            required
            className="h-12 rounded-xl"
            style={{ 
              borderColor: 'var(--admin-border)',
              color: 'var(--admin-text-dark)'
            }}
          />
        </div>
      </div>

      {/* Field selection panel */}
      <div>
        <Label 
          className="text-sm font-semibold mb-2 block"
          style={{ color: 'var(--admin-text-dark)' }}
        >
          Field (choose)
        </Label>
        <div className="grid grid-cols-3 gap-4">
          {dummyFields.map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFieldId(String(f.id))}
              className={`text-left p-4 rounded-lg border hover:shadow transition-all ${fieldId === String(f.id) ? 'border-[#4CAF50] bg-[#F0F9F1]' : 'border-[#E5E7EB] bg-white'}`}
            >
              <div className="font-semibold text-[#1F2937]">{f.name}</div>
              <div className="text-[#6B7280] text-sm">Size: 10ha</div>
            </button>
          ))}
        </div>
      </div>

      {/* Workers assignment opens a panel due to large worker lists */}
      <div>
        <Label
          className="text-sm font-semibold mb-2 block"
          style={{ color: 'var(--admin-text-dark)' }}
        >
          Assign Workers
        </Label>

        <div className="flex items-center gap-3">
          <Button type="button" className="h-11 px-4" onClick={() => setShowWorkersPanel(true)}>
            Select Workers
          </Button>
          <div className="flex items-center gap-2 flex-wrap">
            {assignedWorkerIds.length === 0 ? (
              <span className="text-sm text-[#6B7280]">No workers selected</span>
            ) : (
              dummyWorkers
                .filter(w => assignedWorkerIds.includes(w.id))
                .map(w => (
                  <span
                    key={w.id}
                    className="inline-flex items-center gap-2 bg-[#F0F9F1] text-[#065f46] px-3 py-1 rounded-full text-sm font-semibold"
                  >
                    {w.initials} {w.name}
                    <button
                      type="button"
                      onClick={() => setAssignedWorkerIds(prev => prev.filter(id => id !== w.id))}
                      className="ml-2 text-[#065f46] opacity-80"
                    >
                      ×
                    </button>
                  </span>
                ))
            )}
          </div>
        </div>

        <Modal
          isOpen={showWorkersPanel}
          onClose={() => setShowWorkersPanel(false)}
          title="Select Workers"
          subtitle="Choose one or more workers to assign to this task"
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
                Save
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
              className="w-full h-11 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto">
            {dummyWorkers
              .filter(w => w.name.toLowerCase().includes(workerSearch.toLowerCase()) || w.initials.toLowerCase().includes(workerSearch.toLowerCase()))
              .map(worker => {
                const selected = assignedWorkerIds.includes(worker.id);
                return (
                  <label
                    key={worker.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selected ? 'bg-[#F0F9F1] border border-[#4CAF50]' : 'hover:bg-[#F9FAFB] border border-transparent'}`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => {
                        if (selected) setAssignedWorkerIds(prev => prev.filter(id => id !== worker.id));
                        else setAssignedWorkerIds(prev => [...prev, worker.id]);
                      }}
                      className="w-4 h-4 text-[#4CAF50]"
                    />
                    <div className="w-9 h-9 rounded-full bg-[#4CAF50] text-white flex items-center justify-center font-semibold">{worker.initials}</div>
                    <div>
                      <div className="font-semibold text-[#1F2937]">{worker.name}</div>
                      <div className="text-sm text-[#6B7280]">Worker</div>
                    </div>
                  </label>
                );
              })}
          </div>
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
