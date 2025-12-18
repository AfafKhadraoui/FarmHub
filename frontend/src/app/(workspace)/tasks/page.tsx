// Clean single-copy Tasks page
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/hooks/useAuth';
import { TaskList } from '@/components/workspace/tasks/TaskList';
import { Button } from '@/components/ui/button';
import { Clock, Activity, CheckCircle2, ChevronDown, ArrowUp, Check } from 'lucide-react';

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
  } = useTasks() as any;

  if (!user) return null;

  const isAdmin = user.role === 'admin';
  const tasks = isAdmin ? adminTasks : workerTasks;

  const pending = stats?.pending?.count ?? 0;
  const inProgress = stats?.inprogress?.count ?? 0;
  const completed = stats?.completed?.count ?? 0;

  const currentStatus = (isAdmin ? adminFilters?.status : workerFilters?.status) ?? 'ALL';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const setStatus = (value: string) => {
    if (isAdmin && setAdminFilters) setAdminFilters((prev: any) => ({ ...prev, status: value === 'ALL' ? undefined : value.toLowerCase(), page: 1 }));
    if (!isAdmin && setWorkerFilters) setWorkerFilters((prev: any) => ({ ...prev, status: value === 'ALL' ? undefined : value.toLowerCase(), page: 1 }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '30px' }}>Tasks</h1>
          <p className="mt-2 text-[#6B7280]">Manage and assign farm tasks</p>
        </div>

        <div className="flex items-center gap-3">
          <div ref={dropdownRef} className="relative hidden md:block">
            <button type="button" className="flex items-center gap-2 h-11 rounded-xl border bg-white px-4 text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors cursor-pointer" style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text-dark)' }} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              All Tasks
              <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--admin-text-muted)' }} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl border shadow-lg z-50 overflow-hidden" style={{ borderColor: 'var(--admin-border)' }}>
                <button type="button" className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors" style={{ color: currentStatus === 'ALL' ? 'var(--admin-primary)' : 'var(--admin-text-dark)', backgroundColor: currentStatus === 'ALL' ? 'var(--admin-bg-gray)' : 'transparent' }} onClick={() => { setStatus('ALL'); setIsDropdownOpen(false); }}>All Tasks</button>
                <button type="button" className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors border-t" style={{ borderTopColor: 'var(--admin-border)', color: currentStatus === 'PENDING' || currentStatus === 'pending' ? 'var(--admin-primary)' : 'var(--admin-text-dark)', backgroundColor: currentStatus === 'PENDING' || currentStatus === 'pending' ? 'var(--admin-bg-gray)' : 'transparent' }} onClick={() => { setStatus('PENDING'); setIsDropdownOpen(false); }}>Pending</button>
                <button type="button" className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors border-t" style={{ borderTopColor: 'var(--admin-border)', color: currentStatus === 'INPROGRESS' || currentStatus === 'inprogress' ? 'var(--admin-primary)' : 'var(--admin-text-dark)', backgroundColor: currentStatus === 'INPROGRESS' || currentStatus === 'inprogress' ? 'var(--admin-bg-gray)' : 'transparent' }} onClick={() => { setStatus('INPROGRESS'); setIsDropdownOpen(false); }}>In Progress</button>
                <button type="button" className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors border-t" style={{ borderTopColor: 'var(--admin-border)', color: currentStatus === 'COMPLETED' || currentStatus === 'completed' ? 'var(--admin-primary)' : 'var(--admin-text-dark)', backgroundColor: currentStatus === 'COMPLETED' || currentStatus === 'completed' ? 'var(--admin-bg-gray)' : 'transparent' }} onClick={() => { setStatus('COMPLETED'); setIsDropdownOpen(false); }}>Completed</button>
              </div>
            )}
          </div>

          {isAdmin && <Button type="button" className="h-11 rounded-xl text-white px-5 font-semibold" style={{ backgroundColor: 'var(--admin-primary)' }} onClick={() => router.push('/tasks/new')}>+ New Task</Button>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard iconType="clock" title="Pending" value={pending} subtitle={`+${stats?.pending?.increaseToday ?? 0} today`} active={currentStatus === 'PENDING' || currentStatus === 'pending'} onClick={() => setStatus('PENDING')} />
        <SummaryCard iconType="pulse" title="In Progress" value={inProgress} subtitle={`${stats?.inprogress?.dueToday ?? 0} due today`} active={currentStatus === 'INPROGRESS' || currentStatus === 'inprogress'} onClick={() => setStatus('INPROGRESS')} />
        <SummaryCard iconType="check" title="Completed" value={completed} subtitle="Today" active={currentStatus === 'COMPLETED' || currentStatus === 'completed' || currentStatus === 'Done'} onClick={() => setStatus('COMPLETED')} />
      </div>

      <div className="border-b flex gap-6 text-sm font-medium" style={{ borderColor: 'var(--admin-border)' }}>
        {['ALL', 'PENDING', 'INPROGRESS', 'COMPLETED'].map(tab => {
          const label = tab === 'ALL' ? 'All' : tab === 'PENDING' ? 'Pending' : tab === 'INPROGRESS' ? 'In Progress' : 'Done';
          const isActive = currentStatus === tab || (tab === 'ALL' && (currentStatus === 'ALL' || currentStatus === 'all'));
          return (
            <button key={tab} type="button" onClick={() => setStatus(tab)} className="relative pb-3 focus:outline-none" style={{ color: isActive ? 'var(--admin-primary)' : 'var(--admin-text-muted)' }}>
              {label}
              {isActive && <span className="absolute left-0 right-0 -bottom-[1px] h-[3px] rounded-full" style={{ backgroundColor: 'var(--admin-primary)' }} />}
            </button>
          );
        })}
      </div>

      {error && <p className="text-sm" style={{ color: 'var(--admin-red)' }}>{error}</p>}
      {isLoading && <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>Loading tasks...</p>}

      {!isLoading && <TaskList mode={isAdmin ? 'admin' : 'worker'} tasks={tasks} />}
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

function SummaryCard({ iconType, title, value, subtitle, active, onClick }: SummaryCardProps) {
  const iconConfig: Record<string, any> = {
    clock: { Icon: Clock, bg: 'bg-yellow-50', color: 'text-yellow-600' },
    pulse: { Icon: Activity, bg: 'bg-blue-50', color: 'text-blue-600' },
    check: { Icon: CheckCircle2, bg: 'bg-green-50', color: 'text-green-600' },
  };

  const config = iconConfig[iconType] || iconConfig.clock;
  const { Icon } = config;

  const changeIcon = typeof subtitle === 'string' && subtitle.trim().startsWith('+') ? <ArrowUp size={12} /> : <Check size={12} />;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all h-[170px] flex flex-col">
      <div className="w-11 h-11 bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#4CAF50]">
        <Icon size={24} strokeWidth={2} className={config.color} />
      </div>

      <div className="font-bold text-[#1F2937] mt-3" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '42px', lineHeight: '1' }}>
        {value}
      </div>

      <div className="font-medium text-[#6B7280] mt-2 text-[15px]">{title}</div>

      <div className="flex items-center gap-1 text-[#4CAF50] font-medium text-[13px] mt-auto">
        {changeIcon}
        <span>{subtitle}</span>
      </div>
    </div>
  );
}

