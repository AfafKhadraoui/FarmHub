// src/components/workspace/workers/ContactWorkerModal.tsx
'use client';

import { Modal } from '@/components/workspace/modals/Modal';
import { Mail, Phone, User } from 'lucide-react';

interface ContactWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker: {
    name: string;
    email: string;
    phone?: string;
    avatarInitials?: string;
    assignedTasks: number;
    completedTasks: number;
    status?: 'active' | 'inactive';
  };
}

export function ContactWorkerModal({ isOpen, onClose, worker }: ContactWorkerModalProps) {
  const handleCall = () => {
    if (worker.phone) {
      window.location.href = `tel:${worker.phone}`;
    }
  };

  const handleEmail = () => {
    window.location.href = `mailto:${worker.email}`;
  };

  const footer = (
    <>
      <button
        type="button"
        onClick={onClose}
        className="h-11 px-6 bg-white border border-[#D1D5DB] text-[#4B5563] rounded-lg font-semibold hover:bg-[#F9FAFB] transition-all"
      >
        Close
      </button>
      {worker.phone && (
        <button
          type="button"
          onClick={handleCall}
          className="h-11 px-6 bg-[#4CAF50] text-white rounded-lg font-semibold hover:bg-[#388E3C] transition-all flex items-center gap-2"
        >
          <Phone size={18} />
          Call
        </button>
      )}
      <button
        type="button"
        onClick={handleEmail}
        className="h-11 px-6 bg-[#4CAF50] text-white rounded-lg font-semibold hover:bg-[#388E3C] transition-all flex items-center gap-2"
      >
        <Mail size={18} />
        Email
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Contact Worker"
      subtitle={worker.name}
      footer={footer}
      width="500px"
    >
      <div className="space-y-6">
        {/* Worker Avatar & Info */}
        <div className="flex items-center gap-4 pb-4 border-b border-[#E5E7EB]">
          <div
            className="h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-bold relative"
            style={{ backgroundColor: 'var(--admin-primary)' }}
          >
            {worker.avatarInitials ??
              worker.name
                ?.split(' ')
                .map((p) => p[0])
                .join('')
                .toUpperCase()}
            <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full bg-white flex items-center justify-center">
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor:
                    worker.status === 'active' ? 'var(--admin-primary)' : 'var(--admin-text-muted)',
                }}
              />
            </span>
          </div>
          <div>
            <p className="text-lg font-semibold" style={{ color: 'var(--admin-text-dark)' }}>
              {worker.name}
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: 'var(--admin-text-muted)' }}
            >
              {worker.status === 'active' ? 'Active Worker' : 'Inactive Worker'}
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--admin-text-muted)' }}>
              Email Address
            </label>
            <div className="flex items-center gap-3 mt-2 p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
              <Mail size={20} style={{ color: 'var(--admin-primary)' }} />
              <a
                href={`mailto:${worker.email}`}
                className="flex-1 text-sm font-medium hover:underline"
                style={{ color: 'var(--admin-text-dark)' }}
              >
                {worker.email}
              </a>
            </div>
          </div>

          {worker.phone && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--admin-text-muted)' }}>
                Phone Number
              </label>
              <div className="flex items-center gap-3 mt-2 p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                <Phone size={20} style={{ color: 'var(--admin-primary)' }} />
                <a
                  href={`tel:${worker.phone}`}
                  className="flex-1 text-sm font-medium hover:underline"
                  style={{ color: 'var(--admin-text-dark)' }}
                >
                  {worker.phone}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Worker stats removed per request */}
      </div>
    </Modal>
  );
}

