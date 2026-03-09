'use client';

import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS, TOOLTIP_STYLE, AXIS_STYLE } from './chart-theme';

interface VolumeDataPoint {
  date: string;
  conversations: number;
  messages: number;
}

interface ConversationVolumeChartProps {
  data: VolumeDataPoint[];
  loading?: boolean;
}

type ViewMode = 'conversations' | 'messages';

export function ConversationVolumeChart({ data, loading }: ConversationVolumeChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('conversations');

  if (loading) {
    return (
      <div className="bg-white shadow-card border border-gray-100 border-t-[3px] border-t-tobie-500 p-6 chart-fade-up">
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          Loading chart data...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-card border border-gray-100 border-t-[3px] border-t-tobie-500 p-6 chart-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Conversation Volume</h3>
          <p className="text-xs text-gray-500 mt-0.5">Daily activity over time</p>
        </div>
        <div className="flex gap-1">
          {(['conversations', 'messages'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                viewMode === mode
                  ? 'bg-tobie-100 text-tobie-700'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.2} />
                <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.border} vertical={false} />
            <XAxis
              dataKey="date"
              {...AXIS_STYLE}
              tickFormatter={(val) => {
                const d = new Date(val);
                return `${d.getMonth() + 1}/${d.getDate()}`;
              }}
            />
            <YAxis {...AXIS_STYLE} allowDecimals={false} />
            <Tooltip
              {...TOOLTIP_STYLE}
              labelFormatter={(val) => new Date(val as string).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            />
            <Area
              type="monotone"
              dataKey={viewMode}
              stroke={CHART_COLORS.primary}
              strokeWidth={2}
              fill="url(#volumeGradient)"
              isAnimationActive={true}
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
