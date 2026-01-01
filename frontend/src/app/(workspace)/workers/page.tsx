// src/app/workspace/workers/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Users, Activity, CheckCircle2, ArrowUp, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import  api  from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WorkerCard } from '@/components/workspace/workers/WorkerCard';
import { ContactWorkerModal } from '@/components/workspace/workers/ContactWorkerModal';
import { TaskFormModal } from '@/components/workspace/tasks/TaskFormModal';
import AssignTaskModal from '@/components/workspace/workers/AssignTaskModal';

// Inline export menu component (keeps changes local to this file)
function ExportMenu({ workers }: { workers: any[] }) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // Close on outside click or Escape key
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const el = containerRef.current;
      if (el && !el.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const exportCSV = () => {
    if (!workers || workers.length === 0) { alert('No workers to export'); setOpen(false); return; }
    const headers = ['id','name','email','phone','role','status','assignedTasks','completedTasks','performancePercent'];
    const csv = [headers.join(',')].concat(
      workers.map(w => headers.map(h => {
        const v = (w as any)[h] ?? '';
        const s = String(v).replace(/"/g, '""');
        return `"${s.replace(/\n/g,' ')}"`;
      }).join(','))
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `workers_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.csv`;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    setOpen(false);
  };

  const exportJSON = () => {
    if (!workers || workers.length === 0) { alert('No workers to export'); setOpen(false); return; }
    const dataStr = JSON.stringify(workers, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `workers_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.json`;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    setOpen(false);
  };

  // (PDF export removed — keep CSV and JSON exports only)

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="h-10 rounded-[12px] bg-white px-3 text-sm font-semibold transition-colors"
        style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text-dark)', borderWidth: '1px', borderStyle: 'solid' }}
      >
        Export
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-50" style={{ borderColor: 'var(--admin-border)' }}>
          <button className="w-full text-left px-4 py-2 hover:bg-slate-50" onClick={exportCSV}>Export CSV</button>
          <button className="w-full text-left px-4 py-2 hover:bg-slate-50" onClick={exportJSON}>Export JSON</button>
        </div>
      )}
    </div>
  );
}

interface WorkerItem {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: 'active' | 'inactive';
  assignedTasks: number;
  completedTasks: number;
  performancePercent: number;
  avatarInitials: string;
}

interface WorkerStats {
  totalWorkers: number;
  activeToday: number;
  tasksDoneThisWeek: number;
}

export default function WorkersPage() {
  const [workers, setWorkers] = useState<WorkerItem[]>([]);
  const [stats, setStats] = useState<WorkerStats | null>(null);
  const [farmCode, setFarmCode] = useState<string | null>(null);
  const [farmError, setFarmError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [contactModalWorker, setContactModalWorker] = useState<WorkerItem | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [assigningToWorker, setAssigningToWorker] = useState<WorkerItem | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // dummy fallback so UI always shows
  const dummyWorkers: WorkerItem[] = [
    {
      id: 1,
      name: 'Ahmed Khalil',
      email: 'ahmed@email.com',
      phone: '+213 555 123 456',
      role: 'worker',
      status: 'active',
      assignedTasks: 5,
      completedTasks: 42,
      performancePercent: 95,
      avatarInitials: 'AK',
    },
    {
      id: 2,
      name: 'Sara Mansouri',
      email: 'sara@email.com',
      phone: '+213 555 789 012',
      role: 'worker',
      status: 'active',
      assignedTasks: 3,
      completedTasks: 38,
      performancePercent: 92,
      avatarInitials: 'SM',
    },
  ];

  const dummyStats: WorkerStats = {
    totalWorkers: 8,
    activeToday: 6,
    tasksDoneThisWeek: 25,
  };

  const router = useRouter();

  useEffect(() => {
    const load = async () => await loadData();

    load();
  }, []);

  // Extract load logic so other handlers can refresh without full page reload
  async function loadData() {
    try {
      setIsLoading(true);
      // Fetch statistics and workers in parallel; fetch farm settings separately
      const [statsRes, listRes] = await Promise.all([
        api.get('/workers/statistics').catch(() => ({ data: dummyStats })),
        api.get('/workers', { params: { page: 1, limit: 20 } }).catch(() => ({ data: { items: dummyWorkers } })),
      ]);

      // --- Statistics shape: controller wraps service result as { success, data }
      const statsPayload = (statsRes.data as any)?.data ?? statsRes.data;
      setStats({
        totalWorkers: statsPayload.totalWorkers ?? dummyStats.totalWorkers,
        activeToday: statsPayload.activeWorkersToday ?? dummyStats.activeToday,
        tasksDoneThisWeek: statsPayload.totalCompletedTasks ?? dummyStats.tasksDoneThisWeek,
      });

      // --- Workers list: controller returns { success, data: { items, pagination } }
      const listWrapper = (listRes.data as any)?.data ?? listRes.data;
      const rawItems = listWrapper?.items ?? dummyWorkers;
      const items = rawItems.map((w: any) => ({
        id: w.id,
        name: w.name,
        email: w.email,
        phone: w.phone ?? '',
        role: w.role ?? 'worker',
        status: (w.status as 'active' | 'inactive') ?? 'active',
        assignedTasks: Number(w.assignedTasks ?? 0),
        completedTasks: Number(w.completedTasks ?? 0),
        performancePercent: Number(w.performancePercent ?? 0),
        avatarInitials: w.avatarInitials ?? (w.name ? w.name.split(' ').map((s: string) => s[0]).join('').slice(0,2) : ''),
      }));

      setWorkers(items);

      // Fetch farm settings separately so we can handle auth issues explicitly
      try {
        const farmRes = await api.get('/api/settings/farm');
        const farmPayload = (farmRes.data as any)?.data ?? farmRes.data ?? {};
        const realJoinCode = farmPayload.joinCode ?? farmPayload.join_code ?? null;
        if (realJoinCode) {
          setFarmCode(realJoinCode);
          setFarmError(null);
        } else {
          console.warn('Farm settings returned without a join code:', farmPayload);
          setFarmCode(null);
          setFarmError('No join code available for this farm.');
        }
      } catch (farmErr: any) {
        // Provide a friendly error message for common cases (no farm, unauthenticated, etc.)
        console.error('Failed to fetch farm settings (join code):', farmErr);
        const status = farmErr?.response?.status;
        const serverMsg = farmErr?.response?.data?.error ?? farmErr?.message ?? 'Failed to load farm settings';
        if (status === 404) {
          setFarmError(serverMsg || 'No farm associated with this account');
        } else if (status === 401 || status === 403) {
          setFarmError('Authentication required to view farm join code');
        } else {
          setFarmError('Unable to load farm join code');
        }
        setFarmCode(null);
      }
    } catch (err) {
      // keep dummy fallbacks if any error
      console.error('Failed to load workers/stats', err);
      setStats(dummyStats);
      setWorkers(dummyWorkers);
      setFarmCode(null);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredWorkers = workers.filter(w =>
    [w.name, w.email].join(' ').toLowerCase().includes(search.toLowerCase()),
  );

  const copyCode = () => {
    if (!farmCode) return;
    navigator.clipboard.writeText(farmCode);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-extrabold" style={{ color: 'var(--admin-text-dark)' }}>
            Workers
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--admin-text-muted)' }}>
            Manage your farm team
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-11 w-64 rounded-xl border bg-white px-4 text-sm"
            style={{ 
              borderColor: 'var(--admin-border)',
              color: 'var(--admin-text-dark)'
            }}
          />
          <div className="relative">
            {/* Single export button with dropdown */}
            <ExportMenu
              workers={filteredWorkers.length > 0 ? filteredWorkers : workers}
            />
          </div>
        </div>
      </div>

      {/* Farm code box */}
      <div 
        className="rounded-[24px] border px-6 py-5 flex flex-col gap-2"
        style={{ 
          borderColor: 'var(--admin-primary)',
          backgroundColor: 'rgba(75, 175, 71, 0.05)'
        }}
      >
        <p className="text-sm font-semibold" style={{ color: 'var(--admin-primary)' }}>
          Your Farm Code
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-2xl font-extrabold tracking-wide" style={{ color: 'var(--admin-primary)' }}>
            {farmCode ?? (farmError ? farmError : '—')}
          </span>
          <button
            type="button"
            className="h-10 rounded-[12px] bg-white px-4 text-sm font-semibold transition-colors"
            style={{ 
              borderColor: 'var(--admin-primary)',
              color: 'var(--admin-primary)',
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = farmCode ? 'rgba(75, 175, 71, 0.1)' : 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
            onClick={copyCode}
            disabled={!farmCode}
            title={!farmCode ? 'Join code not available' : 'Copy join code'}
          >
            Copy Code
          </button>
        </div>
        <p className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>
          Share this code with workers so they can join your farm
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <WorkerStatCard
          type="workers"
          title="Total Workers"
          value={stats?.totalWorkers ?? dummyStats.totalWorkers}
          onClick={() => { /* no-op for total workers */ }}
        />
        <WorkerStatCard
          type="active"
          title="Active Today"
          value={stats?.activeToday ?? dummyStats.activeToday}
        />
        <WorkerStatCard
          type="tasks"
          title="Tasks Done Today"
          value={stats?.tasksDoneThisWeek ?? dummyStats.tasksDoneThisWeek}
          onClick={() => {
            // Navigate to tasks page and request only the most recently completed tasks
            const recentCount =
              stats?.tasksDoneThisWeek ?? dummyStats.tasksDoneThisWeek ?? 5;
            router.push(`/tasks?status=COMPLETED&recentCount=${recentCount}`);
          }}
        />
      </div>

      {/* Worker list */}
      {isLoading && (
        <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>Loading workers...</p>
      )}

      {!isLoading && filteredWorkers.length === 0 && (
        <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>No workers found.</p>
      )}

      <div className="space-y-4">
        {filteredWorkers.map(w => (
          <WorkerCard
            key={w.id}
            worker={w}
            onViewProfile={() => router.push(`/workers/${w.id}`)}
            onAssignTasks={() => {
              // Open assign tasks modal for this worker
              setAssigningToWorker(w);
              setShowAssignModal(true);
            }}
            onContact={() => setContactModalWorker(w)}
          />
        ))}
      </div>

      {/* Contact Modal */}
      {contactModalWorker && (
        <ContactWorkerModal
          isOpen={!!contactModalWorker}
          onClose={() => setContactModalWorker(null)}
          worker={contactModalWorker}
        />
      )}

      {/* Task Creation Modal for Assigning */}
      <TaskFormModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setAssigningToWorker(null);
        }}
        onSuccess={() => {
          setShowTaskModal(false);
          setAssigningToWorker(null);
          // Refresh workers list without full reload
          loadData();
        }}
        initialData={
          assigningToWorker
            ? {
                assignedWorkerIds: [assigningToWorker.id],
              }
            : undefined
        }
      />
      {/* Assign existing tasks modal */}
      {showAssignModal && assigningToWorker && (
        <AssignTaskModal
          isOpen={showAssignModal}
          onClose={() => { setShowAssignModal(false); setAssigningToWorker(null); }}
          worker={assigningToWorker}
          onAssigned={() => { setShowAssignModal(false); setAssigningToWorker(null); loadData(); }}
        />
      )}
    </div>
  );
}

interface WorkerStatCardProps {
  title: string;
  value: number;
  type: 'workers' | 'active' | 'tasks';
  subtitle?: string;
  onClick?: () => void;
}

function WorkerStatCard({ title, value, type, subtitle, onClick }: WorkerStatCardProps) {
  const iconConfig = {
    workers: { Icon: Users, bg: 'bg-purple-50', color: 'text-purple-600' },
    active: { Icon: Activity, bg: 'bg-blue-50', color: 'text-blue-600' },
    tasks: { Icon: CheckCircle2, bg: 'bg-green-50', color: 'text-green-600' },
  };

  const config = iconConfig[type] || iconConfig.workers;
  const { Icon } = config;

  const changeIcon = subtitle && subtitle.trim().startsWith('+') ? <ArrowUp size={12} /> : <Check size={12} />;

  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all h-[170px] flex flex-col text-left cursor-pointer"
    >
      <div className="w-11 h-11 bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#4CAF50]">
        <Icon size={24} strokeWidth={2} className={config.color} />
      </div>

      <div className="font-bold text-[#1F2937] mt-3" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '42px', lineHeight: '1' }}>
        {String(value)}
      </div>

      <div className="font-medium text-[#6B7280] mt-2 text-[15px]">{title}</div>

      {subtitle && (
        <div className="flex items-center gap-1 text-[#4CAF50] font-medium text-[13px] mt-auto">
          {changeIcon}
          <span>{subtitle}</span>
        </div>
      )}
    </button>
  );
}
