'use client';

import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { CHART_COLORS, formatNumber, getTrend } from './chart-theme';

interface TrendCardProps {
  label: string;
  value: number;
  previousValue: number;
  sparklineData: { value: number }[];
  icon: React.ReactNode;
  color?: string;
  suffix?: string;
  formatValue?: (v: number) => string;
}

export function TrendCard({
  label,
  value,
  previousValue,
  sparklineData,
  icon,
  color = CHART_COLORS.primary,
  suffix = '',
  formatValue,
}: TrendCardProps) {
  const trend = getTrend(value, previousValue);
  const displayValue = formatValue ? formatValue(value) : formatNumber(value);

  return (
    <div className="bg-white border border-gray-200 p-5 relative overflow-hidden chart-fade-up">
      {/* Sparkline background */}
      <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparklineData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${label.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.6} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={1.5}
              fill={`url(#gradient-${label.replace(/\s/g, '')})`}
              isAnimationActive={true}
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2" style={{ backgroundColor: `${color}15` }}>
            {icon}
          </div>
          <span className={`text-xs font-semibold ${trend.color}`}>
            {trend.arrow} {trend.percent}
          </span>
        </div>
        <p className="text-2xl font-bold text-gray-900">
          {displayValue}{suffix}
        </p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  );
}
