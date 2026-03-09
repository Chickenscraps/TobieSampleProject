'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { PALETTE, TOOLTIP_STYLE } from './chart-theme';

interface TopicData {
  name: string;
  value: number;
}

interface TopicDistributionChartProps {
  data: TopicData[];
  loading?: boolean;
}

export function TopicDistributionChart({ data, loading }: TopicDistributionChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-card border border-gray-100 dark:border-gray-700 border-t-[3px] border-t-tobie-500 p-6 chart-fade-up">
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          Loading topic data...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-card border border-gray-100 dark:border-gray-700 border-t-[3px] border-t-tobie-500 p-6 chart-fade-up">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Topic Distribution</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Most asked about benefit categories</p>
      </div>

      <div className="flex items-center gap-6">
        {/* Donut Chart */}
        <div className="w-[180px] h-[180px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                isAnimationActive={true}
                animationDuration={1000}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip
                {...TOOLTIP_STYLE}
                formatter={(value) => {
                  const v = Number(value);
                  return [`${v} (${total > 0 ? ((v / total) * 100).toFixed(1) : 0}%)`, 'Queries'];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2 overflow-hidden">
          {data.slice(0, 8).map((item, i) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-2.5 h-2.5 flex-shrink-0"
                  style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
                />
                <span className="text-gray-700 dark:text-gray-300 truncate">{item.name}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <span className="text-gray-500 dark:text-gray-400 text-xs">{total > 0 ? ((item.value / total) * 100).toFixed(0) : 0}%</span>
                <span className="font-medium text-gray-900 dark:text-white">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
