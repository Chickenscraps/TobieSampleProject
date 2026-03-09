'use client';

import { CHART_COLORS, formatMs } from './chart-theme';
import { Clock, Zap, TrendingDown, TrendingUp } from 'lucide-react';

interface ResponseMetricsProps {
  avgResponseMs: number;
  medianResponseMs: number;
  p95ResponseMs: number;
  fastestMs: number;
  slowestMs: number;
  totalRequests: number;
  loading?: boolean;
}

export function ResponseMetrics({
  avgResponseMs,
  medianResponseMs,
  p95ResponseMs,
  fastestMs,
  slowestMs,
  totalRequests,
  loading,
}: ResponseMetricsProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 chart-fade-up">
        <div className="h-20 flex items-center justify-center text-gray-400 dark:text-gray-500">
          Loading response metrics...
        </div>
      </div>
    );
  }

  const metrics = [
    {
      label: 'Avg Response',
      value: formatMs(avgResponseMs),
      icon: <Clock className="w-4 h-4" style={{ color: CHART_COLORS.primary }} />,
      color: CHART_COLORS.primary,
    },
    {
      label: 'Median',
      value: formatMs(medianResponseMs),
      icon: <Zap className="w-4 h-4" style={{ color: CHART_COLORS.accent }} />,
      color: CHART_COLORS.accent,
    },
    {
      label: 'P95',
      value: formatMs(p95ResponseMs),
      icon: <TrendingUp className="w-4 h-4" style={{ color: CHART_COLORS.warning }} />,
      color: CHART_COLORS.warning,
    },
    {
      label: 'Fastest',
      value: formatMs(fastestMs),
      icon: <TrendingDown className="w-4 h-4" style={{ color: CHART_COLORS.success }} />,
      color: CHART_COLORS.success,
    },
    {
      label: 'Slowest',
      value: formatMs(slowestMs),
      icon: <TrendingUp className="w-4 h-4" style={{ color: CHART_COLORS.danger }} />,
      color: CHART_COLORS.danger,
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 chart-fade-up">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">AI Response Performance</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Gemini API response times across {totalRequests.toLocaleString()} requests</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="p-1.5" style={{ backgroundColor: `${m.color}15` }}>
                {m.icon}
              </div>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{m.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
