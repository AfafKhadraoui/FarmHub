// Clean single-copy Tasks page
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/hooks/useAuth';
import { TaskList } from '@/components/workspace/tasks/TaskList';
import { Button } from '@/components/ui/button';
import { Clock, Activity, CheckCircle2, ChevronDown, ArrowUp, Check } from 'lucide-react';
import { TaskFormModal } from '@/components/workspace/tasks/TaskFormModal';

export default function TasksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [activeSummaryCard, setActiveSummaryCard] = useState<string | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);

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

  // Normalize current status for comparison - handle both undefined/null and various formats
  const rawStatus = (isAdmin ? adminFilters?.status : workerFilters?.status);
  const currentStatus = rawStatus ? rawStatus.toUpperCase() : 'ALL';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // If the page was opened with query params (e.g. from Workers stat), apply those filters
  useEffect(() => {
    const status = searchParams?.get('status');
    const recentCount = searchParams?.get('recentCount');
    if (status) {
      const count = recentCount ? Number(recentCount) : undefined;
      if (isAdmin && setAdminFilters) {
        setAdminFilters((prev: any) => ({ ...prev, status: status === 'ALL' ? undefined : status.toLowerCase(), page: 1, limit: count, sortBy: count ? 'updatedAt' : prev.sortBy, sortOrder: count ? 'desc' : prev.sortOrder }));
      }
      if (!isAdmin && setWorkerFilters) {
        setWorkerFilters((prev: any) => ({ ...prev, status: status === 'ALL' ? undefined : status.toLowerCase(), page: 1, limit: count, sortBy: count ? 'updatedAt' : prev.sortBy, sortOrder: count ? 'desc' : prev.sortOrder }));
      }
    }
  }, [searchParams]);

  const setStatus = (value: string, fromSummaryCard = false) => {
    // Normalize status for backend: ALL -> undefined, others -> lowercase
    // Backend expects: pending, in_progress, completed
    const normalizeStatus = (val: string) => {
      if (val === 'ALL') return undefined;
      const lower = val.toLowerCase();
      if (lower === 'inprogress' || lower === 'in_progress') return 'in_progress';
      return lower;
    };
    
    const statusKey = normalizeStatus(value);
    
    if (isAdmin && setAdminFilters) {
      // When clicking summary cards, filter by time (today's items only)
      if (fromSummaryCard) {
        if (value === 'COMPLETED') {
          const todayCount = stats?.completed?.today ?? stats?.completed?.count ?? 10;
          setAdminFilters((prev: any) => ({ 
            ...prev, 
            status: statusKey, 
            page: 1, 
            limit: todayCount, 
            sortBy: 'updatedAt', 
            sortOrder: 'desc' 
          }));
        } else if (value === 'INPROGRESS') {
          const dueToday = stats?.inprogress?.dueToday ?? stats?.inprogress?.count ?? 10;
          setAdminFilters((prev: any) => ({ 
            ...prev, 
            status: statusKey, 
            page: 1, 
            limit: dueToday, 
            sortBy: 'updatedAt', 
            sortOrder: 'desc' 
          }));
        } else if (value === 'PENDING') {
          const inc = stats?.pending?.increaseToday ?? stats?.pending?.count ?? 10;
          setAdminFilters((prev: any) => ({ 
            ...prev, 
            status: statusKey, 
            page: 1, 
            limit: inc, 
            sortBy: 'createdAt', 
            sortOrder: 'desc' 
          }));
        } else {
          setAdminFilters((prev: any) => ({ ...prev, status: statusKey, page: 1, limit: undefined }));
        }
      } else {
        // Regular tab click - filter by STATUS ONLY (no time restriction, no custom sorting)
        // Clear any time-based limits and sorting from summary card clicks
        setAdminFilters((prev: any) => ({ 
          ...prev, 
          status: statusKey, 
          page: 1, 
          limit: undefined,
          sortBy: undefined,
          sortOrder: undefined
        }));
      }
    }

    if (!isAdmin && setWorkerFilters) {
      if (fromSummaryCard) {
        // Summary card click - filter by STATUS + TIME (today's items only)
        if (value === 'COMPLETED') {
          const todayCount = stats?.completed?.today ?? stats?.completed?.count ?? 10;
          setWorkerFilters((prev: any) => ({ 
            ...prev, 
            status: statusKey, 
            page: 1, 
            limit: todayCount, 
            sortBy: 'updatedAt', 
            sortOrder: 'desc' 
          }));
        } else if (value === 'INPROGRESS') {
          const dueToday = stats?.inprogress?.dueToday ?? stats?.inprogress?.count ?? 10;
          setWorkerFilters((prev: any) => ({ 
            ...prev, 
            status: statusKey, 
            page: 1, 
            limit: dueToday, 
            sortBy: 'updatedAt', 
            sortOrder: 'desc' 
          }));
        } else if (value === 'PENDING') {
          const inc = stats?.pending?.increaseToday ?? stats?.pending?.count ?? 10;
          setWorkerFilters((prev: any) => ({ 
            ...prev, 
            status: statusKey, 
            page: 1, 
            limit: inc, 
            sortBy: 'createdAt', 
            sortOrder: 'desc' 
          }));
        } else {
          setWorkerFilters((prev: any) => ({ ...prev, status: statusKey, page: 1, limit: undefined }));
        }
      } else {
        // Regular tab click - filter by STATUS ONLY (no time restriction, no custom sorting)
        setWorkerFilters((prev: any) => ({ 
          ...prev, 
          status: statusKey, 
          page: 1, 
          limit: undefined,
          sortBy: undefined,
          sortOrder: undefined
        }));
      }
    }
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
                <button type="button" className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors" style={{ color: currentStatus === 'ALL' ? 'var(--admin-primary)' : 'var(--admin-text-dark)', backgroundColor: currentStatus === 'ALL' ? 'var(--admin-bg-gray)' : 'transparent' }} onClick={() => { setStatus('ALL', false); setIsDropdownOpen(false); }}>All Tasks</button>
                <button type="button" className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors border-t" style={{ borderTopColor: 'var(--admin-border)', color: currentStatus === 'PENDING' ? 'var(--admin-primary)' : 'var(--admin-text-dark)', backgroundColor: currentStatus === 'PENDING' ? 'var(--admin-bg-gray)' : 'transparent' }} onClick={() => { setStatus('PENDING', false); setIsDropdownOpen(false); }}>Pending</button>
                <button type="button" className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors border-t" style={{ borderTopColor: 'var(--admin-border)', color: currentStatus === 'INPROGRESS' || currentStatus === 'IN_PROGRESS' ? 'var(--admin-primary)' : 'var(--admin-text-dark)', backgroundColor: currentStatus === 'INPROGRESS' || currentStatus === 'IN_PROGRESS' ? 'var(--admin-bg-gray)' : 'transparent' }} onClick={() => { setStatus('INPROGRESS', false); setIsDropdownOpen(false); }}>In Progress</button>
                <button type="button" className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors border-t" style={{ borderTopColor: 'var(--admin-border)', color: currentStatus === 'COMPLETED' ? 'var(--admin-primary)' : 'var(--admin-text-dark)', backgroundColor: currentStatus === 'COMPLETED' ? 'var(--admin-bg-gray)' : 'transparent' }} onClick={() => { setStatus('COMPLETED', false); setIsDropdownOpen(false); }}>Completed</button>
              </div>
            )}
          </div>

          {isAdmin && (
            <Button
              type="button"
              className="h-11 rounded-xl text-white px-5 font-semibold"
              style={{ backgroundColor: 'var(--admin-primary)' }}
              onClick={() => {
                setEditingTask(null);
                setShowTaskModal(true);
              }}
            >
              + New Task
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          iconType="clock"
          title="Pending"
          value={pending}
          subtitle={`+${stats?.pending?.increaseToday ?? 0} today`}
          active={activeSummaryCard === 'PENDING'}
          onClick={() => {
            setActiveSummaryCard('PENDING');
            setStatus('PENDING', true);
          }}
        />
        <SummaryCard
          iconType="pulse"
          title="In Progress"
          value={inProgress}
          subtitle={`${stats?.inprogress?.dueToday ?? 0} due today`}
          active={activeSummaryCard === 'INPROGRESS'}
          onClick={() => {
            setActiveSummaryCard('INPROGRESS');
            setStatus('INPROGRESS', true);
          }}
        />
        <SummaryCard
          iconType="check"
          title="Completed"
          value={completed}
          subtitle={`+${stats?.completed?.today ?? 0} today`}
          active={activeSummaryCard === 'COMPLETED'}
          onClick={() => {
            setActiveSummaryCard('COMPLETED');
            setStatus('COMPLETED', true);
          }}
        />
      </div>

      <div className="border-b flex gap-6 text-sm font-medium" style={{ borderColor: 'var(--admin-border)' }}>
        {['ALL', 'PENDING', 'INPROGRESS', 'COMPLETED'].map(tab => {
          const label =
            tab === 'ALL'
              ? 'All'
              : tab === 'PENDING'
              ? 'Pending'
              : tab === 'INPROGRESS'
              ? 'In Progress'
              : 'Completed';
          // Normalize status comparison - handle both uppercase and lowercase
          const normalizedCurrent = (currentStatus || '').toUpperCase();
          const normalizedTab = tab.toUpperCase();
          const isActive = 
            normalizedCurrent === normalizedTab || 
            (tab === 'ALL' && (normalizedCurrent === 'ALL' || normalizedCurrent === '' || !currentStatus)) ||
            (tab === 'PENDING' && (normalizedCurrent === 'PENDING')) ||
            (tab === 'INPROGRESS' && (normalizedCurrent === 'INPROGRESS' || normalizedCurrent === 'IN_PROGRESS')) ||
            (tab === 'COMPLETED' && (normalizedCurrent === 'COMPLETED'));
          return (
            <button
              key={tab}
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // Prevent any event bubbling
                setActiveSummaryCard(null); // Clear summary card selection when clicking tabs
                setStatus(tab, false);
              }}
              onMouseDown={(e) => e.stopPropagation()} // Prevent hover effects on cards
              className="relative pb-3 focus:outline-none transition-colors"
              style={{
                color: isActive ? '#16A34A' : 'var(--admin-text-muted)',
              }}
            >
              {label}
              {isActive && (
                <span
                  className="absolute left-0 right-0 -bottom-[1px] h-[3px] rounded-full"
                  style={{ backgroundColor: '#16A34A' }}
                />
              )}
            </button>
          );
        })}
      </div>

      {error && <p className="text-sm" style={{ color: 'var(--admin-red)' }}>{error}</p>}
      {isLoading && <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>Loading tasks...</p>}

      {!isLoading && <TaskList mode={isAdmin ? 'admin' : 'worker'} tasks={tasks} />}

      {/* Task Form Modal */}
      {isAdmin && (
        <TaskFormModal
          isOpen={showTaskModal}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
          onSuccess={() => {
            setShowTaskModal(false);
            setEditingTask(null);
            // Reload tasks
            window.location.reload();
          }}
          initialData={editingTask}
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
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation(); // Prevent event bubbling
        onClick?.();
      }}
      className={`bg-white border rounded-2xl p-6 shadow-sm transition-all h-[170px] flex flex-col text-left w-full ${
        active 
          ? 'border-[#16A34A] border-2 shadow-md' 
          : 'border-[#E5E7EB] hover:shadow-lg hover:border-[#D1D5DB]'
      }`}
      style={{
        pointerEvents: 'auto', // Ensure card is clickable independently
      }}
    >
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
    </button>
  );
}

