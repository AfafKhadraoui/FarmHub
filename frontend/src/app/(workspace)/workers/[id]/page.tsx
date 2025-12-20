// src/app/(workspace)/workers/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ContactWorkerModal } from '@/components/workspace/workers/ContactWorkerModal';
import { getWorkerById } from '@/services/worker.service';

export default function WorkerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [worker, setWorker] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const wid = Number(id);
        const res = await getWorkerById(wid);
        setWorker(res);
      } catch (err) {
        console.error('Failed to load worker', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  if (isLoading) return <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>Loading...</p>;
  if (!worker) return (
    <div className="space-y-4">
      <p className="text-sm" style={{ color: 'var(--admin-red)' }}>Worker not found.</p>
      <Button variant="outline" onClick={() => router.push('/workers')}>Back</Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-extrabold" style={{ color: 'var(--admin-text-dark)' }}>{worker.name}</h1>
          <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>{worker.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setContactOpen(true)}
            className="h-10 rounded-lg transition-all"
            style={{ backgroundColor: 'var(--admin-primary)', color: 'white' }}
          >
            Contact
          </Button>
          <Button variant="outline" onClick={() => router.push('/workers')} className="h-10">Back</Button>
        </div>
      </div>

      <div className="rounded-[16px] border bg-white p-6" style={{ borderColor: 'var(--admin-border)' }}>
        <h2 className="text-base font-semibold" style={{ color: 'var(--admin-text-dark)' }}>Statistics</h2>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-[#F0F9F1]">
            <p className="text-xs text-[13px]" style={{ color: 'var(--admin-text-muted)' }}>Assigned Tasks</p>
            <p className="text-2xl font-bold" style={{ color: 'var(--admin-primary)' }}>{worker.statistics?.assignedTasks ?? 0}</p>
          </div>
          <div className="p-4 rounded-lg bg-[#F0F9F1]">
            <p className="text-xs text-[13px]" style={{ color: 'var(--admin-text-muted)' }}>Completed</p>
            <p className="text-2xl font-bold" style={{ color: 'var(--admin-primary)' }}>{worker.statistics?.completedTasks ?? 0}</p>
          </div>
          <div className="p-4 rounded-lg bg-[#F0F9F1]">
            <p className="text-xs text-[13px]" style={{ color: 'var(--admin-text-muted)' }}>Performance</p>
            <p className="text-2xl font-bold" style={{ color: 'var(--admin-primary)' }}>{worker.statistics?.performancePercent ?? 0}%</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold" style={{ color: 'var(--admin-text-dark)' }}>Recent Tasks</h3>
        <div className="space-y-3 mt-3">
          {worker.tasks && worker.tasks.length > 0 ? (
            worker.tasks.map((t: any) => (
              <div key={t.id} className="p-4 rounded-lg border bg-white" style={{ borderColor: 'var(--admin-border)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold" style={{ color: 'var(--admin-text-dark)' }}>{t.title}</div>
                    <div className="text-sm text-[13px]" style={{ color: 'var(--admin-text-muted)' }}>{t.field?.name ?? ''}</div>
                  </div>
                  <div className="text-sm font-medium" style={{ color: 'var(--admin-text-muted)' }}>{t.status}</div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-[13px]" style={{ color: 'var(--admin-text-muted)' }}>No recent tasks</p>
          )}
        </div>
      </div>

      <ContactWorkerModal isOpen={contactOpen} onClose={() => setContactOpen(false)} worker={worker} />
    </div>
  );
}
