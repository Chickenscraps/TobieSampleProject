'use client';

import { AuthGate } from './AuthGate';
import { Sidebar } from './Sidebar';

export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <Sidebar />
      <main className="lg:ml-64 pt-18 lg:pt-0 p-4 sm:p-6 lg:p-8">{children}</main>
    </AuthGate>
  );
}
