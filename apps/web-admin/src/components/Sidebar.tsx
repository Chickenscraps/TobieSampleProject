'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  MessageSquare,
  ClipboardCheck,
  Download,
  Shield,
  Settings,
  ArrowLeft,
  Menu,
  X,
  LogOut,
} from 'lucide-react';


const navItems = [
  { label: 'Overview', href: '/', icon: LayoutDashboard },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Conversations', href: '/conversations', icon: MessageSquare },
  { label: 'Review Queue', href: '/review-queue', icon: ClipboardCheck },
  { label: 'Exports', href: '/exports', icon: Download },
  { label: 'Audit Log', href: '/audit-log', icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="ml-3 text-lg font-bold text-tobie-700">Tobie Admin</h1>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-tobie-700">Tobie Admin</h1>
            <p className="text-xs text-gray-500 mt-1">Benefits AI Dashboard</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
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
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
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

        {/* Back to Employee Site */}
        <div className="px-4 pb-2">
          <a
            href="https://tobiebenefits.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-tobie-600 hover:bg-tobie-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Benefits Site
          </a>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-tobie-100 flex items-center justify-center flex-shrink-0">
                <Settings className="w-4 h-4 text-tobie-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">HR Admin</p>
                <p className="text-xs text-gray-500">admin@tobie.org</p>
              </div>
            </div>
            <button
              onClick={() => {
                sessionStorage.removeItem('tobie_admin_authenticated');
                window.location.reload();
              }}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
