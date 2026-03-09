'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PALETTE, TOOLTIP_STYLE, AXIS_STYLE } from './chart-theme';

interface ReferrerData {
  domain: string;
  visits: number;
}

interface ReferrerChartProps {
  data: ReferrerData[];
  loading?: boolean;
}

export function ReferrerChart({ data, loading }: ReferrerChartProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-card border border-gray-100 dark:border-gray-700 border-t-[3px] border-t-tobie-500 p-6 chart-fade-up">
        <div className="h-[260px] flex items-center justify-center text-gray-400">
          Loading referrer data...
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.visits, 0);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-card border border-gray-100 dark:border-gray-700 border-t-[3px] border-t-tobie-500 p-6 chart-fade-up">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Traffic Sources</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Where visitors arrive from</p>
      </div>

      {data.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">
          No referrer data yet
        </div>
      ) : (
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.slice(0, 8)} layout="vertical" margin={{ top: 0, right: 50, left: 0, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="domain"
                width={100}
                {...AXIS_STYLE}
                axisLine={false}
                tickLine={false}
                tick={{ ...AXIS_STYLE.tick, fontSize: 10 }}
              />
              <Tooltip
                {...TOOLTIP_STYLE}
                formatter={(value) => {
                  const v = Number(value);
                  return [`${v} visit${v !== 1 ? 's' : ''} (${total > 0 ? ((v / total) * 100).toFixed(1) : 0}%)`, 'Traffic'];
                }}
              />
              <Bar dataKey="visits" barSize={14} isAnimationActive animationDuration={800}>
                {data.slice(0, 8).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
