// src/app/workspace/workers/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Users, Activity, CheckCircle2, ArrowUp, Check } from 'lucide-react';
import  api  from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WorkerCard } from '@/components/workspace/workers/WorkerCard';

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
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, farmRes, listRes] = await Promise.all([
          api.get('/workers/statistics').catch(() => ({ data: dummyStats })),
          api.get('/settings/farm').catch(() => ({
            data: { joinCode: 'FARM-ABC123' },
          })),
          api
            .get('/workers', { params: { page: 1, limit: 20 } })
            .catch(() => ({ data: { items: dummyWorkers } })),
        ]);

        setStats(statsRes.data);
        setFarmCode(farmRes.data.joinCode);

        const items = listRes.data.items.map((w: any) => ({
          id: w.id,
          name: w.name,
          email: w.email,
          phone: w.phone,
          role: w.role,
          status: w.status as 'active' | 'inactive',
          assignedTasks: w.assignedTasks,
          completedTasks: w.completedTasks,
          performancePercent: w.performancePercent,
          avatarInitials: w.avatarInitials,
        }));
        setWorkers(items);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filteredWorkers = workers.filter(w =>
    [w.name, w.email].join(' ').toLowerCase().includes(search.toLowerCase()),
  );

  const copyCode = () => {
    if (!farmCode) return;
    navigator.clipboard.writeText(farmCode);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
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
            {farmCode ?? 'FARM-ABC123'}
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
              e.currentTarget.style.backgroundColor = 'rgba(75, 175, 71, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
            onClick={copyCode}
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
          subtitle={'+2 this month'}
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
            onViewProfile={() => {}}
            onAssignTasks={() => {}}
            onContact={() => {}}
          />
        ))}
      </div>
    </div>
  );
}

interface WorkerStatCardProps {
  title: string;
  value: number;
  type: 'workers' | 'active' | 'tasks';
  subtitle?: string;
}

function WorkerStatCard({ title, value, type, subtitle }: WorkerStatCardProps) {
  const iconConfig = {
    workers: { Icon: Users, bg: 'bg-purple-50', color: 'text-purple-600' },
    active: { Icon: Activity, bg: 'bg-blue-50', color: 'text-blue-600' },
    tasks: { Icon: CheckCircle2, bg: 'bg-green-50', color: 'text-green-600' },
  };

  const config = iconConfig[type] || iconConfig.workers;
  const { Icon } = config;

  const changeIcon = subtitle && subtitle.trim().startsWith('+') ? <ArrowUp size={12} /> : <Check size={12} />;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all h-[170px] flex flex-col">
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
    </div>
  );
}
