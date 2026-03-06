'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  MessageSquare,
  ClipboardCheck,
  AlertTriangle,
  Activity,
  TrendingUp,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

interface Metrics {
  totalConversations: number;
  pendingReviews: number;
  flaggedItems: number;
  totalMessages: number;
}

interface RecentSession {
  session_id: string;
  status: string;
  review_status: string;
  created_at: string;
  topic_summary: string | null;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics>({
    totalConversations: 0,
    pendingReviews: 0,
    flaggedItems: 0,
    totalMessages: 0,
  });
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [sessionsRes, transcriptsRes, pendingRes, flaggedRes] = await Promise.all([
          supabase.from('chat_sessions').select('*', { count: 'exact' }),
          supabase.from('chat_transcripts').select('*', { count: 'exact' }),
          supabase.from('chat_sessions').select('*', { count: 'exact' }).eq('review_status', 'pending'),
          supabase.from('chat_sessions').select('*', { count: 'exact' }).contains('risk_flags', ['flagged']),
        ]);

        setMetrics({
          totalConversations: sessionsRes.count || 0,
          totalMessages: transcriptsRes.count || 0,
          pendingReviews: pendingRes.count || 0,
          flaggedItems: flaggedRes.count || 0,
        });

        const { data: recent } = await supabase
          .from('chat_sessions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        setRecentSessions(recent || []);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();

    // Log admin view event
    supabase.from('admin_events').insert({
      event_type: 'view_dashboard',
      details: { page: 'overview' },
    });
  }, []);

  const metricCards = [
    {
      label: 'Total Conversations',
      value: metrics.totalConversations,
      icon: MessageSquare,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Total Messages',
      value: metrics.totalMessages,
      icon: Activity,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Pending Reviews',
      value: metrics.pendingReviews,
      icon: ClipboardCheck,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Flagged Items',
      value: metrics.flaggedItems,
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Monitor chat activity and review conversations.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metricCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <TrendingUp className="w-4 h-4 text-gray-300" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? '—' : card.value}
            </p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Conversations */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent Conversations</h2>
            <p className="text-sm text-gray-500">Latest chat sessions from the benefits assistant</p>
          </div>
          <Link
            href="/conversations"
            className="text-sm text-tobie-600 hover:text-tobie-700 font-medium"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : recentSessions.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500">No conversations yet.</p>
            <p className="text-sm text-gray-400 mt-1">
              Chat transcripts will appear here once employees start using the benefits assistant.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentSessions.map((session) => (
              <Link
                key={session.session_id}
                href={`/conversations/${session.session_id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Session: {session.session_id.slice(0, 8)}...
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {session.topic_summary || 'No topic summary'}
                  </p>
                </div>
                <StatusBadge status={session.review_status} />
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  {new Date(session.created_at).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    reviewed: 'bg-green-50 text-green-700 border-green-200',
    escalated: 'bg-red-50 text-red-700 border-red-200',
    resolved: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        styles[status] || 'bg-gray-50 text-gray-700 border-gray-200'
      }`}
    >
      {status}
    </span>
  );
}
