/*export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {children}
    </div>
  );
}*/



// src/app/(auth)/layout.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FarmHub - Authentication',
  description: 'Login or register to manage your farm',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

