// src/components/workspace/tasks/TaskForm.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

interface TaskFormProps {
  onSubmit: (data: any) => void;
  initialData?: {
    title?: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
    fieldId?: string;
  };
  submitText?: string;
}

export function TaskForm({ onSubmit, initialData, submitText = 'Create Task' }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(initialData?.priority || 'medium');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
  const [fieldId, setFieldId] = useState(initialData?.fieldId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit({
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      fieldId: fieldId ? Number(fieldId) : null,
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

      {/* Field ID Field */}
      <div>
        <Label 
          htmlFor="fieldId" 
          className="text-sm font-semibold mb-2 block"
          style={{ color: 'var(--admin-text-dark)' }}
        >
          Field ID (optional)
        </Label>
        <Input
          id="fieldId"
          type="number"
          value={fieldId}
          onChange={e => setFieldId(e.target.value)}
          placeholder="Enter field ID"
          className="h-12 rounded-xl"
          style={{ 
            borderColor: 'var(--admin-border)',
            color: 'var(--admin-text-dark)'
          }}
        />
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
