// src/components/auth/RoleSelector.tsx

'use client';

import { cn } from '@/lib/utils';

interface RoleSelectorProps {
  selectedRole: 'admin' | 'worker';
  onRoleChange: (role: 'admin' | 'worker') => void;
}

export function RoleSelector({ selectedRole, onRoleChange }: RoleSelectorProps) {
  return (
    <div className="mb-6"> {/* Smaller bottom margin */}
      <div className="inline-flex w-full rounded-2xl bg-[#f0f0f0] p-1">
        <button
          type="button"
          onClick={() => onRoleChange('admin')}
          className={cn(
            'flex-1 py-3 px-4 text-base font-semibold rounded-xl transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5cb85c]',
            selectedRole === 'admin'
              ? 'bg-[#5cb85c] text-white shadow-sm border-2 border-[#333333]'
              : 'bg-transparent text-[#666666] hover:text-[#333333] border-2 border-transparent'
          )}
        >
          Farm Owner
        </button>
        <button
          type="button"
          onClick={() => onRoleChange('worker')}
          className={cn(
            'flex-1 py-3 px-4 text-base font-semibold rounded-xl transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5cb85c]',
            selectedRole === 'worker'
              ? 'bg-[#5cb85c] text-white shadow-sm border-2 border-[#333333]'
              : 'bg-transparent text-[#666666] hover:text-[#333333] border-2 border-transparent'
          )}
        >
          Worker
        </button>
      </div>
    </div>
  );
}
