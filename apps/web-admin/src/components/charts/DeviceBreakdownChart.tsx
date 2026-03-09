'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PALETTE, TOOLTIP_STYLE, AXIS_STYLE } from './chart-theme';
import { Monitor, Smartphone, Globe } from 'lucide-react';

interface BreakdownData {
  name: string;
  value: number;
}

interface DeviceBreakdownChartProps {
  devices: BreakdownData[];
  browsers: BreakdownData[];
  os: BreakdownData[];
  loading?: boolean;
}

function BreakdownSection({
  title,
  icon,
  data,
  palette,
}: {
  title: string;
  icon: React.ReactNode;
  data: BreakdownData[];
  palette: readonly string[];
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</h4>
      </div>
      <div className="h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={70}
              {...AXIS_STYLE}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              {...TOOLTIP_STYLE}
              formatter={(value) => {
                const v = Number(value);
                return [`${v} (${total > 0 ? ((v / total) * 100).toFixed(1) : 0}%)`, 'Sessions'];
              }}
            />
            <Bar dataKey="value" barSize={16} isAnimationActive animationDuration={800}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function DeviceBreakdownChart({ devices, browsers, os, loading }: DeviceBreakdownChartProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 chart-fade-up">
        <div className="h-[460px] flex items-center justify-center text-gray-400 dark:text-gray-500">
          Loading device data...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 chart-fade-up">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Device & Browser Breakdown</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">How employees access the benefits assistant</p>
      </div>

      <div className="space-y-6">
        <BreakdownSection
          title="Device Type"
          icon={<Monitor className="w-4 h-4 text-gray-400 dark:text-gray-500" />}
          data={devices}
          palette={[PALETTE[0], PALETTE[1], PALETTE[2]]}
        />
        <BreakdownSection
          title="Browser"
          icon={<Globe className="w-4 h-4 text-gray-400 dark:text-gray-500" />}
          data={browsers}
          palette={[PALETTE[0], PALETTE[3], PALETTE[4], PALETTE[5], PALETTE[6]]}
        />
        <BreakdownSection
          title="Operating System"
          icon={<Smartphone className="w-4 h-4 text-gray-400 dark:text-gray-500" />}
          data={os}
          palette={[PALETTE[0], PALETTE[1], PALETTE[2], PALETTE[3], PALETTE[4], PALETTE[5]]}
        />
      </div>
    </div>
  );
}
