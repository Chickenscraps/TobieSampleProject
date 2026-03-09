'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Shield,
  Eye,
  Download,
  ClipboardCheck,
  Search as SearchIcon,
  RefreshCw,
  Clock,
  User,
  Filter,
} from 'lucide-react';

interface AdminEvent {
  id: string;
  actor_id: string;
  event_type: string;
  target_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

const eventTypeIcons: Record<string, typeof Eye> = {
  view_dashboard: Eye,
  view_conversations: Eye,
  view_transcript: Eye,
  review_conversation: ClipboardCheck,
  export: Download,
  search: SearchIcon,
};

const eventTypeLabels: Record<string, string> = {
  view_dashboard: 'Viewed Dashboard',
  view_conversations: 'Viewed Conversations',
  view_transcript: 'Viewed Transcript',
  review_conversation: 'Reviewed Conversation',
  export: 'Exported Data',
  search: 'Searched Transcripts',
};

const eventTypeFilters = ['all', 'view_transcript', 'review_conversation', 'export'];

export default function AuditLogPage() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(0);
  const pageSize = 30;

  useEffect(() => {
    loadEvents();
  }, [typeFilter, page]);

  async function loadEvents() {
    setLoading(true);
    try {
      let query = supabase
        .from('admin_events')
        .select('*')
        .order('created_at', { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1);

      if (typeFilter !== 'all') {
        query = query.eq('event_type', typeFilter);
      }

      const { data } = await query;
      setEvents(data || []);
    } catch (err) {
      console.error('Failed to load audit events:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Audit Log</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Complete record of all admin actions for compliance and accountability.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 mb-6 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-sm text-gray-500 dark:text-gray-400">Filter:</span>
        </div>
        {eventTypeFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => { setTypeFilter(filter); setPage(0); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              typeFilter === filter
                ? 'bg-tobie-100 dark:bg-tobie-800/30 text-tobie-700 dark:text-tobie-300'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            {filter === 'all' ? 'All Events' : eventTypeLabels[filter] || filter}
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={loadEvents}
          className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Events Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 dark:text-gray-500">Loading audit log...</div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center">
            <Shield className="w-12 h-12 text-gray-200 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No audit events recorded yet.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Timestamp</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Actor</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Action</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Target</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {events.map((event) => {
                    const Icon = eventTypeIcons[event.event_type] || Shield;
                    return (
                      <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                            {new Date(event.created_at).toLocaleString()}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{event.actor_id}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-tobie-500" />
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {eventTypeLabels[event.event_type] || event.event_type}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {event.target_id ? `${event.target_id.slice(0, 12)}...` : '—'}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-500 dark:text-gray-400 font-mono">
                          {Object.keys(event.details || {}).length > 0
                            ? JSON.stringify(event.details).slice(0, 60)
                            : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-slate-700">
              {events.map((event) => {
                const Icon = eventTypeIcons[event.event_type] || Shield;
                return (
                  <div key={event.id} className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-tobie-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {eventTypeLabels[event.event_type] || event.event_type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {event.actor_id}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(event.created_at).toLocaleString()}
                      </div>
                    </div>
                    {event.target_id && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">Target: {event.target_id.slice(0, 16)}...</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Page {page + 1}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-3 py-1.5 text-sm border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={events.length < pageSize}
                  className="px-3 py-1.5 text-sm border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
