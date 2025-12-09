// src/components/workspace/tasks/TaskFilters.tsx
'use client';

import { AdminTasksParams, WorkerTasksParams } from '@/services/task.service';

interface CommonProps {
  onRefresh: () => void;
}

interface AdminFiltersProps extends CommonProps {
  mode: 'admin';
  filters: AdminTasksParams;
  onChange: (f: AdminTasksParams) => void;
}

interface WorkerFiltersProps extends CommonProps {
  mode: 'worker';
  filters: WorkerTasksParams;
  onChange: (f: WorkerTasksParams) => void;
}

type Props = AdminFiltersProps | WorkerFiltersProps;

export function TaskFilters(props: Props) {
  if (props.mode === 'admin') {
    const { filters, onChange, onRefresh } = props;
    const current = filters.status ?? 'all';

    return (
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2">
          {['all', 'pending', 'inprogress', 'completed'].map((s) => (
            <button
              key={s}
              onClick={() =>
                onChange({
                  ...filters,
                  status: s === 'all' ? undefined : (s as any),
                  page: 1,
                })
              }
              className={`rounded-full px-4 py-1 text-sm font-medium ${
                current === s
                  ? 'bg-[#DCFCE7] text-[#15803D]'
                  : 'bg-white text-[#6B7280] border border-[#E5E7EB]'
              }`}
            >
              {s === 'all'
                ? 'All'
                : s === 'inprogress'
                ? 'In Progress'
                : s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={onRefresh}
          className="text-xs text-[#6B7280] underline"
        >
          Refresh
        </button>
      </div>
    );
  }

  // worker
  const { filters, onChange, onRefresh } = props;
  const current = filters.status ?? 'ALL';
  const statuses = ['ALL', 'TODO', 'INPROGRESS', 'COMPLETED'] as const;

  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#E5E7EB]">
      <div className="flex gap-4">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() =>
              onChange({
                ...filters,
                status: s,
                page: 1,
              })
            }
            className={`pb-2 text-sm font-medium ${
              current === s
                ? 'border-b-2 border-[#22C55E] text-[#111827]'
                : 'text-[#6B7280]'
            }`}
          >
            {s === 'ALL'
              ? 'All'
              : s === 'INPROGRESS'
              ? 'In Progress'
              : s[0] + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>
      <button
        onClick={onRefresh}
        className="text-xs text-[#6B7280] underline"
      >
        Refresh
      </button>
    </div>
  );
}
