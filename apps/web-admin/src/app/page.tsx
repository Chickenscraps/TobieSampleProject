'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  MessageSquare,
  ClipboardCheck,
  AlertTriangle,
  Activity,
  Clock,
  CalendarDays,
} from 'lucide-react';
import Link from 'next/link';
import { TrendCard } from '@/components/charts/TrendCard';
import { CHART_COLORS } from '@/components/charts/chart-theme';

interface RecentSession {
  session_id: string;
  status: string;
  review_status: string;
  created_at: string;
  topic_summary: string | null;
  visitor_id?: string;
  device_type?: string;
  browser?: string;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  // Metric values
  const [totalConversations, setTotalConversations] = useState(0);
  const [prevConversations, setPrevConversations] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [prevMessages, setPrevMessages] = useState(0);
  const [pendingReviews, setPendingReviews] = useState(0);
  const [prevPendingReviews, setPrevPendingReviews] = useState(0);
  const [flaggedItems, setFlaggedItems] = useState(0);
  const [prevFlaggedItems, setPrevFlaggedItems] = useState(0);

  // Sparklines
  const [convSparkline, setConvSparkline] = useState<{ value: number }[]>([]);
  const [msgSparkline, setMsgSparkline] = useState<{ value: number }[]>([]);
  const [reviewSparkline, setReviewSparkline] = useState<{ value: number }[]>([]);
  const [flagSparkline, setFlagSparkline] = useState<{ value: number }[]>([]);

  // Today's summary
  const [todayConversations, setTodayConversations] = useState(0);
  const [todayMessages, setTodayMessages] = useState(0);
  const [todayVisitors, setTodayVisitors] = useState(0);

  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000).toISOString();
        const fourteenDaysAgo = new Date(now.getTime() - 14 * 86400000).toISOString();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

        // Current week & previous week data
        const [sessionsRes, transcriptsRes, prevSessRes, prevTransRes] = await Promise.all([
          supabase.from('chat_sessions').select('*').gte('created_at', sevenDaysAgo),
          supabase.from('chat_transcripts').select('*').gte('created_at', sevenDaysAgo),
          supabase.from('chat_sessions').select('*').gte('created_at', fourteenDaysAgo).lt('created_at', sevenDaysAgo),
          supabase.from('chat_transcripts').select('*').gte('created_at', fourteenDaysAgo).lt('created_at', sevenDaysAgo),
        ]);

        const sessions = sessionsRes.data || [];
        const transcripts = transcriptsRes.data || [];
        const prevSessions = prevSessRes.data || [];
        const prevTranscripts = prevTransRes.data || [];

        // All-time counts
        const [totalSessRes, totalTransRes, pendingRes, flaggedRes] = await Promise.all([
          supabase.from('chat_sessions').select('*', { count: 'exact', head: true }),
          supabase.from('chat_transcripts').select('*', { count: 'exact', head: true }),
          supabase.from('chat_sessions').select('*', { count: 'exact', head: true }).eq('review_status', 'pending'),
          supabase.from('chat_sessions').select('*', { count: 'exact', head: true }).eq('status', 'flagged'),
        ]);

        const prevPending = prevSessions.filter(s => s.review_status === 'pending').length;
        const prevFlagged = prevSessions.filter(s => s.status === 'flagged').length;

        setTotalConversations(totalSessRes.count || 0);
        setPrevConversations(prevSessions.length);
        setTotalMessages(totalTransRes.count || 0);
        setPrevMessages(prevTranscripts.length);
        setPendingReviews(pendingRes.count || 0);
        setPrevPendingReviews(prevPending);
        setFlaggedItems(flaggedRes.count || 0);
        setPrevFlaggedItems(prevFlagged);

        // Sparklines (7 days)
        const convByDay: Record<string, number> = {};
        const msgByDay: Record<string, number> = {};

        for (let i = 6; i >= 0; i--) {
          const d = new Date(now.getTime() - i * 86400000).toISOString().slice(0, 10);
          convByDay[d] = 0;
          msgByDay[d] = 0;
        }

        sessions.forEach(s => {
          const d = s.created_at?.slice(0, 10);
          if (d && convByDay[d] !== undefined) convByDay[d]++;
        });
        transcripts.forEach(t => {
          const d = t.created_at?.slice(0, 10);
          if (d && msgByDay[d] !== undefined) msgByDay[d]++;
        });

        const sortedDays = Object.keys(convByDay).sort();
        setConvSparkline(sortedDays.map(d => ({ value: convByDay[d] })));
        setMsgSparkline(sortedDays.map(d => ({ value: msgByDay[d] })));
        setReviewSparkline(sortedDays.map(() => ({ value: pendingRes.count || 0 })));
        setFlagSparkline(sortedDays.map(() => ({ value: flaggedRes.count || 0 })));

        // Today's summary
        const todaySessions = sessions.filter(s => s.created_at >= todayStart);
        const todayTranscripts = transcripts.filter(t => t.created_at >= todayStart);
        setTodayConversations(todaySessions.length);
        setTodayMessages(todayTranscripts.length);
        setTodayVisitors(new Set(todaySessions.map(s => s.visitor_id).filter(Boolean)).size);

        // Recent sessions
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

    supabase.from('admin_events').insert({
      actor_id: 'admin',
      event_type: 'view_dashboard',
      details: { page: 'overview' },
    });
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Monitor chat activity and review conversations.</p>
      </div>

      {/* Metric Cards with Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <TrendCard
          label="Total Conversations"
          value={totalConversations}
          previousValue={prevConversations}
          sparklineData={convSparkline}
          icon={<MessageSquare className="w-5 h-5" style={{ color: CHART_COLORS.primary }} />}
          color={CHART_COLORS.primary}
        />
        <TrendCard
          label="Total Messages"
          value={totalMessages}
          previousValue={prevMessages}
          sparklineData={msgSparkline}
          icon={<Activity className="w-5 h-5" style={{ color: CHART_COLORS.success }} />}
          color={CHART_COLORS.success}
        />
        <TrendCard
          label="Pending Reviews"
          value={pendingReviews}
          previousValue={prevPendingReviews}
          sparklineData={reviewSparkline}
          icon={<ClipboardCheck className="w-5 h-5" style={{ color: CHART_COLORS.warning }} />}
          color={CHART_COLORS.warning}
        />
        <TrendCard
          label="Flagged Items"
          value={flaggedItems}
          previousValue={prevFlaggedItems}
          sparklineData={flagSparkline}
          icon={<AlertTriangle className="w-5 h-5" style={{ color: CHART_COLORS.danger }} />}
          color={CHART_COLORS.danger}
        />
      </div>

      {/* Today's Activity Summary */}
      <div className="bg-white shadow-card border border-gray-100 border-l-[3px] p-5 mb-8 chart-fade-up" style={{ borderLeftColor: '#FFB31A' }}>
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="w-4 h-4 text-tobie-500" />
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Today&apos;s Activity</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{loading ? '—' : todayConversations}</p>
            <p className="text-xs text-gray-500 mt-1">Conversations</p>
          </div>
          <div className="text-center border-l border-r border-gray-100">
            <p className="text-2xl font-bold text-gray-900">{loading ? '—' : todayMessages}</p>
            <p className="text-xs text-gray-500 mt-1">Messages</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{loading ? '—' : todayVisitors}</p>
            <p className="text-xs text-gray-500 mt-1">Unique Visitors</p>
          </div>
        </div>
      </div>

      {/* Recent Conversations */}
      <div className="bg-white border border-gray-200 shadow-card">
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
                href={`/conversations/detail?id=${session.session_id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 hover:border-l-[3px] hover:border-l-tobie-400 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Session: {session.session_id.slice(0, 8)}...
                    </p>
                    {session.device_type && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 font-medium">
                        {session.device_type}
                      </span>
                    )}
                    {session.browser && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-tobie-50 text-tobie-600 font-medium">
                        {session.browser}
                      </span>
                    )}
                  </div>
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
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border ${
        styles[status] || 'bg-gray-50 text-gray-700 border-gray-200'
      }`}
    >
      {status}
    </span>
  );
}
