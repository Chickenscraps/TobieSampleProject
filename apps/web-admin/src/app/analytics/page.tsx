'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  MessageSquare,
  Users,
  Activity,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { CHART_COLORS } from '@/components/charts/chart-theme';
import { TrendCard } from '@/components/charts/TrendCard';
import { ConversationVolumeChart } from '@/components/charts/ConversationVolumeChart';
import { TopicDistributionChart } from '@/components/charts/TopicDistributionChart';
import { PeakHoursHeatmap } from '@/components/charts/PeakHoursHeatmap';
import { DeviceBreakdownChart } from '@/components/charts/DeviceBreakdownChart';
import { ReferrerChart } from '@/components/charts/ReferrerChart';
import { ResponseMetrics } from '@/components/charts/ResponseMetrics';

type DateRange = '7d' | '30d' | '90d' | 'all';

function getDateFilter(range: DateRange): string | null {
  const now = new Date();
  switch (range) {
    case '7d': return new Date(now.getTime() - 7 * 86400000).toISOString();
    case '30d': return new Date(now.getTime() - 30 * 86400000).toISOString();
    case '90d': return new Date(now.getTime() - 90 * 86400000).toISOString();
    case 'all': return null;
  }
}

function getPreviousPeriodFilter(range: DateRange): { start: string; end: string } | null {
  const now = new Date();
  const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 0;
  if (days === 0) return null;
  return {
    start: new Date(now.getTime() - days * 2 * 86400000).toISOString(),
    end: new Date(now.getTime() - days * 86400000).toISOString(),
  };
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [loading, setLoading] = useState(true);

  // Trend card data
  const [totalConversations, setTotalConversations] = useState(0);
  const [prevConversations, setPrevConversations] = useState(0);
  const [messagesPerDay, setMessagesPerDay] = useState(0);
  const [prevMessagesPerDay, setPrevMessagesPerDay] = useState(0);
  const [uniqueVisitors, setUniqueVisitors] = useState(0);
  const [prevUniqueVisitors, setPrevUniqueVisitors] = useState(0);
  const [avgResponseTime, setAvgResponseTime] = useState(0);
  const [prevAvgResponseTime, setPrevAvgResponseTime] = useState(0);

  // Sparkline data
  const [convSparkline, setConvSparkline] = useState<{ value: number }[]>([]);
  const [msgSparkline, setMsgSparkline] = useState<{ value: number }[]>([]);
  const [visitorSparkline, setVisitorSparkline] = useState<{ value: number }[]>([]);
  const [responseSparkline, setResponseSparkline] = useState<{ value: number }[]>([]);

  // Chart data
  const [volumeData, setVolumeData] = useState<{ date: string; conversations: number; messages: number }[]>([]);
  const [topicData, setTopicData] = useState<{ name: string; value: number }[]>([]);
  const [heatmapData, setHeatmapData] = useState<{ grid: number[][] }>({ grid: Array.from({ length: 7 }, () => new Array(24).fill(0)) });
  const [deviceData, setDeviceData] = useState<{ name: string; value: number }[]>([]);
  const [browserData, setBrowserData] = useState<{ name: string; value: number }[]>([]);
  const [osData, setOsData] = useState<{ name: string; value: number }[]>([]);
  const [referrerData, setReferrerData] = useState<{ domain: string; visits: number }[]>([]);
  const [responseMetrics, setResponseMetrics] = useState({
    avg: 0, median: 0, p95: 0, fastest: 0, slowest: 0, total: 0,
  });

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const dateFilter = getDateFilter(dateRange);
      const prevPeriod = getPreviousPeriodFilter(dateRange);

      // ── Fetch sessions & transcripts for current period ──
      let sessionsQuery = supabase.from('chat_sessions').select('*');
      let transcriptsQuery = supabase.from('chat_transcripts').select('*');
      let pageViewsQuery = supabase.from('page_analytics').select('*');

      if (dateFilter) {
        sessionsQuery = sessionsQuery.gte('created_at', dateFilter);
        transcriptsQuery = transcriptsQuery.gte('created_at', dateFilter);
        pageViewsQuery = pageViewsQuery.gte('created_at', dateFilter);
      }

      const [sessionsRes, transcriptsRes, pageViewsRes] = await Promise.all([
        sessionsQuery,
        transcriptsQuery,
        pageViewsQuery,
      ]);

      const sessions = sessionsRes.data || [];
      const transcripts = transcriptsRes.data || [];
      const pageViews = pageViewsRes.data || [];

      // ── Previous period for comparison ──
      let prevSessions: typeof sessions = [];
      let prevTranscripts: typeof transcripts = [];
      let prevPageViews: typeof pageViews = [];

      if (prevPeriod) {
        const [prevSessRes, prevTransRes, prevPVRes] = await Promise.all([
          supabase.from('chat_sessions').select('*').gte('created_at', prevPeriod.start).lt('created_at', prevPeriod.end),
          supabase.from('chat_transcripts').select('*').gte('created_at', prevPeriod.start).lt('created_at', prevPeriod.end),
          supabase.from('page_analytics').select('*').gte('created_at', prevPeriod.start).lt('created_at', prevPeriod.end),
        ]);
        prevSessions = prevSessRes.data || [];
        prevTranscripts = prevTransRes.data || [];
        prevPageViews = prevPVRes.data || [];
      }

      // ── Trend Card: Total Conversations ──
      setTotalConversations(sessions.length);
      setPrevConversations(prevSessions.length);

      // ── Trend Card: Messages/Day ──
      const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : Math.max(1, Math.ceil((Date.now() - new Date(transcripts[transcripts.length - 1]?.created_at || Date.now()).getTime()) / 86400000));
      setMessagesPerDay(days > 0 ? Math.round(transcripts.length / days) : 0);
      const prevDays = prevPeriod ? days : 1;
      setPrevMessagesPerDay(prevDays > 0 ? Math.round(prevTranscripts.length / prevDays) : 0);

      // ── Trend Card: Unique Visitors ──
      const currentVisitorIds = sessions.map(s => s.visitor_id).filter(Boolean);
      const pvVisitorIds = pageViews.map(p => p.visitor_id).filter(Boolean);
      const allVisitors = new Set(currentVisitorIds.concat(pvVisitorIds));
      setUniqueVisitors(allVisitors.size);
      const prevVisitorIds = prevSessions.map(s => s.visitor_id).filter(Boolean)
        .concat(prevPageViews.map(p => p.visitor_id).filter(Boolean));
      const prevVisitorSet = new Set(prevVisitorIds);
      setPrevUniqueVisitors(prevVisitorSet.size);

      // ── Trend Card: Avg Response Time ──
      const responseTimes = transcripts
        .map(t => t.metadata?.response_time_ms)
        .filter((v): v is number => typeof v === 'number' && v > 0);
      const avgResp = responseTimes.length > 0 ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : 0;
      setAvgResponseTime(avgResp);
      const prevResponseTimes = prevTranscripts
        .map(t => t.metadata?.response_time_ms)
        .filter((v): v is number => typeof v === 'number' && v > 0);
      const prevAvgResp = prevResponseTimes.length > 0 ? prevResponseTimes.reduce((a, b) => a + b, 0) / prevResponseTimes.length : 0;
      setPrevAvgResponseTime(prevAvgResp);

      // ── Sparklines (daily buckets for last N days) ──
      const sparkDays = Math.min(days, 14);
      const convByDay: Record<string, number> = {};
      const msgByDay: Record<string, number> = {};
      const visByDay: Record<string, Set<string>> = {};
      const respByDay: Record<string, number[]> = {};

      for (let i = 0; i < sparkDays; i++) {
        const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
        convByDay[d] = 0;
        msgByDay[d] = 0;
        visByDay[d] = new Set();
        respByDay[d] = [];
      }

      sessions.forEach(s => {
        const d = s.created_at?.slice(0, 10);
        if (d && convByDay[d] !== undefined) convByDay[d]++;
        if (d && visByDay[d] && s.visitor_id) visByDay[d].add(s.visitor_id);
      });

      transcripts.forEach(t => {
        const d = t.created_at?.slice(0, 10);
        if (d && msgByDay[d] !== undefined) msgByDay[d]++;
        const rt = t.metadata?.response_time_ms;
        if (d && respByDay[d] && typeof rt === 'number') respByDay[d].push(rt);
      });

      const sortedDays = Object.keys(convByDay).sort();
      setConvSparkline(sortedDays.map(d => ({ value: convByDay[d] })));
      setMsgSparkline(sortedDays.map(d => ({ value: msgByDay[d] })));
      setVisitorSparkline(sortedDays.map(d => ({ value: visByDay[d]?.size || 0 })));
      setResponseSparkline(sortedDays.map(d => ({
        value: respByDay[d]?.length > 0 ? respByDay[d].reduce((a, b) => a + b, 0) / respByDay[d].length : 0,
      })));

      // ── Volume Chart (daily) ──
      const volumeDays = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : 60;
      const volData: { date: string; conversations: number; messages: number }[] = [];
      for (let i = volumeDays - 1; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
        const convCount = sessions.filter(s => s.created_at?.slice(0, 10) === d).length;
        const msgCount = transcripts.filter(t => t.created_at?.slice(0, 10) === d).length;
        volData.push({ date: d, conversations: convCount, messages: msgCount });
      }
      setVolumeData(volData);

      // ── Topic Distribution ──
      const topicMap: Record<string, number> = {};
      transcripts.forEach(t => {
        const sources = t.sources_used;
        if (Array.isArray(sources)) {
          sources.forEach((src: string) => {
            if (src && src !== 'General') {
              topicMap[src] = (topicMap[src] || 0) + 1;
            }
          });
        }
      });
      const topicArr = Object.entries(topicMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
      setTopicData(topicArr);

      // ── Peak Hours Heatmap ──
      const grid = Array.from({ length: 7 }, () => new Array(24).fill(0));
      sessions.forEach(s => {
        const dt = new Date(s.created_at);
        const dayIdx = (dt.getDay() + 6) % 7; // Monday=0
        const hour = dt.getHours();
        grid[dayIdx][hour]++;
      });
      setHeatmapData({ grid });

      // ── Device Breakdown ──
      const deviceMap: Record<string, number> = {};
      const browserMap: Record<string, number> = {};
      const osMap: Record<string, number> = {};

      transcripts.forEach(t => {
        const md = t.metadata || {};
        if (md.device_type) deviceMap[md.device_type] = (deviceMap[md.device_type] || 0) + 1;
        if (md.browser) browserMap[md.browser] = (browserMap[md.browser] || 0) + 1;
        if (md.os) osMap[md.os] = (osMap[md.os] || 0) + 1;
      });

      // Also use session-level data as fallback
      sessions.forEach(s => {
        if (s.device_type && !deviceMap[s.device_type]) deviceMap[s.device_type] = (deviceMap[s.device_type] || 0) + 1;
        if (s.browser && !browserMap[s.browser]) browserMap[s.browser] = (browserMap[s.browser] || 0) + 1;
        if (s.os && !osMap[s.os]) osMap[s.os] = (osMap[s.os] || 0) + 1;
      });

      const toSorted = (map: Record<string, number>) =>
        Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

      setDeviceData(toSorted(deviceMap));
      setBrowserData(toSorted(browserMap));
      setOsData(toSorted(osMap));

      // ── Referrer Chart ──
      const refMap: Record<string, number> = {};
      pageViews.forEach(pv => {
        const domain = pv.referrer_domain || 'direct';
        refMap[domain] = (refMap[domain] || 0) + 1;
      });
      setReferrerData(
        Object.entries(refMap)
          .map(([domain, visits]) => ({ domain, visits }))
          .sort((a, b) => b.visits - a.visits)
          .slice(0, 10)
      );

      // ── Response Metrics ──
      if (responseTimes.length > 0) {
        const sorted = [...responseTimes].sort((a, b) => a - b);
        setResponseMetrics({
          avg: avgResp,
          median: sorted[Math.floor(sorted.length / 2)],
          p95: sorted[Math.floor(sorted.length * 0.95)],
          fastest: sorted[0],
          slowest: sorted[sorted.length - 1],
          total: sorted.length,
        });
      } else {
        setResponseMetrics({ avg: 0, median: 0, p95: 0, fastest: 0, slowest: 0, total: 0 });
      }

    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    loadAnalytics();

    // Log admin event
    supabase.from('admin_events').insert({
      actor_id: 'admin',
      event_type: 'view_analytics',
      details: { dateRange },
    });
  }, [loadAnalytics, dateRange]);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Chat usage, visitor trends, and performance insights.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Date Range Selector */}
          <div className="flex gap-1 bg-gray-100 p-1">
            {(['7d', '30d', '90d', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  dateRange === range
                    ? 'bg-white text-tobie-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {range === 'all' ? 'All Time' : `Last ${range}`}
              </button>
            ))}
          </div>
          <button
            onClick={loadAnalytics}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Row 1: Trend Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <TrendCard
          label="Total Conversations"
          value={totalConversations}
          previousValue={prevConversations}
          sparklineData={convSparkline}
          icon={<MessageSquare className="w-5 h-5" style={{ color: CHART_COLORS.primary }} />}
          color={CHART_COLORS.primary}
        />
        <TrendCard
          label="Messages / Day"
          value={messagesPerDay}
          previousValue={prevMessagesPerDay}
          sparklineData={msgSparkline}
          icon={<Activity className="w-5 h-5" style={{ color: CHART_COLORS.success }} />}
          color={CHART_COLORS.success}
        />
        <TrendCard
          label="Unique Visitors"
          value={uniqueVisitors}
          previousValue={prevUniqueVisitors}
          sparklineData={visitorSparkline}
          icon={<Users className="w-5 h-5" style={{ color: CHART_COLORS.info }} />}
          color={CHART_COLORS.info}
        />
        <TrendCard
          label="Avg Response Time"
          value={avgResponseTime}
          previousValue={prevAvgResponseTime}
          sparklineData={responseSparkline}
          icon={<Clock className="w-5 h-5" style={{ color: CHART_COLORS.accent }} />}
          color={CHART_COLORS.accent}
          formatValue={(v) => v > 0 ? `${(v / 1000).toFixed(1)}s` : '—'}
        />
      </div>

      {/* Row 2: Conversation Volume (full width) */}
      <div className="mb-6">
        <ConversationVolumeChart data={volumeData} loading={loading} />
      </div>

      {/* Row 3: Topic Distribution + Peak Hours (2-column) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TopicDistributionChart data={topicData} loading={loading} />
        <PeakHoursHeatmap data={heatmapData} loading={loading} />
      </div>

      {/* Row 4: Device Breakdown + Referrer Chart (2-column) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DeviceBreakdownChart
          devices={deviceData}
          browsers={browserData}
          os={osData}
          loading={loading}
        />
        <ReferrerChart data={referrerData} loading={loading} />
      </div>

      {/* Row 5: Response Metrics (full width) */}
      <div className="mb-6">
        <ResponseMetrics
          avgResponseMs={responseMetrics.avg}
          medianResponseMs={responseMetrics.median}
          p95ResponseMs={responseMetrics.p95}
          fastestMs={responseMetrics.fastest}
          slowestMs={responseMetrics.slowest}
          totalRequests={responseMetrics.total}
          loading={loading}
        />
      </div>
    </div>
  );
}
