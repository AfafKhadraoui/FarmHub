// src/components/workspace/tasks/TaskList.tsx
'use client';

import { TaskCard } from './TaskCard';

interface TaskListProps {
  mode: 'admin' | 'worker';
  tasks: any[];
  onUpdateStatus?: () => void;
}

export function TaskList({ mode, tasks, onUpdateStatus }: TaskListProps) {
  if (!tasks || tasks.length === 0) {
    return (
      <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>
        No tasks to show.
      </p>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          mode={mode}
          task={task}
          onUpdateStatus={() => {
            // bubble up to parent so lists can refresh without full reload
            onUpdateStatus?.();
          }}
        />
      ))}
    </div>
  );
}
