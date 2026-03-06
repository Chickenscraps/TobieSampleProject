'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  ClipboardCheck,
  Download,
  Shield,
  Settings,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/', icon: LayoutDashboard },
  { label: 'Conversations', href: '/conversations', icon: MessageSquare },
  { label: 'Review Queue', href: '/review-queue', icon: ClipboardCheck },
  { label: 'Exports', href: '/exports', icon: Download },
  { label: 'Audit Log', href: '/audit-log', icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-tobie-700">Tobie Admin</h1>
        <p className="text-xs text-gray-500 mt-1">Benefits AI Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-tobie-50 text-tobie-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-tobie-100 rounded-full flex items-center justify-center">
            <Settings className="w-4 h-4 text-tobie-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">HR Admin</p>
            <p className="text-xs text-gray-500">admin@tobie.org</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
