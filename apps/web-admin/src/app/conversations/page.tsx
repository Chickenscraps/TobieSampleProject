'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
  Search,
  Filter,
  Clock,
  MessageSquare,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

interface Session {
  id: string;
  session_id: string;
  status: string;
  review_status: string;
  topic_summary: string | null;
  risk_flags: string[];
  created_at: string;
  updated_at: string;
  messageCount?: number;
}

const statusFilters = ['all', 'pending', 'reviewed', 'escalated', 'resolved'];

export default function ConversationsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    loadSessions();
  }, [statusFilter, page]);

  async function loadSessions() {
    setLoading(true);
    try {
      let query = supabase
        .from('chat_sessions')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1);

      if (statusFilter !== 'all') {
        query = query.eq('review_status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Get message counts for each session
      const sessionsWithCounts = await Promise.all(
        (data || []).map(async (session) => {
          const { count } = await supabase
            .from('chat_transcripts')
            .select('*', { count: 'exact', head: true })
            .eq('session_id', session.session_id);
          return { ...session, messageCount: count || 0 };
        })
      );

      setSessions(sessionsWithCounts);

      // Log admin event
      supabase.from('admin_events').insert({
        actor_id: 'admin',
        event_type: 'view_conversations',
        details: { filter: statusFilter, page },
      });
    } catch (err) {
      console.error('Failed to load sessions:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredSessions = sessions.filter((s) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      s.session_id.toLowerCase().includes(term) ||
      (s.topic_summary || '').toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Conversation Archive</h1>
        <p className="text-gray-500 mt-1">
          Review and manage all chat sessions from the benefits assistant.
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6">
        <div className="p-4 flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tobie-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <div className="flex gap-1">
              {statusFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => { setStatusFilter(filter); setPage(0); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                    statusFilter === filter
                      ? 'bg-tobie-100 text-tobie-700'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Refresh */}
          <button
            onClick={loadSessions}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading conversations...</div>
        ) : filteredSessions.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500">No conversations found.</p>
            <p className="text-sm text-gray-400 mt-1">
              {search ? 'Try adjusting your search or filters.' : 'Conversations will appear here when employees use the chat assistant.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Session</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Messages</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Review</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSessions.map((session) => (
                    <tr key={session.session_id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                      <td className="py-3 px-4"><StatusBadge status={session.status} /></td>
                      <td className="py-3 px-4">
                        <Link href={`/conversations/detail?id=${session.session_id}`} className="block">
                          <p className="text-sm font-medium text-gray-900">{session.session_id.slice(0, 12)}...</p>
                          <p className="text-xs text-gray-500 mt-0.5">{session.topic_summary || 'No summary'}</p>
                        </Link>
                      </td>
                      <td className="py-3 px-4"><span className="text-sm text-gray-600">{session.messageCount || 0}</span></td>
                      <td className="py-3 px-4"><ReviewBadge status={session.review_status} /></td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {new Date(session.created_at).toLocaleString()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Link href={`/conversations/detail?id=${session.session_id}`}>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden divide-y divide-gray-100">
              {filteredSessions.map((session) => (
                <Link
                  key={session.session_id}
                  href={`/conversations/detail?id=${session.session_id}`}
                  className="block p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <StatusBadge status={session.status} />
                    <ReviewBadge status={session.review_status} />
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {session.session_id.slice(0, 16)}...
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    {session.topic_summary || 'No summary'}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{session.messageCount || 0} messages</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(session.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-xs sm:text-sm text-gray-500">
                Page {page + 1} · {filteredSessions.length} sessions
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-3 py-1.5 text-sm border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={filteredSessions.length < pageSize}
                  className="px-3 py-1.5 text-sm border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: 'bg-green-50 text-green-700',
    completed: 'bg-gray-50 text-gray-700',
    flagged: 'bg-red-50 text-red-700',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-50 text-gray-600'}`}>
      {status}
    </span>
  );
}

function ReviewBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    reviewed: 'bg-green-50 text-green-700 border-green-200',
    escalated: 'bg-red-50 text-red-700 border-red-200',
    resolved: 'bg-blue-50 text-blue-700 border-blue-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
      {status}
    </span>
  );
}
