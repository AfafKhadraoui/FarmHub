// src/app/(workspace)/tasks/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/hooks/useAuth';
import { TaskList } from '@/components/workspace/tasks/TaskList';
import { Button } from '@/components/ui/button';
import { Clock, Activity, CheckCircle2, ChevronDown } from 'lucide-react';

export default function TasksPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    stats,
    adminTasks,
    workerTasks,
    isLoading,
    error,
    adminFilters,
    setAdminFilters,
    workerFilters,
    setWorkerFilters,
    reload,
  } = useTasks() as {
    stats: any;
    adminTasks: any[];
    workerTasks: any[];
    isLoading: boolean;
    error: string | null;
    adminFilters: { status?: string; page?: number };
    setAdminFilters: (fn: (prev: any) => any) => void;
    workerFilters: { status?: string; page?: number };
    setWorkerFilters: (fn: (prev: any) => any) => void;
    reload: () => void;
  };

  if (!user) return null;

  const isAdmin = user.role === 'admin';
  const tasks = isAdmin ? adminTasks : workerTasks;

  const pending = stats?.pending?.count ?? 0;
  const inProgress = stats?.inprogress?.count ?? 0;
  const completed = stats?.completed?.count ?? 0;

  const currentStatus =
    (isAdmin ? adminFilters.status : workerFilters.status) ?? 'ALL';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const setStatus = (value: string) => {
    if (isAdmin) {
      setAdminFilters(prev => ({
        ...prev,
        status: value === 'ALL' ? undefined : (value.toLowerCase() as any),
        page: 1,
      }));
    } else {
      setWorkerFilters(prev => ({
        ...prev,
        status: value as any,
        page: 1,
      }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-extrabold" style={{ color: 'var(--admin-text-dark)' }}>
            Tasks
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--admin-text-muted)' }}>
            Manage and assign farm tasks
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* All Tasks Dropdown */}
          <div ref={dropdownRef} className="relative hidden md:block">
            <button
              type="button"
              className="flex items-center gap-2 h-11 rounded-xl border bg-white px-4 text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
              style={{ 
                borderColor: 'var(--admin-border)',
                color: 'var(--admin-text-dark)'
              }}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              All Tasks
              <ChevronDown 
                size={16} 
                className={`transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
                style={{ color: 'var(--admin-text-muted)' }}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl border shadow-lg z-50 overflow-hidden"
                style={{ borderColor: 'var(--admin-border)' }}
              >
                <button
                  type="button"
                  className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
                  style={{ 
                    color: currentStatus === 'ALL' ? 'var(--admin-primary)' : 'var(--admin-text-dark)',
                    backgroundColor: currentStatus === 'ALL' ? 'var(--admin-bg-gray)' : 'transparent'
                  }}
                  onClick={() => {
                    setStatus('ALL');
                    setIsDropdownOpen(false);
                  }}
                >
                  All Tasks
                </button>
                <button
                  type="button"
                  className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors border-t"
                  style={{ 
                    borderTopColor: 'var(--admin-border)',
                    color: currentStatus === 'PENDING' || currentStatus === 'pending' ? 'var(--admin-primary)' : 'var(--admin-text-dark)',
                    backgroundColor: currentStatus === 'PENDING' || currentStatus === 'pending' ? 'var(--admin-bg-gray)' : 'transparent'
                  }}
                  onClick={() => {
                    setStatus(isAdmin ? 'PENDING' : 'PENDING');
                    setIsDropdownOpen(false);
                  }}
                >
                  Pending
                </button>
                <button
                  type="button"
                  className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors border-t"
                  style={{ 
                    borderTopColor: 'var(--admin-border)',
                    color: currentStatus === 'INPROGRESS' || currentStatus === 'inprogress' ? 'var(--admin-primary)' : 'var(--admin-text-dark)',
                    backgroundColor: currentStatus === 'INPROGRESS' || currentStatus === 'inprogress' ? 'var(--admin-bg-gray)' : 'transparent'
                  }}
                  onClick={() => {
                    setStatus(isAdmin ? 'INPROGRESS' : 'INPROGRESS');
                    setIsDropdownOpen(false);
                  }}
                >
                  In Progress
                </button>
                <button
                  type="button"
                  className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors border-t"
                  style={{ 
                    borderTopColor: 'var(--admin-border)',
                    color: currentStatus === 'COMPLETED' || currentStatus === 'completed' ? 'var(--admin-primary)' : 'var(--admin-text-dark)',
                    backgroundColor: currentStatus === 'COMPLETED' || currentStatus === 'completed' ? 'var(--admin-bg-gray)' : 'transparent'
                  }}
                  onClick={() => {
                    setStatus(isAdmin ? 'COMPLETED' : 'COMPLETED');
                    setIsDropdownOpen(false);
                  }}
                >
                  Completed
                </button>
              </div>
            )}
          </div>

          {isAdmin && (
            <Button
              type="button"
              className="h-11 rounded-xl text-white px-5 font-semibold"
              style={{ backgroundColor: 'var(--admin-primary)' }}
              onClick={() => router.push('/tasks/new')}
            >
              + New Task
            </Button>
          )}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          iconType="clock"
          title="Pending"
          value={pending}
          subtitle={`+${stats?.pending?.increaseToday ?? 0} today`}
          active={currentStatus === 'PENDING' || currentStatus === 'pending'}
          onClick={() => setStatus(isAdmin ? 'PENDING' : 'PENDING')}
        />
        <SummaryCard
          iconType="pulse"
          title="In Progress"
          value={inProgress}
          subtitle={`${stats?.inprogress?.dueToday ?? 0} due today`}
          active={currentStatus === 'INPROGRESS' || currentStatus === 'inprogress'}
          onClick={() => setStatus(isAdmin ? 'INPROGRESS' : 'INPROGRESS')}
        />
        <SummaryCard
          iconType="check"
          title="Completed"
          value={completed}
          subtitle="This week"
          active={
            currentStatus === 'COMPLETED' ||
            currentStatus === 'completed' ||
            currentStatus === 'Done'
          }
          onClick={() => setStatus(isAdmin ? 'COMPLETED' : 'COMPLETED')}
        />
      </div>

      {/* Tabs: All / Pending / In Progress / Done */}
      <div className="border-b flex gap-6 text-sm font-medium" style={{ borderColor: 'var(--admin-border)' }}>
        {['ALL', 'PENDING', 'INPROGRESS', 'COMPLETED'].map(tab => {
          const label =
            tab === 'ALL'
              ? 'All'
              : tab === 'PENDING'
              ? 'Pending'
              : tab === 'INPROGRESS'
              ? 'In Progress'
              : 'Done';

          const isActive =
            currentStatus === tab ||
            (tab === 'ALL' &&
              (currentStatus === 'ALL' || currentStatus === 'all'));

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setStatus(tab)}
              className="relative pb-3 focus:outline-none"
              style={{ 
                color: isActive ? 'var(--admin-primary)' : 'var(--admin-text-muted)'
              }}
            >
              {label}
              {isActive && (
                <span 
                  className="absolute left-0 right-0 -bottom-[1px] h-[3px] rounded-full"
                  style={{ backgroundColor: 'var(--admin-primary)' }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Error / loading */}
      {error && (
        <p className="text-sm" style={{ color: 'var(--admin-red)' }}>{error}</p>
      )}
      {isLoading && (
        <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>Loading tasks...</p>
      )}

      {/* List */}
      {!isLoading && (
        <TaskList
          mode={isAdmin ? 'admin' : 'worker'}
          tasks={tasks}
        />
      )}
    </div>
  );
}

interface SummaryCardProps {
  iconType: 'clock' | 'pulse' | 'check';
  title: string;
  value: number;
  subtitle: string;
  active?: boolean;
  onClick?: () => void;
}

function SummaryCard({
  iconType,
  title,
  value,
  subtitle,
  active,
  onClick,
}: SummaryCardProps) {
  const iconConfig = {
    clock: { Icon: Clock, bg: 'bg-yellow-50', color: 'text-yellow-600' },
    pulse: { Icon: Activity, bg: 'bg-blue-50', color: 'text-blue-600' },
    check: { Icon: CheckCircle2, bg: 'bg-green-50', color: 'text-green-600' },
  };

  const config = iconConfig[iconType] || iconConfig.clock;
  const { Icon } = config;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-[16px] border bg-white px-6 py-5 shadow-sm hover:shadow-lg transition-all"
      style={{
        borderColor: active ? 'var(--admin-primary)' : 'var(--admin-border)',
        opacity: active ? 1 : 1,
      }}
    >
      <div className="flex items-start gap-4">
        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${config.bg}`}>
          <Icon size={24} className={config.color} />
        </div>
        <div className="flex flex-col">
          <span className="text-[28px] font-semibold leading-tight" style={{ color: 'var(--admin-text-dark)' }}>
            {value}
          </span>
          <span className="mt-1 text-sm font-medium" style={{ color: 'var(--admin-text-dark)' }}>
            {title}
          </span>
          <span className="mt-1 text-xs" style={{ color: 'var(--admin-primary)' }}>
            {subtitle}
          </span>
        </div>
      </div>
    </button>
  );
}
